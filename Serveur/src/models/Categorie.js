const { pool } = require('../config/database');

class Categorie {
  // Créer une catégorie
  static async create({ nom_categorie, description_categorie, image_categorie, id_domaine }) {
    const [result] = await pool.execute(
      'INSERT INTO categories (nom_categorie, description_categorie, image_categorie, id_domaine) VALUES (?, ?, ?, ?)',
      [nom_categorie, description_categorie, image_categorie, id_domaine]
    );
    return result.insertId;
  }

  // Récupérer toutes les catégories
  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT c.*, d.nom_domaine 
      FROM categories c
      JOIN domaines d ON c.id_domaine = d.id_domaine
      ORDER BY c.created_at DESC
    `);
    return rows;
  }

  // Récupérer les catégories d'un domaine
  static async findByDomaine(id_domaine) {
    const [rows] = await pool.execute(
      'SELECT * FROM categories WHERE id_domaine = ? ORDER BY created_at DESC',
      [id_domaine]
    );
    return rows;
  }

  // Récupérer une catégorie par ID
  static async findById(id_categorie) {
    const [rows] = await pool.execute(`
      SELECT c.*, d.nom_domaine 
      FROM categories c
      JOIN domaines d ON c.id_domaine = d.id_domaine
      WHERE c.id_categorie = ?
    `, [id_categorie]);
    return rows[0] || null;
  }

  // ============================================
  // UPDATED: Mettre à jour une catégorie (dynamic)
  // ============================================
  static async update(id_categorie, data) {
    const fields = [];
    const values = [];
    
    if (data.nom_categorie !== undefined) {
      fields.push('nom_categorie = ?');
      values.push(data.nom_categorie);
    }
    if (data.description_categorie !== undefined) {
      fields.push('description_categorie = ?');
      values.push(data.description_categorie);
    }
    if (data.image_categorie !== undefined) {
      fields.push('image_categorie = ?');
      values.push(data.image_categorie);
    }
    if (data.id_domaine !== undefined) {
      fields.push('id_domaine = ?');
      values.push(data.id_domaine);
    }
    
    if (fields.length === 0) return false;
    
    values.push(id_categorie);
    const query = `UPDATE categories SET ${fields.join(', ')} WHERE id_categorie = ?`;
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  // Supprimer une catégorie
  static async delete(id_categorie) {
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id_categorie = ?',
      [id_categorie]
    );
    return result.affectedRows > 0;
  }

 // Count products for a category
static async countProducts(id_categorie) {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as count FROM produits WHERE id_categorie_produit = ?',
    [id_categorie]
  );
  return rows[0].count;
}

// Delete all products in a category
static async deleteProductsByCategory(id_categorie) {
  await pool.execute(
    'DELETE FROM produits WHERE id_categorie_produit = ?',
    [id_categorie]
  );
}
}

module.exports = Categorie;