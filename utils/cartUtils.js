import pool from '../db/connection.js';

export async function getFelhasznalo(id) {
  try {
    const result = await pool.execute('SELECT * FROM felhasznalo WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return null;
  }
}

export async function getHirdetes(id) {
  try {
    const result = await pool.execute('SELECT * FROM hirdetes WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error('Error retrieving advertisement from database:', error);
    return null;
  }
}

export async function getCartRow(userId, advertisementId) {
  try {
    const result = await pool.execute('SELECT * FROM cart WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);
    return result;
  } catch (error) {
    console.error('Error retrieving cart row from database:', error);
    return null;
  }
}

export async function insertCart(userId, advertisementId) {
  try {
    await pool.execute('INSERT INTO cart (user_id, advertisement_id) VALUES (?, ?)', [userId, advertisementId]);
  } catch (error) {
    console.error('Error inserting cart row into database:', error);
  }
}

export async function deleteCartRow(userId, advertisementId) {
  try {
    const result = await pool.execute('DELETE FROM cart WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);
    return result;
  } catch (error) {
    console.error('Error deleting cart row from database:', error);
    return null;
  }
}

export async function getOffers(userId, advertisementId) {
  try {
    const result = await pool.execute('SELECT * FROM offers WHERE user_id = ? AND advertisement_id = ?', [
      userId,
      advertisementId,
    ]);
    return result;
  } catch (error) {
    console.error('Error retrieving offers from database:', error);
    return null;
  }
}

export async function insertOffer(userId, advertisementId, price) {
  try {
    await pool.execute('INSERT INTO offers (user_id, advertisement_id, price) VALUES (?, ?, ?)', [
      userId,
      advertisementId,
      price,
    ]);
  } catch (error) {
    console.error('Error inserting offer into database:', error);
  }
}

export async function updateOffer(userId, advertisementId, price) {
  try {
    await pool.execute('UPDATE offers SET price = ? WHERE user_id = ? AND advertisement_id = ?', [
      price,
      userId,
      advertisementId,
    ]);
  } catch (error) {
    console.error('Error updating offer in database:', error);
  }
}
