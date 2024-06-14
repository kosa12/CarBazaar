import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import pool from '../db/connection.js';
import { getAdvertisementImage } from '../utils/advertisementUtils.js';

const router = express.Router();
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [adRows] = await pool.query('SELECT * FROM hirdetes');
    const advertisements = await Promise.all(
      adRows.map(async (ad) => {
        const imageUrl = await getAdvertisementImage(ad.id);
        return {
          id: ad.id,
          brand: ad.brand,
          city: ad.city,
          price: ad.price,
          date: ad.date,
          fuel_type: ad.fuel_type,
          transmission: ad.transmission,
          car_condition: ad.car_condition,
          body_type: ad.body_type,
          color: ad.color,
          kilometers: ad.kilometers,
          imageUrl,
        };
      }),
    );
    const { user } = req;
    res.render('index', { advertisements, user });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
