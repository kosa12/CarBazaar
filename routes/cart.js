import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { deleteAD, insertIntoMessages } from '../utils/advertisementUtils.js';
import {
  insertOffer,
  getFelhasznalo,
  getOffers,
  deleteCartRow,
  getHirdetes,
  getCartRow,
  insertCart,
  updateOffer,
} from '../utils/cartUtils.js';

const router = express.Router();

router.post('/add-to-cart', authMiddleware, async (req, res) => {
  const { advertisementId, userId } = req.body;

  try {
    const [userRows] = await getFelhasznalo(userId);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await getHirdetes(advertisementId);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [existingCartRows] = await getCartRow(userId, advertisementId);

    if (existingCartRows.length > 0) {
      return res.status(400).json({ success: false, message: 'Advertisement already in cart' });
    }

    await insertCart(userId, advertisementId);

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
    const [userRows] = await getFelhasznalo(userId);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await getHirdetes(advertisementId);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [cartRows] = await deleteCartRow(userId, advertisementId);

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
    const [userRows] = await getFelhasznalo(userId);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await getHirdetes(advertisementId);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [cartRows] = await getCartRow(userId, advertisementId);
    if (cartRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found in cart' });
    }

    const ownerUserId = adRows[0].user_id;
    const message = `Your car ${adRows[0].brand} has been purchased for $${adRows[0].price}!`;

    await insertIntoMessages(userId, ownerUserId, message);
    await deleteAD(advertisementId);

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
    const [userRows] = await getFelhasznalo(userId);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [adRows] = await getHirdetes(advertisementId);
    if (adRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const [existingOfferRows] = await getOffers(userId, advertisementId);

    if (existingOfferRows.length > 0) {
      await updateOffer(userId, advertisementId, offerAmount);
      res.json({ success: true, message: 'Offer updated successfully!' });
    } else {
      await insertOffer(userId, advertisementId, offerAmount);
      console.log('Offer placed successfully!');
      res.json({ success: true, message: 'Offer placed successfully!' });
    }
  } catch (error) {
    console.error('Error placing offer:', error);
    res.status(500).json({ success: false, message: 'An error occurred while placing the offer' });
  }
});

export default router;
