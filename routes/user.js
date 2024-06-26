import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../db/connection.js';
import verifyToken from '../middlewares/auth.js';
import { getAdvertisementImage } from '../utils/advertisementUtils.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM felhasznalo');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const [adRows] = await pool.query('SELECT * FROM hirdetes where user_id = ? ORDER BY id DESC', [userId]);
    const advertisements = await Promise.all(
      adRows.map(async (ad) => {
        const imageUrl = await getAdvertisementImage(ad.id);
        return {
          id: ad.id,
          brand: ad.brand,
          city: ad.city,
          price: ad.price,
          date: ad.date,
          imageUrl,
        };
      }),
    );
    const [results] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    if (results.length > 0) {
      return res.render('username', { user: results[0], advertisements });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    return res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/:id/settings', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const [userSettings] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);

    if (userSettings.length > 0) {
      return res.render('settings', { userSettings: userSettings[0] });
    }

    return res.status(404).json({ message: 'User settings not found' });
  } catch (err) {
    return res.status(500).json({ error: 'Database query error' });
  }
});

router.post('/:id/settings/username', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { newUsername } = req.body;

  if (req.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const checkUsernameQuery = 'SELECT COUNT(*) AS count FROM felhasznalo WHERE username = ?';
    const [checkResult] = await pool.query(checkUsernameQuery, [newUsername]);

    if (checkResult[0].count > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const updateQuery = 'UPDATE felhasznalo SET username = ? WHERE id = ?';
    const [updateResult] = await pool.query(updateQuery, [newUsername, userId]);

    if (updateResult.affectedRows > 0) {
      return res.status(200).json({ message: 'Username updated successfully' });
    }
    return res.status(404).json({ error: 'User not found or username not updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database query error' });
  }
});

function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
    return errors;
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
    return errors;
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
    return errors;
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number.');
    return errors;
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (e.g., @, $, !, %, *, ?, &).');
    return errors;
  }

  return errors;
}

router.post('/:id/settings/password', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { currentPassword, newPassword } = req.body;

  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ error: passwordErrors });
  }

  try {
    const [user] = await pool.query('SELECT user_password FROM felhasznalo WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPasswordHash = user[0].user_password;

    const passwordMatch = await bcrypt.compare(currentPassword, userPasswordHash);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const updateQuery = 'UPDATE felhasznalo SET user_password = ? WHERE id = ?';
    const respone = await pool.query(updateQuery, [newPasswordHash, userId]);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Database query error!' });
  }
});

router.get('/:id/likedlist', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const likedAdsQuery = 'SELECT DISTINCT advertisement_id FROM liked_ads WHERE user_id = ?';
    const [likedRows] = await pool.query(likedAdsQuery, [userId]);
    const likedAdvertisements = likedRows.map((row) => row.advertisement_id);

    const adsQuery = `
      SELECT h.*, f.filename AS imageUrl
      FROM hirdetes h
      LEFT JOIN (
        SELECT advertisement_id, MIN(filename) AS filename
        FROM fenykep
        GROUP BY advertisement_id
      ) f ON h.id = f.advertisement_id
      WHERE h.id IN (?)
    `;

    if (likedAdvertisements.length === 0) {
      return res.render('likedlist', { user: {}, likedAdvertisements: [] });
    }
    const [adsResults] = await pool.query(adsQuery, [likedAdvertisements]);

    const userQuery = 'SELECT * FROM felhasznalo WHERE id = ?';
    const [userResults] = await pool.query(userQuery, [userId]);
    const user = userResults[0];

    res.render('likedlist', { user, likedAdvertisements: adsResults });
  } catch (error) {
    console.error('Error fetching liked advertisements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/cart', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const distinctAdsForUser = 'SELECT DISTINCT advertisement_id FROM cart WHERE user_id = ?';
    const [carRows] = await pool.query(distinctAdsForUser, [userId]);
    const cartAds = carRows.map((row) => row.advertisement_id);

    console.log(cartAds);

    if (cartAds.length === 0) {
      return res.render('cart', { user: {}, cartAds: [] });
    }

    const adsQuery = `
      SELECT h.*, f.filename AS imageUrl
      FROM hirdetes h
      LEFT JOIN (
        SELECT advertisement_id, MIN(filename) AS filename
        FROM fenykep
        GROUP BY advertisement_id
      ) f ON h.id = f.advertisement_id
      WHERE h.id IN (?)
    `;

    const [adsResults] = await pool.query(adsQuery, [cartAds]);

    const userQuery = 'SELECT * FROM felhasznalo WHERE id = ?';
    const [userResults] = await pool.query(userQuery, [userId]);
    const user = userResults[0];

    res.render('cart', { user, cartAds: adsResults });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/admintable', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (req.userId !== userId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const userQuery = 'SELECT * FROM felhasznalo WHERE id = ?';
    const [userResults] = await pool.query(userQuery, [userId]);
    const user = userResults[0];
    const userRole = user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const adsQuery = 'SELECT * FROM hirdetes';
    const [adsResults] = await pool.query(adsQuery);
    const advertisements = adsResults;

    const likesQuery = `
      SELECT liked_ads.advertisement_id, GROUP_CONCAT(f.username) AS usernames
      FROM liked_ads
      JOIN felhasznalo f ON liked_ads.user_id = f.id
      GROUP BY liked_ads.advertisement_id
    `;
    const [likesResults] = await pool.query(likesQuery);
    const likes = {};
    likesResults.forEach((row) => {
      likes[row.advertisement_id] = row.usernames.split(',');
    });

    const cartQuery = `
      SELECT cart.advertisement_id, COUNT(f.id) AS num_users
      FROM cart
      JOIN felhasznalo f ON cart.user_id = f.id
      GROUP BY cart.advertisement_id
    `;
    const [cartResults] = await pool.query(cartQuery);
    const cart = {};
    cartResults.forEach((row) => {
      cart[row.advertisement_id] = row.num_users;
    });

    res.render('adminTable', { advertisements, user, likes, cart });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
