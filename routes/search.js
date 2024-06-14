import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/connection.js';
import { getAdvertisementImage } from '../utils/advertisementUtils.js';

const router = express.Router();

dotenv.config({ path: './config/secret.env' });

const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get('/', async (req, res) => {
  const { brand, city, minPrice, maxPrice } = req.query;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, jwtSecretKey);
  const { userId } = decoded;
  let query = 'SELECT * FROM felhasznalo WHERE id = ?';
  const [userResult] = await pool.execute(query, [userId]);
  const user = userResult[0];

  const parsedMinPrice = parseFloat(minPrice);
  const parsedMaxPrice = parseFloat(maxPrice);

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
