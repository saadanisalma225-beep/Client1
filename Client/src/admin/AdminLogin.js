import React, { useState } from 'react';
import '../assets/css/admin/AdminLogin.css';

const AdminLogin = ({ onLogin, onRegisterClick }) => {
  const [credentials, setCredentials] = useState({
    email_admin: '',
    password_admin: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Appel API vers votre backend
    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        onLogin();
      } else {
        setError(data.message || 'Échec de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="admin-container">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>Administrateur</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          name="email_admin"           
          className="admin-input"
          placeholder="Email"
          value={credentials.email_admin}  
          onChange={handleChange}
          required
        />
        
        <input
          type="password"
          name="password_admin"           
          className="admin-input"
          placeholder="Mot de passe"
          value={credentials.password_admin}  
          onChange={handleChange}
          required
        />
        
        <button type="submit" className="admin-button">
          Se connecter
        </button>

        {/* ✅ Lien vers la page d'inscription */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>
            Pas encore de compte ?{' '}
          </span>
          <button
            type="button"
            onClick={onRegisterClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'underline',
              padding: '0'
            }}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;