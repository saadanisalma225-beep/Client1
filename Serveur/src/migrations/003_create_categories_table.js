module.exports = {
  up: async (pool) => {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id_categorie INT AUTO_INCREMENT PRIMARY KEY,
        nom_categorie VARCHAR(100) NOT NULL,
        description_categorie TEXT,
        image_categorie VARCHAR(255),
        id_domaine INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_domaine) REFERENCES domaines(id_domaine) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  },

  down: async (pool) => {
    await pool.execute('DROP TABLE IF EXISTS categories');
  }
};