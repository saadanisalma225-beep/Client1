const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { produit: upload } = require('../middleware/upload');
const {
  create,
  getAll,
  getByCategorie,
  getById,
  update,
  delete: deleteProduit
} = require('../controllers/produitController');

// Routes publiques
router.get('/', getAll);
router.get('/categorie/:id_categorie', getByCategorie);
router.get('/:id', getById);

// Routes protégées avec upload d'images (max 5 images)
router.post('/', protect, upload.array('produit_image_produit', 5), create);
router.put('/:id', protect, upload.array('produit_image_produit', 5), update);
router.delete('/:id', protect, deleteProduit);

module.exports = router;