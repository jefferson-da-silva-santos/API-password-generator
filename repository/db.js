import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;
