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
