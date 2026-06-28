const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUpload = (folderName, prefix) => {
  const uploadDir = path.join(__dirname, '../../uploads', folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez: JPEG, PNG, GIF, WEBP'), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  });
};

module.exports = {
  domaine: createUpload('domaines', 'domaine'),
  categorie: createUpload('categories', 'categorie'),
  produit: createUpload('produits', 'produit'),
  clientProfil: createUpload('profils', 'profil') 
};