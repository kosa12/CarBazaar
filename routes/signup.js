import { Router } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/connection.js';

dotenv.config({ path: './config/secret.env' });

const router = Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

router.get('/', (req, res) => {
  res.render('signup');
});

router.post('/', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const [existingUser] = await pool.query('SELECT * FROM felhasznalo WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query('INSERT INTO felhasznalo (username, user_password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);

    const userId = result.insertId;

    const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(201).json({ message: 'User registered successfully.', userId });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
