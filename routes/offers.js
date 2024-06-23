import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import pool from '../db/connection.js';

const router = express.Router();

router.post('/:offerId/accept', authMiddleware, async (req, res) => {
  const { offerId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM offers WHERE id = ?', [offerId]);

    if (result.length > 0 && result[0].length > 0) {
      const offer = result[0][0];
      const { user_id, price } = offer;

      const buyer = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [user_id]);
      const buyerUserName = buyer[0][0].username;

      await pool.query('INSERT INTO messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)', [
        req.user.id,
        user_id,
        `Your offer of $${price} has been accepted! You bought the car!`,
      ]);

      await pool.query('DELETE FROM offers WHERE id = ?', [offerId]);
      await pool.query('DELETE FROM cart WHERE advertisement_id = ?', [offer.advertisement_id]);
      await pool.query('DELETE FROM fenykep WHERE advertisement_id = ?', [offer.advertisement_id]);
      await pool.query('DELETE FROM offers WHERE advertisement_id = ?', [offer.advertisement_id]);
      await pool.query('DELETE FROM liked_ads WHERE advertisement_id = ?', [offer.advertisement_id]);
      await pool.query('DELETE FROM hirdetes WHERE id = ?', [offer.advertisement_id]);

      const message = `You sold your car for $${price} to ${buyerUserName}!`;

      res.json({ success: true, message: message });
    } else {
      res.status(404).json({ success: false, message: 'Offer not found' });
    }
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/:offerId/decline', authMiddleware, async (req, res) => {
  const { offerId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM offers WHERE id = ?', [offerId]);
    if (result.length > 0) {
      await pool.query('DELETE FROM offers WHERE id = ?', [offerId]);
      res.json({ success: true, message: 'Offer sucessfully declined' });
    } else {
      res.status(404).json({ success: false, message: 'Offer not found' });
    }
  } catch (error) {
    console.error('Error declining offer:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
