module.exports = {
  up: async (pool) => {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS produits (
        id_produit INT AUTO_INCREMENT PRIMARY KEY,
        nom_produit VARCHAR(200) NOT NULL,
        description_produit TEXT,
        prix_debut_produit DOUBLE NOT NULL DEFAULT 0.00,
        prix_fin_produit DOUBLE DEFAULT NULL,
        date_publication_produit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        a_expertise_produit BOOLEAN DEFAULT FALSE,
        etat_produit ENUM('neuf', 'occasion', 'reconditionne') DEFAULT 'neuf',
        expertise_approuved_produit BOOLEAN DEFAULT FALSE,
        produit_image_produit JSON,
        id_categorie_produit INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_categorie_produit) REFERENCES categories(id_categorie) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  },

  down: async (pool) => {
    await pool.execute('DROP TABLE IF EXISTS produits');
  }
};