const Produit = require('../models/Produit');
const Categorie = require('../models/Categorie');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');

// Helper: Parse JSON images safely
const parseImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Helper: Delete image files
const deleteImageFiles = (images) => {
  const imageList = parseImages(images);
  imageList.forEach(img => {
    const filePath = path.join(__dirname, '../../uploads/produits', img);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

// Helper: Build image URLs
const buildImageUrls = (req, images) => {
  const imageList = parseImages(images);
  return imageList.map(img => `${req.protocol}://${req.get('host')}/uploads/produits/${img}`);
};

// POST create produit
exports.create = async (req, res, next) => {
  try {
    const {
      nom_produit,
      description_produit,
      prix_debut_produit,
      prix_fin_produit,
      a_expertise_produit,
      etat_produit,
      id_categorie_produit
    } = req.body;

    // Validate required fields
    if (!nom_produit || !prix_debut_produit || !id_categorie_produit) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      throw new ApiError(400, 'Les champs nom_produit, prix_debut_produit et id_categorie_produit sont obligatoires');
    }

    // Verify category exists
    const categorie = await Categorie.findById(id_categorie_produit);
    if (!categorie) {
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      throw new ApiError(404, 'Catégorie non trouvée');
    }

    // Handle image files
    let produit_image_produit = [];
    if (req.files && req.files.length > 0) {
      produit_image_produit = req.files.map(file => file.filename);
    }

    const id = await Produit.create({
      nom_produit,
      description_produit: description_produit || null,
      prix_debut_produit: parseFloat(prix_debut_produit),
      prix_fin_produit: prix_fin_produit ? parseFloat(prix_fin_produit) : null,
      a_expertise_produit: a_expertise_produit === 'true' || a_expertise_produit === true ? 1 : 0,
      etat_produit: etat_produit || 'neuf',
      id_categorie_produit,
      produit_image_produit: JSON.stringify(produit_image_produit)
    });

    const imageUrls = buildImageUrls(req, produit_image_produit);

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      produit: {
        id_produit: id,
        nom_produit,
        description_produit,
        prix_debut_produit: parseFloat(prix_debut_produit),
        prix_fin_produit: prix_fin_produit ? parseFloat(prix_fin_produit) : null,
        a_expertise_produit: a_expertise_produit === 'true' || a_expertise_produit === true ? 1 : 0,
        etat_produit: etat_produit || 'neuf',
        expertise_approuved_produit: 0,
        produit_image_produit,
        imageUrls,
        id_categorie_produit
      }
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

// GET all produits
exports.getAll = async (req, res, next) => {
  try {
    const { id_categorie } = req.query;
    const produits = await Produit.findAll(id_categorie);

    const formattedProduits = produits.map(produit => ({
      ...produit,
      produit_image_produit: parseImages(produit.produit_image_produit),
      imageUrls: buildImageUrls(req, produit.produit_image_produit)
    }));

    res.status(200).json({
      success: true,
      count: formattedProduits.length,
      produits: formattedProduits
    });
  } catch (error) {
    next(error);
  }
};

// GET produit by id
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const produit = await Produit.findById(id);

    if (!produit) {
      throw new ApiError(404, 'Produit non trouvé');
    }

    const formattedProduit = {
      ...produit,
      produit_image_produit: parseImages(produit.produit_image_produit),
      imageUrls: buildImageUrls(req, produit.produit_image_produit)
    };

    res.status(200).json({
      success: true,
      produit: formattedProduit
    });
  } catch (error) {
    next(error);
  }
};

// GET produits by category
exports.getByCategorie = async (req, res, next) => {
  try {
    const { id_categorie } = req.params;

    const categorie = await Categorie.findById(id_categorie);
    if (!categorie) {
      throw new ApiError(404, 'Catégorie non trouvée');
    }

    const produits = await Produit.findByCategorie(id_categorie);

    const formattedProduits = produits.map(produit => ({
      ...produit,
      produit_image_produit: parseImages(produit.produit_image_produit),
      imageUrls: buildImageUrls(req, produit.produit_image_produit)
    }));

    res.status(200).json({
      success: true,
      categorie: categorie.nom_categorie,
      count: formattedProduits.length,
      produits: formattedProduits
    });
  } catch (error) {
    next(error);
  }
};

// PUT update produit
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nom_produit,
      description_produit,
      prix_debut_produit,
      prix_fin_produit,
      a_expertise_produit,
      etat_produit,
      expertise_approuved_produit,
      id_categorie_produit,
      keep_existing_images
    } = req.body;

    // Verify produit exists
    const produit = await Produit.findById(id);
    if (!produit) {
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      throw new ApiError(404, 'Produit non trouvé');
    }

    // Verify category if provided
    if (id_categorie_produit) {
      const categorie = await Categorie.findById(id_categorie_produit);
      if (!categorie) {
        if (req.files) {
          req.files.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          });
        }
        throw new ApiError(404, 'Catégorie non trouvée');
      }
    }

    // Handle images
    let produit_image_produit = parseImages(produit.produit_image_produit);

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);

      if (keep_existing_images === 'true' || keep_existing_images === true) {
        // Append new images to existing ones
        produit_image_produit = [...produit_image_produit, ...newImages];
      } else {
        // Replace all: delete old images
        deleteImageFiles(produit.produit_image_produit);
        produit_image_produit = newImages;
      }
    } else if (keep_existing_images === 'false' || keep_existing_images === false) {
      // No new files and explicitly removing existing
      deleteImageFiles(produit.produit_image_produit);
      produit_image_produit = [];
    }
    // If no files and keep_existing_images not explicitly false, keep existing images

    await Produit.update(id, {
      nom_produit,
      description_produit: description_produit !== undefined ? (description_produit || null) : undefined,
      prix_debut_produit: prix_debut_produit !== undefined ? parseFloat(prix_debut_produit) : undefined,
      prix_fin_produit: prix_fin_produit !== undefined ? (prix_fin_produit ? parseFloat(prix_fin_produit) : null) : undefined,
      a_expertise_produit: a_expertise_produit !== undefined ? (a_expertise_produit === 'true' || a_expertise_produit === true ? 1 : 0) : undefined,
      etat_produit: etat_produit !== undefined ? etat_produit : undefined,
      expertise_approuved_produit: expertise_approuved_produit !== undefined ? (expertise_approuved_produit === 'true' || expertise_approuved_produit === true ? 1 : 0) : undefined,
      id_categorie_produit: id_categorie_produit !== undefined ? id_categorie_produit : undefined,
      produit_image_produit: JSON.stringify(produit_image_produit)
    });

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès'
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
};

// DELETE produit
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const produit = await Produit.findById(id);
    if (!produit) {
      throw new ApiError(404, 'Produit non trouvé');
    }

    // Delete image files
    deleteImageFiles(produit.produit_image_produit);

    await Produit.delete(id);

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};