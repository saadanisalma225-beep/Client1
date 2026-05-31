const { pool } = require('../config/database');

class Domaine {
  // Créer un domaine
  static async create({ nom_domaine, description_domaine, image_domaine }) {  
    const [result] = await pool.execute(
      'INSERT INTO domaines (nom_domaine, description_domaine, image_domaine) VALUES (?, ?, ?)',  
      [nom_domaine, description_domaine, image_domaine]  
    );
    return result.insertId;
  }

  // Récupérer tous les domaines
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM domaines ORDER BY created_at DESC'
    );
    return rows;
  }

  // Récupérer un domaine par ID
  static async findById(id_domaine) {
    const [rows] = await pool.execute(
      'SELECT * FROM domaines WHERE id_domaine = ?',
      [id_domaine]
    );
    return rows[0] || null;
  }

  // Mettre à jour un domaine
  static async update(id_domaine, { nom_domaine, description_domaine, image_domaine }) {  
    const [result] = await pool.execute(
      'UPDATE domaines SET nom_domaine = ?, description_domaine = ?, image_domaine = ? WHERE id_domaine = ?',  
      [nom_domaine, description_domaine, image_domaine, id_domaine]  
    );
    return result.affectedRows > 0;
  }

  // Supprimer un domaine
  static async delete(id_domaine) {
    const [result] = await pool.execute(
      'DELETE FROM domaines WHERE id_domaine = ?',
      [id_domaine]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Domaine;