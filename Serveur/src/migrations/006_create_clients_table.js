module.exports = {
  up: async (pool) => {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id_client INT AUTO_INCREMENT PRIMARY KEY,
        id_wallet INT UNIQUE,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        mot_de_passe VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client',
        telephone VARCHAR(20),
        ville VARCHAR(100),
        adresse TEXT,
        photo_profil VARCHAR(255),
        email_verifie BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_wallet) REFERENCES wallet(id_wallet) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  },

  down: async (pool) => {
    await pool.execute('DROP TABLE IF EXISTS clients');
  }
};