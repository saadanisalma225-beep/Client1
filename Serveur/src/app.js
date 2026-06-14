const express = require('express');
const cors = require('cors');  
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const domaineRoutes = require('./routes/domaineRoutes');
const categorieRoutes = require('./routes/categorieRoutes'); 
const produitRoutes = require('./routes/produitRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());  // ← Maintenant fonctionne correctement
app.use(express.json());

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/domaine', domaineRoutes);   
app.use('/api/admin/categorie', categorieRoutes);
app.use('/api/admin/produit', produitRoutes);


// Route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur fonctionnel' });
});

app.use(errorHandler);

module.exports = app;