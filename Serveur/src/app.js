const express = require('express');
const cors = require('cors');  
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const domaineRoutes = require('./routes/domaineRoutes');
const categorieRoutes = require('./routes/categorieRoutes'); 
const produitRoutes = require('./routes/produitRoutes');
const errorHandler = require('./middleware/errorHandler');
const clientAuthRoutes = require('./routes/clientAuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Client auth routes FIRST (more specific path)
app.use('/api/auth/client', clientAuthRoutes);

// Admin auth routes AFTER (less specific path)
app.use('/api/auth', authRoutes);


// Admin routes
app.use('/api/admin/domaine', domaineRoutes);   
app.use('/api/admin/categorie', categorieRoutes);
app.use('/api/admin/produit', produitRoutes);

// Route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur fonctionnel' });
});

app.use(errorHandler);

module.exports = app;