const { pool } = require('../config/database');

class Domaine {
  // Helper pour convertir undefined en null
  static sanitize(value) {
    return value === undefined ? null : value;
  }

  // Créer un domaine
  static async create({ nom_domaine, description_domaine, image_domaine }) {
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

  // ============================================
  // UPDATED: Dynamic update (only updates provided fields)
  // ============================================
  static async update(id_domaine, data) {
    const fields = [];
    const values = [];

    if (data.nom_domaine !== undefined) {
      fields.push('nom_domaine = ?');
      values.push(data.nom_domaine);
    }
    if (data.description_domaine !== undefined) {
      fields.push('description_domaine = ?');
      values.push(data.description_domaine);
    }
    if (data.image_domaine !== undefined) {
      fields.push('image_domaine = ?');
      values.push(data.image_domaine);
    }

    if (fields.length === 0) return false;

    values.push(id_domaine);
    const query = `UPDATE domaines SET ${fields.join(', ')} WHERE id_domaine = ?`;
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  // ============================================
  // NEW: Get category and product count for domain
  // ============================================
  static async getCategoryAndProductCount(id_domaine) {
    // Count categories
    const [catRows] = await pool.execute(
      'SELECT COUNT(*) as count FROM categories WHERE id_domaine = ?',
      [id_domaine]
    );

    // Count products through categories
    const [prodRows] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM produits p
      JOIN categories c ON p.id_categorie_produit = c.id_categorie
      WHERE c.id_domaine = ?
    `, [id_domaine]);

    return {
      categoryCount: catRows[0].count,
      productCount: prodRows[0].count
    };
  }

  // ============================================
  // NEW: Delete all products in categories of a domain
  // ============================================
  static async deleteProductsByDomain(id_domaine) {
    await pool.execute(`
      DELETE p FROM produits p
      JOIN categories c ON p.id_categorie_produit = c.id_categorie
      WHERE c.id_domaine = ?
    `, [id_domaine]);
  }

  // ============================================
  // NEW: Delete all categories of a domain
  // ============================================
  static async deleteCategoriesByDomain(id_domaine) {
    // Delete category images first
    const [rows] = await pool.execute(
      'SELECT image_categorie FROM categories WHERE id_domaine = ? AND image_categorie IS NOT NULL',
      [id_domaine]
    );

    const fs = require('fs');
    const path = require('path');

    rows.forEach(row => {
      if (row.image_categorie) {
        const imgPath = path.join(__dirname, '../../uploads/categories', row.image_categorie);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      }
    });

    await pool.execute(
      'DELETE FROM categories WHERE id_domaine = ?',
      [id_domaine]
    );
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