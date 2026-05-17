const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
 
  // Trouver par email (login)
  static async findByEmail(email_admin) {
    const [rows] = await pool.execute(
      'SELECT * FROM admin WHERE email_admin = ?',
      [email_admin]
    );
    return rows[0] || null;
  }

  // Trouver par ID
  static async findById(id_admin) {
    const [rows] = await pool.execute(
      'SELECT id_admin, nom_admin, email_admin FROM admin WHERE id_admin = ?',
      [id_admin]
    );
    return rows[0] || null;
  }

  // Comparer mot de passe
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = Admin;