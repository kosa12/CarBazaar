import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import cookieParser from 'cookie-parser';
import authMiddleware from '../middlewares/auth.js';
import {
  getAdvertisementDetails,
  deleteAdvertisementImage,
  isUserOwnerOfAdvertisement,
  getImage,
  getUsers,
  insertIntoHirdetes,
  getUserNameOffer,
  getIDfromFelhasznalo,
  insertIntoMessages,
  deleteAD,
} from '../utils/advertisementUtils.js';
import { deleteFile } from '../utils/fileUtils.js';

const router = express.Router();

router.use(cookieParser());
router.use(authMiddleware);

router.get('/new', async (req, res) => {
  try {
    const [users] = getUsers();
    res.render('new_advertisement', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  const { brand, city, price, date, fuel_type, transmission, car_condition, body_type, color, kilometers } = req.body;
  const { userId } = req;

  if (
    !brand ||
    !city ||
    !price ||
    !date ||
    !userId ||
    !fuel_type ||
    !transmission ||
    !car_condition ||
    !body_type ||
    !color ||
    !kilometers
  ) {
    return res.status(400).send('Missing required fields.');
  }

  if (Number.isNaN(Number(price))) {
    return res.status(400).send('Invalid data format for price.');
  }

  if (Number.isNaN(Number(kilometers))) {
    return res.status(400).send('Invalid data format for kilometers.');
  }

  try {
    const id = uuidv4();
    insertIntoHirdetes(
      id,
      brand,
      city,
      price,
      date,
      fuel_type,
      transmission,
      car_condition,
      body_type,
      color,
      kilometers,
      userId,
    );
    res.redirect('/');
    return null;
  } catch (error) {
    console.error('Error inserting advertisement into database:', error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  const advertisementId = req.params.id;
  if (advertisementId) {
    try {
      const advertisement = await getAdvertisementDetails(advertisementId);
      advertisement.date = new Date(advertisement.date).toLocaleDateString();
      const partialPath = path.join('partials', 'image_upload_form.ejs');
      res.render('advertisement_details', { advertisement, partialPath, user: req.user });
    } catch (error) {
      res.redirect('/');
    }
  }
});

router.get('/:id/details', async (req, res) => {
  const adId = req.params.id;
  try {
    const adDetails = await getAdvertisementDetails(adId);
    res.json(adDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch advertisement details' });
  }
});

router.delete('/:id', async (req, res) => {
  const adId = req.params.id;
  const userId = req.user.id;

  try {
    const isOwner = await isUserOwnerOfAdvertisement(adId, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Permission denied: You are not the owner of this advertisement' });
    }
    const imagePath = await getImage(adId);
    const filename = imagePath.split('/').pop();
    const result = await deleteAdvertisementImage(adId, filename);
    const currentDir = 'kmim2252'; // hardcoded mert nem tudom mi a dinamikusan
    if (result.affectedRows > 0) {
      const absolutePath = path.join(currentDir, '..', imagePath);
      if (absolutePath) {
        await deleteFile(absolutePath);
        return res.status(200).send();
      }
      return res.status(404).json({ error: 'Advertisement image not found' });
    }
    return res.status(404).json({ error: 'Advertisement not found' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return res.status(500).json({ error: 'Failed to delete advertisement' });
  }
});

router.get('/:id/offers', authMiddleware, async (req, res) => {
  const advertisementId = req.params.id;
  try {
    const offers = await getUserNameOffer(advertisementId);

    res.json({ success: true, offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching offers' });
  }
});

router.post('/addmessage', authMiddleware, async (req, res) => {
  const { messageContent, senderID, receiverUsername } = req.body;

  const [[receiver]] = await getIDfromFelhasznalo(receiverUsername);
  const receiverId = receiver.id;
  try {
    insertIntoMessages(messageContent, senderID, receiverId);

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id/admin', authMiddleware, async (req, res) => {
  const advertisementId = req.params.id;

  try {
    deleteAD(advertisementId);
    res.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
