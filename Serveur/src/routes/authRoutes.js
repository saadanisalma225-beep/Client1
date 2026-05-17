const express = require('express');
const router = express.Router();
const { login, getDashboard_admin  } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/login - Connexion admin
router.post('/login', login);

// GET /api/auth/dashboard - Dashboard admin (protégé)
router.get('/dashboard_admin', protect, getDashboard_admin);


module.exports = router;