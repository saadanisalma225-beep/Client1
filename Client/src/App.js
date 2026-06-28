// App.js
import React, { useState } from 'react';
import Admin from './admin/admin';
import Dashboard from './admin/Dashboard';
import Register from './admin/Register';
import HomePage from './admin/HomePage';
import AuthPage from './admin/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [currentPage, setCurrentPage] = useState('home');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Vérifier si l'utilisateur est connecté (client)
  const isClientLoggedIn = !!localStorage.getItem('token');

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  switch (currentPage) {
    case 'home':
      return <HomePage onNavigate={setCurrentPage} />;
    case 'auth':
      return <AuthPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
    case 'admin':
      return (
        <div>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              padding: '10px 20px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1000,
              fontSize: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            ← Retour à l'accueil
          </button>
          <Admin onLogin={handleLogin} onRegisterClick={() => setCurrentPage('register')} />
        </div>
      );
    case 'register':
      return (
        <div>
          <button 
            onClick={() => setCurrentPage('home')}
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              padding: '10px 20px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1000,
              fontSize: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            ← Retour à l'accueil
          </button>
          <Register />
        </div>
      );
    default:
      return <HomePage onNavigate={setCurrentPage} />;
  }
}

export default App;