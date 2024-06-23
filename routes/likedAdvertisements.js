import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';
import { insertIntoLikedAds, updateLikeNumber } from '../utils/likedAdsUtils.js';

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
  const { userId, advertisementId } = req.body;

  try {
    if (!advertisementId) {
      return res.status(400).json({ error: 'advertisementId is required' });
    }

    insertIntoLikedAds(userId, advertisementId);

    await updateLikeNumber(advertisementId);

    return res.status(200).json({ message: 'Liked advertisement updated successfully', advertisementId });
  } catch (error) {
    console.error('Error adding liked advertisement:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
