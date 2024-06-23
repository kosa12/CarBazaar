import pool from '../db/connection.js';

export async function insertIntoLikedAds(userId, advertisementId) {
  try {
    await pool.query('INSERT INTO liked_ads (user_id, advertisement_id) VALUES (?, ?)', [userId, advertisementId]);
  } catch (error) {
    console.error('Error adding liked advertisement:', error);
  }
}

export async function updateLikeNumber(advertisementId) {
  try {
    await pool.query('UPDATE hirdetes SET likes = likes + 1 WHERE id = ?', [advertisementId]);
  } catch (error) {
    console.error('Error updating like number:', error);
  }
}
