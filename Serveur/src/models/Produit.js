const { pool } = require('../config/database');

class Produit {
  // Create a new produit
  static async create(data) {
    const {
      nom_produit,
      description_produit,
      prix_debut_produit,
      prix_fin_produit,
      a_expertise_produit,
      etat_produit,
      id_categorie_produit,
      produit_image_produit
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO produits (
        nom_produit, description_produit, prix_debut_produit, prix_fin_produit,
        a_expertise_produit, etat_produit, id_categorie_produit, produit_image_produit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nom_produit,
        description_produit,
        prix_debut_produit,
        prix_fin_produit,
        a_expertise_produit,
        etat_produit,
        id_categorie_produit,
        produit_image_produit
      ]
    );

    return result.insertId;
  }

  // Find all produits (optional filter by category)
  static async findAll(id_categorie = null) {
    let sql = `
      SELECT 
        p.*,
        c.nom_categorie,
        d.nom_domaine
      FROM produits p
      LEFT JOIN categories c ON p.id_categorie_produit = c.id_categorie
      LEFT JOIN domaines d ON c.id_domaine = d.id_domaine
    `;
    const params = [];

    if (id_categorie) {
      sql += ' WHERE p.id_categorie_produit = ?';
      params.push(id_categorie);
    }

    sql += ' ORDER BY p.date_publication_produit DESC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  // Find produit by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT 
        p.*,
        c.nom_categorie,
        d.nom_domaine
      FROM produits p
      LEFT JOIN categories c ON p.id_categorie_produit = c.id_categorie
      LEFT JOIN domaines d ON c.id_domaine = d.id_domaine
      WHERE p.id_produit = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Find produits by category
  static async findByCategorie(id_categorie) {
    const [rows] = await pool.execute(
      `SELECT 
        p.*,
        c.nom_categorie,
        d.nom_domaine
      FROM produits p
      LEFT JOIN categories c ON p.id_categorie_produit = c.id_categorie
      LEFT JOIN domaines d ON c.id_domaine = d.id_domaine
      WHERE p.id_categorie_produit = ?
      ORDER BY p.date_publication_produit DESC`,
      [id_categorie]
    );
    return rows;
  }

  // Update produit (only update provided fields)
  static async update(id, data) {
    const updates = [];
    const values = [];

    if (data.nom_produit !== undefined) {
      updates.push('nom_produit = ?');
      values.push(data.nom_produit);
    }
    if (data.description_produit !== undefined) {
      updates.push('description_produit = ?');
      values.push(data.description_produit);
    }
    if (data.prix_debut_produit !== undefined) {
      updates.push('prix_debut_produit = ?');
      values.push(data.prix_debut_produit);
    }
    if (data.prix_fin_produit !== undefined) {
      updates.push('prix_fin_produit = ?');
      values.push(data.prix_fin_produit);
    }
    if (data.a_expertise_produit !== undefined) {
      updates.push('a_expertise_produit = ?');
      values.push(data.a_expertise_produit);
    }
    if (data.etat_produit !== undefined) {
      updates.push('etat_produit = ?');
      values.push(data.etat_produit);
    }
    if (data.expertise_approuved_produit !== undefined) {
      updates.push('expertise_approuved_produit = ?');
      values.push(data.expertise_approuved_produit);
    }
    if (data.id_categorie_produit !== undefined) {
      updates.push('id_categorie_produit = ?');
      values.push(data.id_categorie_produit);
    }
    if (data.produit_image_produit !== undefined) {
      updates.push('produit_image_produit = ?');
      values.push(data.produit_image_produit);
    }

    if (updates.length === 0) {
      return 0; // Nothing to update
    }

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE produits SET ${updates.join(', ')} WHERE id_produit = ?`,
      values
    );

    return result.affectedRows;
  }

  // Delete produit
  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM produits WHERE id_produit = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = Produit;