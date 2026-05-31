import React from 'react';

const TempPage = () => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>✅ Connexion réussie !</h1>
      <p>Vous êtes connecté en tant qu'administrateur.</p>
      <p>Le dashboard est en cours de développement...</p>
      
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: '20px',
          padding: '10px 20px', 
          background: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Déconnexion
      </button>
    </div>
  );
};

export default TempPage;