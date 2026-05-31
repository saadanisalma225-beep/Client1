// # Point d'entrée
require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database'); 

const PORT = process.env.PORT || 5000;

// Connexion DB puis démarrage serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});