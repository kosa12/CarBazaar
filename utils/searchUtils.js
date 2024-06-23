import pool from '../db/connection.js';

export async function getAds(
  brand,
  city,
  minPrice,
  maxPrice,
  year,
  kilometers,
  fuelType,
  transmission,
  condition,
  bodyType,
  color,
) {
  try {
    let query = 'SELECT * FROM hirdetes WHERE 1';
    const params = [];

    if (brand) {
      query += ' AND brand LIKE ?';
      params.push(`%${brand}%`);
    }
    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (year) {
      query += ' AND YEAR(date) >= ?';
      params.push(parsedYear);
    }
    if (kilometers) {
      query += ' AND kilometers <= ?';
      params.push(parsedKilometers);
    }
    if (fuelType) {
      query += ' AND fuel_type = ?';
      params.push(fuelType);
    }
    if (transmission) {
      query += ' AND transmission = ?';
      params.push(transmission);
    }
    if (condition) {
      query += ' AND car_condition = ?';
      params.push(condition);
    }
    if (bodyType) {
      query += ' AND body_type = ?';
      params.push(bodyType);
    }
    if (color) {
      query += ' AND color = ?';
      params.push(color);
    }

    const result = await pool.execute(query, params);
    return result;
  } catch (error) {
    console.error('Error retrieving advertisement from database:', error);
    return null;
  }
}

export async function getUser(id) {
  try {
    const query = 'SELECT * FROM felhasznalo WHERE id = ?';
    const [result] = await pool.execute(query, [id]);
    return result;
  } catch (error) {
    console.error('Error retrieving user from database:', error);
    return null;
  }
}

export async function getLikedRows() {
  try {
    const query = 'SELECT advertisement_id FROM liked_ads WHERE user_id = ?';
    const [result] = await pool.execute(query, [userId]);
    return result;
  } catch (error) {
    console.error('Error fetching liked rows:', error);
    return null;
  }
}
