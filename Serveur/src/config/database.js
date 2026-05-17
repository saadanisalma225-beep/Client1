const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
   connectTimeout: 10000,  // 10 secondes
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connecté avec succès');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };