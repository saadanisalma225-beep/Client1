const Client = require('../models/Client');
const { pool } = require('../config/database');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const { sendVerificationEmail } = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (pwd) => pwd && pwd.length >= 6;

// Generate verification token (JWT)
const generateVerificationToken = (id_client, email) => {
  return jwt.sign(
    { id_client, email, type: 'email_verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// ============================================
// POST /api/auth/client/register
// ============================================
exports.register = async (req, res, next) => {
  try {
    const {
      nom,
      prenom,
      email,
      mot_de_passe,
      confirm_mot_de_passe,
      telephone,
      ville,
      adresse,
      role
    } = req.body;

    // Validation
    if (!nom?.trim() || nom.trim().length < 2) {
      throw new ApiError(400, 'Le nom est requis (min 2 caractères)');
    }
    if (!prenom?.trim() || prenom.trim().length < 2) {
      throw new ApiError(400, 'Le prénom est requis (min 2 caractères)');
    }
    if (!email || !validateEmail(email)) {
      throw new ApiError(400, 'Email invalide');
    }
    if (!validatePassword(mot_de_passe)) {
      throw new ApiError(400, 'Le mot de passe doit contenir au moins 6 caractères');
    }
    if (mot_de_passe !== confirm_mot_de_passe) {
      throw new ApiError(400, 'Les mots de passe ne correspondent pas');
    }

    // Check email exists
    const existing = await Client.findByEmail(email);
    if (existing) {
      throw new ApiError(409, 'Cet email est déjà utilisé');
    }

    const photo_profil = req.file ? `/uploads/profils/${req.file.filename}` : null;

    // 1. Create wallet
    const [walletResult] = await pool.execute(
      'INSERT INTO wallet (balance_wallet) VALUES (0.00)'
    );
    const id_wallet = walletResult.insertId;

    // 2. Hash password & create client
    const hashedPassword = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);
    const clientData = {
      id_wallet,
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.toLowerCase(),
      mot_de_passe: hashedPassword,
      role: role || 'acheteur',
      telephone: telephone || null,
      ville: ville || null,
      adresse: adresse || null,
      photo_profil
    };

    const id_client = await Client.create(clientData);

    // 3. Generate JWT verification token
    const verificationToken = generateVerificationToken(id_client, email.toLowerCase());

    // 4. Send verification email
    try {
      await sendVerificationEmail(email.toLowerCase(), nom.trim(), verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès. Veuillez vérifier votre email.',
      token: generateToken(id_client, 'client'),
      client: {
        id: id_client,
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.toLowerCase(),
        role: role || 'acheteur',
        photo_profil,
        email_verifie: false
      }
    });

  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  }
};

// ============================================
// GET /api/auth/client/verify/:token
// ============================================
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      throw new ApiError(400, 'Token de vérification manquant');
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new ApiError(400, 'Token invalide ou expiré');
    }

    // Check token type
    if (decoded.type !== 'email_verification') {
      throw new ApiError(400, 'Token invalide');
    }

    // Find client
    const client = await Client.findById(decoded.id_client);
    if (!client) {
      throw new ApiError(404, 'Client introuvable');
    }

    // Check if already verified
    if (client.email_verifie) {
      return res.status(200).json({
        success: true,
        message: 'Email déjà vérifié'
      });
    }

    // Check email matches
    if (client.email !== decoded.email) {
      throw new ApiError(400, 'Token invalide');
    }

    // Mark as verified
    await pool.execute(
      'UPDATE clients SET email_verifie = TRUE WHERE id_client = ?',
      [decoded.id_client]
    );

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.'
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// POST /api/auth/client/resend-verification
// ============================================
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      throw new ApiError(400, 'Email invalide');
    }

    const client = await Client.findByEmail(email.toLowerCase());
    if (!client) {
      throw new ApiError(404, 'Aucun compte trouvé avec cet email');
    }

    if (client.email_verifie) {
      throw new ApiError(400, 'Cet email est déjà vérifié');
    }

    // Generate new JWT token
    const verificationToken = generateVerificationToken(client.id_client, client.email);

    // Send email
    await sendVerificationEmail(client.email, client.nom, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Email de vérification renvoyé avec succès'
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// POST /api/auth/client/login
// ============================================
exports.login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      throw new ApiError(400, 'Veuillez fournir email et mot de passe');
    }

    const client = await Client.findByEmail(email.toLowerCase());
    if (!client) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    const isMatch = await Client.comparePassword(mot_de_passe, client.mot_de_passe);
    if (!isMatch) {
      throw new ApiError(401, 'Email ou mot de passe incorrect');
    }

    // Optional: block login if email not verified
    if (!client.email_verifie) {
      throw new ApiError(403, 'Veuillez vérifier votre email avant de vous connecter');
    }

    res.status(200).json({
      success: true,
      token: generateToken(client.id_client, 'client'),
      client: {
        id: client.id_client,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: client.role,
        telephone: client.telephone,
        ville: client.ville,
        adresse: client.adresse,
        photo_profil: client.photo_profil,
        email_verifie: client.email_verifie,
        balance_wallet: client.balance_wallet
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/auth/client/me
// ============================================
exports.getMe = async (req, res, next) => {
  try {
    const client = await Client.findById(req.client.id_client);
    res.status(200).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PUT /api/auth/client/profile
// ============================================
exports.updateProfile = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, ville, adresse } = req.body;
    const id_client = req.client.id_client;

    const updateData = {};
    if (nom !== undefined) updateData.nom = nom.trim();
    if (prenom !== undefined) updateData.prenom = prenom.trim();
    if (telephone !== undefined) updateData.telephone = telephone;
    if (ville !== undefined) updateData.ville = ville;
    if (adresse !== undefined) updateData.adresse = adresse;
    if (req.file) updateData.photo_profil = `/uploads/profils/${req.file.filename}`;

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'Aucune donnée à mettre à jour');
    }

    await Client.update(id_client, updateData);
    const client = await Client.findById(id_client);

    res.status(200).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PUT /api/auth/client/password
// ============================================
exports.changePassword = async (req, res, next) => {
  try {
    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
    const id_client = req.client.id_client;

    if (!validatePassword(nouveau_mot_de_passe)) {
      throw new ApiError(400, 'Le nouveau mot de passe doit contenir au moins 6 caractères');
    }

    const client = await Client.findById(id_client);
    const isMatch = await Client.comparePassword(ancien_mot_de_passe, client.mot_de_passe);
    if (!isMatch) {
      throw new ApiError(401, 'Ancien mot de passe incorrect');
    }

    const hashed = await bcrypt.hash(nouveau_mot_de_passe, SALT_ROUNDS);
    await Client.updatePassword(id_client, hashed);

    res.status(200).json({ success: true, message: 'Mot de passe modifié' });
  } catch (error) {
    next(error);
  }
};