import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { getOffers, getBuyer, deleteOffer } from '../utils/offerUtils.js';
import { deleteAD, insertIntoMessages } from '../utils/advertisementUtils.js';

const router = express.Router();

router.post('/:offerId/accept', authMiddleware, async (req, res) => {
  const { offerId } = req.params;
  try {
    const result = await getOffers(offerId);

    if (result.length > 0 && result[0].length > 0) {
      const offer = result[0][0];
      const { user_id, price } = offer;

      const buyer = await getBuyer(user_id);
      const buyerUserName = buyer[0][0].username;

      const messageForChat = `Your offer of $${price} has been accepted! You bought the car!`;
      await insertIntoMessages(req.user.id, user_id, messageForChat);

      await deleteAD(offer.advertisement_id);

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
    const result = await getOffers(offerId);
    if (result.length > 0) {
      await deleteOffer(offerId);
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
