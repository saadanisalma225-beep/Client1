const Domaine = require('../models/Domaine');
const ApiError = require('../utils/ApiError');

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

// Mettre à jour un domaine
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nom_domaine, description_domaine } = req.body;
    

    const image_domaine = req.file ? req.file.filename : req.body.image_domaine;

    const domaine = await Domaine.findById(id);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

 
    await Domaine.update(id, { nom_domaine, description_domaine, image_domaine });

    const imageUrl = image_domaine 
      ? `${req.protocol}://${req.get('host')}/uploads/domaines/${image_domaine}` 
      : null;

    res.status(200).json({
      success: true,
      message: 'Domaine mis à jour',
      domaine: { 
        id_domaine: parseInt(id), 
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
// Supprimer un domaine
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const domaine = await Domaine.findById(id);
    if (!domaine) {
      throw new ApiError(404, 'Domaine non trouvé');
    }

    await Domaine.delete(id);

    res.status(200).json({
      success: true,
      message: 'Domaine supprimé'
    });
  } catch (error) {
    next(error);
  }
};