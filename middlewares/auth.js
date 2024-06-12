import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/connection.js';

dotenv.config({ path: './config/secret.env' });

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log('Token not found in cookies');
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    const { userId } = decoded;

    const [rows] = await pool.query('SELECT * FROM felhasznalo WHERE id = ?', [userId]);
    const user = rows[0];

    if (!user) {
      console.error('User not found in database');
      req.user = null;
      return next();
    }

    req.userId = userId;
    req.user = user;
    return next();
  } catch (err) {
    req.user = null;
    return res.status(401).send('Unauthorized');
  }
};

export default authMiddleware;
