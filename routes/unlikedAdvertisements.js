import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';
import pool from '../db/connection.js';
import { deleteLikedAd, updateAdLikes } from '../utils/unlikedUtils.js';

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
  const { userId, advertisementId } = req.body;

  try {
    if (!advertisementId) {
      return res.status(400).json({ error: 'advertisementId is required' });
    }

    const result = await deleteLikedAd(userId, advertisementId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Liked advertisement not found' });
    }

    await updateAdLikes(advertisementId);

    return res.status(200).json({ message: 'Advertisement unliked successfully', advertisementId });
  } catch (error) {
    console.error('Error unliking advertisement:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
