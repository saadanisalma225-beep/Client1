const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

// Login
exports.login = async (req, res, next) => {
  try {
    const { email_admin, password_admin } = req.body;

    // Vérifier email et password fournis
    if (!email_admin || !password_admin) {
      throw new ApiError(400, 'Veuillez fournir email et mot de passe');
    }

    // Chercher l'admin
    const admin = await Admin.findByEmail(email_admin);
    if (!admin) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isMatch = await Admin.comparePassword(password_admin, admin.password_admin);
    if (!isMatch) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    res.status(200).json({
      success: true,
      token: generateToken(admin.id_admin),
      admin: {
        id: admin.id_admin,
        nom: admin.nom_admin,
        email: admin.email_admin
      }
    });
  } catch (error) {
    next(error);
  }
};

// Profil (route protégée)
exports.getDashboard_admin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id_admin);
    res.status(200).json({ success: true, admin });
  } catch (error) {
    next(error);
  }
};