const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  create,
  getAll,
  getById,
  update,
  delete: deleteDomaine
} = require('../controllers/domaineController');

// Routes publiques (lecture seule)
router.get('/', getAll);
router.get('/:id', getById);

// Routes protégées (administration)
// Routes protégées avec upload d'image
router.post('/', protect, upload.single('image'), create);      
router.put('/:id', protect, upload.single('image'), update);    
router.delete('/:id', protect, deleteDomaine);

module.exports = router;