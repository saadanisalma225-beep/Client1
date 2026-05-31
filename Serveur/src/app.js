const express = require('express');
const cors = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const domaineRoutes = require('./routes/domaineRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes

/** administation */

//  auth
app.use('/api/auth', authRoutes);
//  domaine 
app.use('/api/admin/domaine', domaineRoutes);  

// Route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur fonctionnel' });
});

app.use(errorHandler);

module.exports = app;