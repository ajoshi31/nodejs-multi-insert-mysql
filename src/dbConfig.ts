import mysql from 'mysql';
import * as dotenv from 'dotenv';
dotenv.config();

const dbConn = {
  connectionLimit: 15,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const pool = mysql.createPool(dbConn);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) {
    connection.release();
  }
  console.log('DB pool is Connected');
  return;
});

// pool.query = promisify(pool.query);

export default pool;
