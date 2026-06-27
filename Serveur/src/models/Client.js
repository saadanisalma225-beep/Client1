const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class Client {
  // Find by email (for login)
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT c.*, w.balance_wallet 
       FROM clients c 
       LEFT JOIN wallet w ON c.id_wallet = w.id_wallet 
       WHERE c.email = ?`,
      [email.toLowerCase()]
    );
    return rows[0] || null;
  }

  // Find by ID
  static async findById(id_client) {
    const [rows] = await pool.execute(
      `SELECT c.id_client, c.nom, c.prenom, c.email, c.role, 
              c.telephone, c.ville, c.adresse, c.photo_profil, 
              c.email_verifie, c.created_at,
              w.id_wallet, w.balance_wallet
       FROM clients c 
       LEFT JOIN wallet w ON c.id_wallet = w.id_wallet 
       WHERE c.id_client = ?`,
      [id_client]
    );
    return rows[0] || null;
  }

  // Create client
  static async create(clientData) {
    const [result] = await pool.execute(
      `INSERT INTO clients 
       (id_wallet, nom, prenom, email, mot_de_passe, role, telephone, ville, adresse, photo_profil)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientData.id_wallet,
        clientData.nom,
        clientData.prenom,
        clientData.email.toLowerCase(),
        clientData.mot_de_passe,
        clientData.role || 'acheteur',
        clientData.telephone || null,
        clientData.ville || null,
        clientData.adresse || null,
        clientData.photo_profil || null
      ]
    );
    return result.insertId;
  }

  // Update client
  static async update(id_client, updateData) {
    const fields = [];
    const values = [];

    if (updateData.nom !== undefined) { fields.push('nom = ?'); values.push(updateData.nom); }
    if (updateData.prenom !== undefined) { fields.push('prenom = ?'); values.push(updateData.prenom); }
    if (updateData.telephone !== undefined) { fields.push('telephone = ?'); values.push(updateData.telephone); }
    if (updateData.ville !== undefined) { fields.push('ville = ?'); values.push(updateData.ville); }
    if (updateData.adresse !== undefined) { fields.push('adresse = ?'); values.push(updateData.adresse); }
    if (updateData.photo_profil !== undefined) { fields.push('photo_profil = ?'); values.push(updateData.photo_profil); }

    if (fields.length === 0) return;

    values.push(id_client);
    await pool.execute(
      `UPDATE clients SET ${fields.join(', ')} WHERE id_client = ?`,
      values
    );
  }

  // Update password
  static async updatePassword(id_client, hashedPassword) {
    await pool.execute(
      'UPDATE clients SET mot_de_passe = ? WHERE id_client = ?',
      [hashedPassword, id_client]
    );
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Client;