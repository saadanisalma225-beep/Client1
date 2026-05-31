module.exports = {
  up: async (pool) => {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS domaines (
        id_domaine INT AUTO_INCREMENT PRIMARY KEY,
        nom_domaine VARCHAR(100) NOT NULL,
        description_domaine TEXT,
        image_domaine VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  },

  down: async (pool) => {
    await pool.execute('DROP TABLE IF EXISTS domaines');
  }
};