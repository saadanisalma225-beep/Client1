const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const ApiError = require('../utils/ApiError');

exports.protectClient = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Accès non autorisé. Veuillez vous connecter.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.execute(
      `SELECT c.id_client, c.nom, c.prenom, c.email, c.role, 
              c.telephone, c.ville, c.adresse, c.photo_profil, 
              c.email_verifie, c.created_at,
              w.id_wallet, w.balance_wallet
       FROM clients c 
       LEFT JOIN wallet w ON c.id_wallet = w.id_wallet 
       WHERE c.id_client = ?`,
      [decoded.id_client]
    );

    if (!rows[0]) {
      throw new ApiError(401, 'Client introuvable');
    }

    req.client = rows[0];
    next();
  } catch (error) {
    next(error);
  }
};