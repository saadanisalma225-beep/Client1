const Domaine = require('../models/Domaine');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');

// Créer un domaine
exports.create = async (req, res, next) => {
  try {
    const { nom_domaine, description_domaine } = req.body;
    const image_domaine = req.file ? req.file.filename : null;

    if (!nom_domaine) {
      throw new ApiError(400, 'Le nom du domaine est obligatoire');
    }

    const id = await Domaine.create({ nom_domaine, description_domaine, image_domaine });

    const imageUrl = image_domaine 
      ? `${req.protocol}://${req.get('host')}/uploads/domaines/${image_domaine}` 
      : null;

    res.status(201).json({
      success: true,
      message: 'Domaine créé avec succès',
      domaines: { 
        id_domaine: id, 
        nom_domaine, 
        description_domaine, 
        image_domaine,  
        imageUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les domaines
exports.getAll = async (req, res, next) => {
  try {
    const domaines = await Domaine.findAll();
    res.status(200).json({
      success: true,
      count: domaines.length,
      domaines
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer un domaine par ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const domaine = await Domaine.findById(id);

    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    res.status(200).json({
      success: true,
      domaine
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATED: Mettre à jour un domaine avec image
// ============================================
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom_domaine, description_domaine, keep_image, existing_image } = req.body;

    const domaine = await Domaine.findById(id);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    // Build update data
    const updateData = {
      nom_domaine,
      description_domaine: description_domaine || null
    };

    // Image logic
    if (req.file) {
      // New image uploaded → use it, delete old one
      updateData.image_domaine = req.file.filename;

      if (existing_image) {
        const oldPath = path.join(__dirname, '../../uploads/domaines', existing_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    } else if (keep_image === "true" && existing_image) {
      // Keep existing image → don't include image_domaine in update
    } else {
      // No new image, not keeping → clear image
      updateData.image_domaine = null;

      if (existing_image) {
        const oldPath = path.join(__dirname, '../../uploads/domaines', existing_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await Domaine.update(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Domaine mis à jour'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// NEW: Get category and product count for domain
// GET /api/admin/domaine/:id/stats
// ============================================
exports.getStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const domaine = await Domaine.findById(id);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    const stats = await Domaine.getCategoryAndProductCount(id);

    res.status(200).json({
      success: true,
      categoryCount: stats.categoryCount,
      productCount: stats.productCount
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATED: Supprimer un domaine avec cascade
// ============================================
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const domaine = await Domaine.findById(id);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    // Delete all products in categories of this domain first
    await Domaine.deleteProductsByDomain(id);

    // Then delete all categories of this domain
    await Domaine.deleteCategoriesByDomain(id);

    // Finally delete the domain
    await Domaine.delete(id);

    // Delete image file
    if (domaine.image_domaine) {
      const imagePath = path.join(__dirname, '../../uploads/domaines', domaine.image_domaine);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Domaine, catégories et produits associés supprimés'
    });
  } catch (error) {
    next(error);
  }
};