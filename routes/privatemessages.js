import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { getUsers, getMessages, insertMessage } from '../utils/privMessUtils.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [users] = await getUsers(userId);
    res.render('privatemessages', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/conversation/:userId', authMiddleware, async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  try {
    const [messages] = await getMessages(currentUserId, otherUserId);

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/conversation/:userId', authMiddleware, async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.userId;
  const { messageContent } = req.body;

  try {
    await insertMessage(senderId, receiverId, messageContent);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
