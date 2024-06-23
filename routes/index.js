import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { getAdvertisementImage } from '../utils/advertisementUtils.js';
import { getHirdetesek, getLikedAds } from '../utils/indexUtils.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [adRows] = await getHirdetesek();
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
    try {
      const userId = req.user.id;
      const [likedRows] = await getLikedAds(userId);
      const likedAdvertisements = likedRows.map((row) => row.advertisement_id);

      const { user } = req;
      res.render('index', { advertisements, user, likedAdvertisements });
    } catch (error) {
      res.render('index', { advertisements, user: [], likedAdvertisements: [] });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
