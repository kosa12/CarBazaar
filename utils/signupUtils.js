import pool from '../db/connection.js';

export async function getUsers(username) {
  try {
    const users = await pool.query('SELECT * FROM felhasznalo WHERE username = ?', [username]);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

export async function insertUser(username, hashedPassword) {
  try {
    const result = await pool.query('INSERT INTO felhasznalo (username, user_password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);

    return result;
  } catch (error) {
    console.error('Error inserting user:', error);
    return null;
  }
}
