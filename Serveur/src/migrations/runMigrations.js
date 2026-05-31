const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  try {
    // 1. Créer la table migrations si elle n'existe pas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 2. Lire tous les fichiers de migration
    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js') && f !== 'runMigrations.js')
      .sort(); // Important : ordre alphabétique

    console.log('📁 Migrations trouvées:', files);

    for (const file of files) {
      // Vérifier si déjà exécutée
      const [existing] = await pool.execute(
        'SELECT * FROM migrations WHERE name = ?',
        [file]
      );

      if (existing.length > 0) {
        console.log(`⏩ ${file} déjà exécutée`);
        continue;
      }

      // Exécuter la migration
      console.log(`🚀 Exécution de ${file}...`);
      const migration = require(path.join(migrationsDir, file));
      await migration.up(pool);

      // Marquer comme exécutée
      await pool.execute(
        'INSERT INTO migrations (name) VALUES (?)',
        [file]
      );

      console.log(`✅ ${file} exécutée avec succès`);
    }

    console.log('🎉 Toutes les migrations sont à jour !');
  } catch (error) {
    console.error('❌ Erreur migration:', error.message);
    process.exit(1);
  }
};

module.exports = runMigrations;