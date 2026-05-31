// # Point d'entrée
require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database'); 
const runMigrations = require('./src/migrations/runMigrations');

const PORT = process.env.PORT || 5000;

// // Connexion DB puis démarrage serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});

const startServer = async () => {
  try {
    // 1. Connecter à la base
    await connectDB();

    // 2. Exécuter les migrations
    await runMigrations();

    // 3. Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error.message);
    process.exit(1);
  }
};

startServer();