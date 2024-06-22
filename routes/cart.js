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

export default router;
