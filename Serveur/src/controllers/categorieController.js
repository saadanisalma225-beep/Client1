const Categorie = require('../models/Categorie');
const Domaine = require('../models/Domaine');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');

// Créer une catégorie avec image
exports.create = async (req, res, next) => {
  try {
    const { nom_categorie, description_categorie, id_domaine } = req.body;
    
    const image_categorie = req.file ? req.file.filename : null;

    if (!nom_categorie || !id_domaine) {
      throw new ApiError(400, 'Le nom de la catégorie et le domaine sont obligatoires');
    }

    const domaine = await Domaine.findById(id_domaine);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    const id = await Categorie.create({ 
      nom_categorie, 
      description_categorie, 
      image_categorie,  
      id_domaine 
    });

    const imageUrl = image_categorie 
      ? `${req.protocol}://${req.get('host')}/uploads/categories/${image_categorie}` 
      : null;

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      categorie: { 
        id_categorie: id, 
        nom_categorie, 
        description_categorie, 
        image_categorie,
        imageUrl,
        id_domaine 
      }
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer toutes les catégories
exports.getAll = async (req, res, next) => {
  try {
    const categories = await Categorie.findAll();
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les catégories d'un domaine
exports.getByDomaine = async (req, res, next) => {
  try {
    const { id_domaine } = req.params;

    const domaine = await Domaine.findById(id_domaine);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    const categories = await Categorie.findByDomaine(id_domaine);
    res.status(200).json({
      success: true,
      domaine: domaine.nom_domaine,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer une catégorie par ID
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categorie = await Categorie.findById(id);

    if (!categorie) {
      throw new ApiError(404, 'Catégorie non trouvée');
    }

    res.status(200).json({
      success: true,
      categorie
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATED: Mettre à jour une catégorie avec image
// ============================================
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom_categorie, description_categorie, id_domaine, keep_image, existing_image } = req.body;

    // Vérifier que la catégorie existe
    const categorie = await Categorie.findById(id);
    if (!categorie) {
      throw new ApiError(404, 'Catégorie non trouvée');
    }

    // Vérifier les champs obligatoires
    if (!nom_categorie || !id_domaine) {
      throw new ApiError(400, 'nom_categorie et id_domaine sont obligatoires');
    }

    // Vérifier que le domaine existe
    const domaine = await Domaine.findById(id_domaine);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    // Build update data
    const updateData = {
      nom_categorie,
      description_categorie: description_categorie || null,
      id_domaine
    };

    // Image logic
    if (req.file) {
      // New image uploaded → use it, delete old one
      updateData.image_categorie = req.file.filename;

      if (existing_image) {
        const oldPath = path.join(__dirname, '../../uploads/categories', existing_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    } else if (keep_image === "true" && existing_image) {
      // Keep existing image → don't include image_categorie in update
      // The Model.update will only update provided fields
    } else {
      // No new image, not keeping → clear image
      updateData.image_categorie = null;

      if (existing_image) {
        const oldPath = path.join(__dirname, '../../uploads/categories', existing_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await Categorie.update(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Catégorie mise à jour'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// NEW: Compter les produits d'une catégorie
// ============================================
exports.getProductCount = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findById(id);
    if (!categorie) {
      throw new ApiError(404, 'Catégorie non trouvée');
    }

    const count = await Categorie.countProducts(id);

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATED: Supprimer une catégorie avec cascade
// ============================================
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const categorie = await Categorie.findById(id);
    if (!categorie) {
      throw new ApiError(404, 'Catégorie non trouvée');
    }

    // Delete associated products first (cascade)
    await Categorie.deleteProductsByCategory(id);

    // Delete the category
    await Categorie.delete(id);

    // Delete image file
    if (categorie.image_categorie) {
      const imagePath = path.join(__dirname, '../../uploads/categories', categorie.image_categorie);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Catégorie et produits associés supprimés'
    });
  } catch (error) {
    next(error);
  }
};