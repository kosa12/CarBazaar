import pool from '../db/connection.js';

export async function getOffers(id) {
  try {
    const result = await pool.execute('SELECT * FROM offers WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error('Error retrieving offer from database:', error);
    return null;
  }
}

export async function getBuyer(userId) {
  try {
    const result = await pool.execute('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    return result;
  } catch (error) {
    console.error('Error retrieving buyer from database:', error);
    return null;
  }
}

export async function deleteOffer(id) {
  try {
    await pool.query('DELETE FROM offers WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting offer:', error);
  }
}
