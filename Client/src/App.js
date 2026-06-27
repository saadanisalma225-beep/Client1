import React, { useState } from 'react';
import Admin from './admin/admin';
import Dashboard from './admin/Dashboard';
import Register from './admin/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  // ✅ Si l'utilisateur est connecté → Dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // ✅ Si on est sur la page d'inscription → Register
  if (showRegister) {
    return (
      <div>
        {/* Bouton Retour */}
        <button 
          onClick={() => setShowRegister(false)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 1000,
            fontSize: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          ← Retour à la connexion
        </button>
        <Register />
      </div>
    );
  }

  // ✅ Sinon → Page de connexion Admin
  return <Admin onLogin={handleLogin} onRegisterClick={() => setShowRegister(true)} />;
}

export default App;