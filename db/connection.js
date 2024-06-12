import mysql from 'mysql2/promise.js';

const pool = mysql.createPool({
  connectionLimit: 10,
  database: 'auto_kereskedes',
  host: 'localhost',
  user: 'webprog',
  password: 'asd',
  port: 3306,
});

export default pool;
