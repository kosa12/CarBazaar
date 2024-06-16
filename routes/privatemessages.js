import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import pool from '../db/connection.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT DISTINCT
        CASE
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END AS user_id,
        u.username
      FROM messages
      INNER JOIN felhasznalo u ON (u.id = sender_id OR u.id = receiver_id) AND u.id != ?
      WHERE sender_id = ? OR receiver_id = ?
    `;

    const [users] = await pool.query(query, [userId, userId, userId, userId]);

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
    const query = `
      SELECT 
        m.message_id, m.sender_id, m.receiver_id, m.message_content, m.timestamp,
        s.username AS sender_username, r.username AS receiver_username
      FROM 
        messages m
      INNER JOIN 
        felhasznalo s ON m.sender_id = s.id
      INNER JOIN 
        felhasznalo r ON m.receiver_id = r.id
      WHERE 
        (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY 
        m.timestamp ASC
    `;

    const [messages] = await pool.query(query, [currentUserId, otherUserId, otherUserId, currentUserId]);

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
    const query = `
      INSERT INTO messages (sender_id, receiver_id, message_content)
      VALUES (?, ?, ?)
    `;

    await pool.query(query, [senderId, receiverId, messageContent]);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
