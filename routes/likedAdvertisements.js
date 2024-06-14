import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

router.post('/', async (req, res) => {
  const { userId, advertisementId } = req.body;

  try {
    if (!advertisementId) {
      return res.status(400).json({ error: 'advertisementId is required' });
    }

    const result = await pool.query('INSERT INTO liked_ads (user_id, advertisement_id) VALUES (?, ?)', [
      userId,
      advertisementId,
    ]);

    return res.status(200).json({ message: 'Liked advertisement updated successfully', advertisementId });
  } catch (error) {
    console.error('Error adding liked advertisement:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
