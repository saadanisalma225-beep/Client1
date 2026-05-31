const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier s'il n'existe pas
const uploadDir = path.join(__dirname, '../../uploads/domaines');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nom unique : domaine-timestamp-extension
    const uniqueName = `domaine-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filtrer les types de fichiers (images uniquement)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Utilisez: JPEG, PNG, GIF, WEBP'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

module.exports = upload;