const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { categorie: upload } = require('../middleware/upload');
const {
  create,
  getAll,
  getByDomaine,
  getById,
  update,
  getProductCount,       
  delete: deleteCategorie
} = require('../controllers/categorieController');

// Routes publiques
router.get('/', getAll);
router.get('/domaine/:id_domaine', getByDomaine);
router.get('/:id', getById);
router.get('/:id/products/count', getProductCount);  

// Routes protégées avec upload d'image
router.post('/', protect, upload.single('image'), create);
router.put('/:id', protect, upload.single('image'), update);
router.delete('/:id', protect, deleteCategorie);

module.exports = router;