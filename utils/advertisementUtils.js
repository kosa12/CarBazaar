import pool from '../db/connection.js';

export async function getAdvertisementImage(advertisementId) {
  try {
    const [result] = await pool.execute('SELECT filename FROM fenykep WHERE advertisement_id = ?', [advertisementId]);
    if (result.length > 0) {
      return `/uploadDir/${result[0].filename}`;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving image from database:', error);
    return null;
  }
}

export async function getImage(advertisementId) {
  try {
    const [result] = await pool.execute('SELECT filename FROM fenykep WHERE filename = ?', [advertisementId]);
    if (result.length > 0) {
      return `/uploadDir/${result[0].filename}`;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving image from database:', error);
    return null;
  }
}

export async function getAdvertisementImages(advertisementId) {
  try {
    const [results] = await pool.execute('SELECT * FROM fenykep WHERE advertisement_id = ?', [advertisementId]);
    return results.map((result) => ({
      url: `/uploadDir/${result.filename}`,
    }));
  } catch (error) {
    console.error('Error retrieving advertisement images:', error);
    throw error;
  }
}

export async function deleteAdvertisementImage(imageId, filename) {
  const query = 'DELETE FROM fenykep WHERE filename = ?';
  const result = await pool.execute(query, [filename]);
  return result[0];
}

export async function isUserOwnerOfAdvertisement(adId, userId) {
  try {
    const [images] = await pool.execute('SELECT advertisement_id  FROM fenykep WHERE filename = ?', [adId]);

    if (images.length === 0) {
      return false;
    }

    images.forEach(async (image) => {
      const [result] = await pool.execute('SELECT user_id FROM hirdetes WHERE id = ?', [image.advertisement_id]);
      if (result[0].user_id !== userId) {
        return false;
      }
      return true;
    });
    return true;
  } catch (error) {
    console.error('Error checking advertisement ownership:', error);
    throw error;
  }
}

export async function getAdvertisementDetails(advertisementId) {
  try {
    const [advertisement] = await pool.execute(
      'SELECT hirdetes.*, felhasznalo.username FROM hirdetes JOIN felhasznalo ON hirdetes.user_id = felhasznalo.id WHERE hirdetes.id = ?',
      [advertisementId],
    );
    if (advertisement.length === 0) {
      return null;
    }

    const images = await getAdvertisementImages(advertisementId);
    advertisement[0].images = images;
    return advertisement[0];
  } catch (error) {
    console.error('Error retrieving advertisement details:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const [users] = await pool.execute('SELECT id, username FROM felhasznalo');
    return users;
  } catch (error) {
    console.error('Error retrieving users:', error);
    return [];
  }
}

export async function insertIntoHirdetes(
  id,
  brand,
  city,
  price,
  date,
  fuel_type,
  transmission,
  car_condition,
  body_type,
  color,
  kilometers,
  userId,
) {
  try {
    await pool.execute(
      'INSERT INTO hirdetes (id, brand, city, price, date, fuel_type, transmission, car_condition, body_type, color, kilometers, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, brand, city, price, date, fuel_type, transmission, car_condition, body_type, color, kilometers, userId],
    );
  } catch (error) {
    console.error('Error inserting advertisement into database:', error);
    throw error;
  }
}

export async function getUserNameOffer(advertisementId) {
  try {
    const sql = `
      SELECT o.*, u.username
      FROM offers o
      INNER JOIN felhasznalo u ON o.user_id = u.id
      WHERE o.advertisement_id = ?
    `;
    const [offers] = await pool.query(sql, [advertisementId]);
    return offers;
  } catch (error) {
    console.error('Error retrieving offers:', error);
    throw error;
  }
}
export async function getIDfromFelhasznalo(username) {
  try {
    const receiver = await pool.query('SELECT id FROM felhasznalo WHERE username = ?', [username]);
    return receiver;
  } catch (error) {
    console.error('Error retrieving ID:', error);
    throw error;
  }
}

export async function insertIntoMessages(senderId, receiverId, message) {
  try {
    await pool.execute('INSERT INTO messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)', [
      senderId,
      receiverId,
      message,
    ]);
  } catch (error) {
    console.error('Error inserting message into database:', error);
    throw error;
  }
}

export async function deleteAD(advertisementId) {
  try {
    await pool.query('DELETE FROM liked_ads WHERE advertisement_id = ?', [advertisementId]);
    await pool.query('DELETE FROM cart WHERE advertisement_id = ?', [advertisementId]);
    await pool.query('DELETE FROM fenykep WHERE advertisement_id = ?', [advertisementId]);
    await pool.query('DELETE FROM offers WHERE advertisement_id = ?', [advertisementId]);
    await pool.query('DELETE FROM hirdetes WHERE id = ?', [advertisementId]);
  } catch (error) {
    console.error('Error deleting advertisement from database:', error);
    throw error;
  }
}
