import pool from '../db/connection.js';

export async function getUser(username) {
  try {
    const [result] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return result;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return null;
  }
}
