import pool from '../db/connection.js';

export async function deleteLikedAd(userId, advertisementId) {
  try {
    const result = await pool.query('DELETE FROM liked_ads WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);

    return result;
  } catch (error) {
    console.error('Error unliking advertisement:', error);
    return null;
  }
}
export async function updateAdLikes(advertisementId) {
  try {
    const result = await pool.query('UPDATE hirdetes SET likes = likes - 1 WHERE id = ?', [advertisementId]);
    return result;
  } catch (error) {
    console.error('Error updating advertisement likes:', error);
    return null;
  }
}
