const express = require('express');
const router = express.Router();
const { clientProfil } = require('../middleware/upload');
const { protectClient } = require('../middleware/authClient');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerification
} = require('../controllers/clientAuthController');

// Public
router.post('/register', clientProfil.single('photo_profil'), register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected
router.get('/me', protectClient, getMe);
router.put('/profile', protectClient, clientProfil.single('photo_profil'), updateProfile);
router.put('/password', protectClient, changePassword);

module.exports = router;