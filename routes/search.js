import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/connection.js';
import { getAdvertisementImage } from '../utils/advertisementUtils.js';

const router = express.Router();

dotenv.config({ path: './config/secret.env' });

const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get('/', async (req, res) => {
  const { brand, city, minPrice, maxPrice, year, kilometers, fuelType, transmission, condition, bodyType, color } =
    req.query;
  console.log('req.query:', req.query);
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecretKey);
  const { userId } = decoded;
  let query = 'SELECT * FROM felhasznalo WHERE id = ?';
  const [userResult] = await pool.execute(query, [userId]);
  const user = userResult[0];

  const parsedMinPrice = parseFloat(minPrice);
  const parsedMaxPrice = parseFloat(maxPrice);
  const parsedYear = parseInt(year, 10);
  const parsedKilometers = parseInt(kilometers, 10);

  if ((minPrice && Number.isNaN(parsedMinPrice)) || parsedMinPrice < 0) {
    return res.status(400).send('Invalid minPrice');
  }

  if (maxPrice && Number.isNaN(parsedMaxPrice)) {
    return res.status(400).send('Invalid maxPrice');
  }

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

    const [rows] = await pool.execute(query, params);
    const advertisements = await Promise.all(
      rows.map(async (ad) => ({
        id: ad.id,
        brand: ad.brand,
        city: ad.city,
        price: ad.price,
        date: ad.date,
        imageUrl: await getAdvertisementImage(ad.id),
      })),
    );

    return res.render('search_result', { advertisements, user });
  } catch (error) {
    console.error('Error searching advertisements:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
