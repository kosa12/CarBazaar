import express from 'express';
import { multerUpload } from '../middlewares/multer.js';
import pool from '../db/connection.js';
import authMiddleware from '../middlewares/auth.js';
import { deleteFile } from '../utils/fileUtils.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', multerUpload.single('image'), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError);
  }

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const { advertisementId } = req.body;
  if (!advertisementId) {
    await deleteFile(req.file.path);
    return res.status(400).send('Advertisement ID is required.');
  }

  try {
    const [advertisement] = await pool.execute('SELECT * FROM hirdetes WHERE id = ?', [advertisementId]);

    const isUserOwnerOfAdvertisement = advertisement[0].user_id === req.userId;
    if (isUserOwnerOfAdvertisement === false) {
      await deleteFile(req.file.path);
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    if (!advertisement.length) {
      await deleteFile(req.file.path);
      return res.status(404).send('Advertisement with the provided ID does not exist.');
    }

    if (req.file.size > 2 * 1024 * 1024) {
      await deleteFile(req.file.path);
      return res.status(400).send('File size exceeds the limit.');
    }

    await pool.execute('INSERT INTO fenykep (advertisement_id, filename) VALUES (?, ?)', [
      advertisementId,
      req.file.filename,
    ]);
    res.redirect(`/ad/${advertisementId}`);
    return null;
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
    return null;
  }
});

export default router;
