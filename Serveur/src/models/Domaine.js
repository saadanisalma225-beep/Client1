const { pool } = require('../config/database');

class Domaine {
  // Helper pour convertir undefined en null
  static sanitize(value) {
    return value === undefined ? null : value;
  }

  // Créer un domaine - CORRIGÉ
  static async create({ nom_domaine, description_domaine, image_domaine }) {
    // Convertir undefined en null pour MySQL
    const cleanNom = this.sanitize(nom_domaine);
    const cleanDescription = this.sanitize(description_domaine);
    const cleanImage = this.sanitize(image_domaine);
    
    const [result] = await pool.execute(
      'INSERT INTO domaines (nom_domaine, description_domaine, image_domaine) VALUES (?, ?, ?)',
      [cleanNom, cleanDescription, cleanImage]
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

  // Mettre à jour un domaine - CORRIGÉ
  static async update(id_domaine, { nom_domaine, description_domaine, image_domaine }) {
    // Convertir undefined en null pour MySQL
    const cleanNom = this.sanitize(nom_domaine);
    const cleanDescription = this.sanitize(description_domaine);
    const cleanImage = this.sanitize(image_domaine);
    
    const [result] = await pool.execute(
      'UPDATE domaines SET nom_domaine = ?, description_domaine = ?, image_domaine = ? WHERE id_domaine = ?',
      [cleanNom, cleanDescription, cleanImage, id_domaine]
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