import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getAdvertisementImage } from '../utils/advertisementUtils.js';
import { getAds, getLikedRows, getUser } from '../utils/searchUtils.js';

const router = express.Router();

dotenv.config({ path: './config/secret.env' });

const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get('/', async (req, res) => {
  const { brand, city, minPrice, maxPrice, year, kilometers, fuelType, transmission, condition, bodyType, color } =
    req.query;

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
    const [rows] = await getAds(
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
    );
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

    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, jwtSecretKey);
      const { userId } = decoded;
      const [userResult] = await getUser(userId);
      const user = userResult[0];

      const [likedRows] = await getLikedRows(userId);
      const likedAdvertisements = likedRows.map((row) => row.advertisement_id);

      return res.render('search_result', { advertisements, user, likedAdvertisements });
    } else {
      return res.render('search_result', { advertisements, user: null, likedAdvertisements: [] });
    }
  } catch (error) {
    console.error('Error searching advertisements:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
