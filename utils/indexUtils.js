import pool from '../db/connection.js';

export async function getHirdetesek() {
  try {
    const result = await pool.execute('SELECT * FROM hirdetes');
    return result;
  } catch (error) {
    console.error('Error retrieving advertisement from database:', error);
    return null;
  }
}

export async function getLikedAds(userId) {
  try {
    const result = await pool.execute('SELECT advertisement_id FROM liked_ads WHERE user_id = ?', [userId]);
    return result;
  } catch (error) {
    console.error('Error retrieving liked ads from database:', error);
    return null;
  }
}
