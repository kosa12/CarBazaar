import pool from '../db/connection.js';

export async function getUsers(userId) {
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

    const result = await pool.query(query, [userId, userId, userId, userId]);
    return result;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return null;
  }
}

export async function getMessages(currentUserId, otherUserId) {
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

    const result = await pool.query(query, [currentUserId, otherUserId, otherUserId, currentUserId]);
    return result;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return null;
  }
}

export async function insertMessage(senderId, receiverId, messageContent) {
  try {
    const query = `
        INSERT INTO messages (sender_id, receiver_id, message_content)
        VALUES (?, ?, ?)
        `;

    await pool.query(query, [senderId, receiverId, messageContent]);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
