import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import pool from '../db/connection.js';

const router = express.Router();

router.post('/:offerId/accept', authMiddleware, async (req, res) => {
  const { offerId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM offers WHERE id = ?', [offerId]);

    if (result.length > 0) {
      res.json({ success: true, message: 'Offer accepted' });
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
      res.json({ success: true, message: 'Offer declined' });
    } else {
      res.status(404).json({ success: false, message: 'Offer not found' });
    }
  } catch (error) {
    console.error('Error declining offer:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
