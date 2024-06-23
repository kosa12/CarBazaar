import { Router } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUsers, insertUser } from '../utils/signupUtils.js';

dotenv.config({ path: './config/secret.env' });

const router = Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
    return errors;
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
    return errors;
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
    return errors;
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number.');
    return errors;
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (e.g., @, $, !, %, *, ?, &).');
    return errors;
  }

  return errors;
}

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

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ error: passwordErrors });
  }

  try {
    const [existingUser] = await getUsers(username);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await insertUser(username, hashedPassword);

    const userId = result.insertId;

    const token = jwt.sign({ userId }, jwtSecretKey, { expiresIn: '24h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(201).json({ message: 'User registered successfully.', userId });
  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
