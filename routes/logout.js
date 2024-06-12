import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

export default router;
