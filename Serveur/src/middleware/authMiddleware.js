const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const ApiError = require('../utils/ApiError');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Récupérer le token du header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Accès non autorisé. Veuillez vous connecter.');
    }

    // 2. Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    // 3. Vérifier si l'admin existe toujours dans la base
    const [rows] = await pool.execute(
      'SELECT id_admin, nom_admin, email_admin FROM admin WHERE id_admin = ?',
      [decoded.id]
    );

    if (!rows[0]) {
      throw new ApiError(401, 'Admin introuvable');
    }

    // 4. Attacher l'admin à la requête
    req.admin = rows[0];

    next(); // Passer au contrôleur suivant
  } catch (error) {
    next(error);
  }
};