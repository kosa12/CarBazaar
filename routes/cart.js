import express from 'express';
import pool from '../db/connection.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/add-to-cart', authMiddleware, async (req, res) => {
  const { advertisementId, userId } = req.body;

  try {
    const [userRows] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await pool.query('SELECT * FROM hirdetes WHERE id = ?', [advertisementId]);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [existingCartRows] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);

    if (existingCartRows.length > 0) {
      return res.status(400).json({ success: false, message: 'Advertisement already in cart' });
    }

    await pool.query('INSERT INTO cart (user_id, advertisement_id) VALUES (?, ?)', [userId, advertisementId]);

    res.json({ success: true, message: 'Advertisement added to cart successfully!' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'An error occurred while adding to the cart' });
  }
});

router.delete('/remove/:advertisementId', authMiddleware, async (req, res) => {
  const { advertisementId } = req.params;
  const userId = req.user.id;

  try {
    const [userRows] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await pool.query('SELECT * FROM hirdetes WHERE id = ?', [advertisementId]);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [cartRows] = await pool.query('DELETE FROM cart WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);

    if (cartRows.affectedRows > 0) {
      res.json({ success: true, message: 'Advertisement removed from cart successfully!' });
    } else {
      res.status(404).json({ success: false, message: 'Advertisement not found in cart' });
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'An error occurred while removing from the cart' });
  }
});

router.post('/buy/:advertisementId', authMiddleware, async (req, res) => {
  const { advertisementId } = req.params;
  const userId = req.user.id;

  try {
    const [userRows] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await pool.query('SELECT * FROM hirdetes WHERE id = ?', [advertisementId]);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [cartRows] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);
    if (cartRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found in cart' });
    }

    await pool.query('DELETE FROM cart WHERE advertisement_id = ?', [advertisementId]);

    await pool.query('DELETE FROM fenykep WHERE advertisement_id = ?', [advertisementId]);

    const ownerUserId = adRows[0].user_id;
    await pool.query('INSERT INTO messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)', [
      userId,
      ownerUserId,
      `Your car ${adRows[0].brand} has been purchased.`,
    ]);

    await pool.query('DELETE FROM hirdetes WHERE id = ?', [advertisementId]);

    res.json({ success: true, message: 'Car purchased successfully!' });
  } catch (error) {
    console.error('Error buying advertisement:', error);
    res.status(500).json({ success: false, message: 'An error occurred while buying the advertisement' });
  }
});

router.post('/offer/:advertisementId', authMiddleware, async (req, res) => {
  const { advertisementId } = req.params;
  const { offerAmount } = req.body;
  const userId = req.user.id;

  try {
    const [userRows] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await pool.query('SELECT * FROM hirdetes WHERE id = ?', [advertisementId]);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [existingOfferRows] = await pool.query('SELECT * FROM offers WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);

    if (existingOfferRows.length > 0) {
      await pool.query('UPDATE offers SET price = ? WHERE user_id = ? AND advertisement_id = ?', [
        offerAmount,
        userId,
        advertisementId,
      ]);
      res.json({ success: true, message: 'Offer updated successfully!' });
    } else {
      await pool.query('INSERT INTO offers (user_id, advertisement_id, price) VALUES (?, ?, ?)', [
        userId,
        advertisementId,
        offerAmount,
      ]);
      console.log('Offer placed successfully!');
      res.json({ success: true, message: 'Offer placed successfully!' });
    }
  } catch (error) {
    console.error('Error placing offer:', error);
    res.status(500).json({ success: false, message: 'An error occurred while placing the offer' });
  }
});

export default router;
