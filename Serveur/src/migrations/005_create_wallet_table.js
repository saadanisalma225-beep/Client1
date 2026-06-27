// migrations/005_create_wallet_table.js
module.exports = {
  up: async (pool) => {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS wallet (
        id_wallet INT AUTO_INCREMENT PRIMARY KEY,
        balance_wallet DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  },

  down: async (pool) => {
    await pool.execute('DROP TABLE IF EXISTS wallet');
  }
};