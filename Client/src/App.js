import React, { useState, useEffect } from 'react';
import Layout from './client/components/Layout';
import Admin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import Register from './admin/Register';
import HomePage from './client/HomePage';
import AuthPage from './client/AuthPage';
import ProfilePage from './client/ProfilePage';
import EmailVerification from './client/EmailVerification';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('home');

  // Check client login status on mount
  useEffect(() => {
    const checkClientLogin = () => {
      setIsClientLoggedIn(!!localStorage.getItem('token'));
    };
    checkClientLogin();
    window.addEventListener('storage', checkClientLogin);
    return () => window.removeEventListener('storage', checkClientLogin);
  }, []);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  const handleClientLogin = () => {
    setIsClientLoggedIn(true);
    setCurrentPage('home');
  };

  const handleClientLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsClientLoggedIn(false);
    setCurrentPage('home');
  };

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const isVerifyEmailPage = window.location.pathname === '/verify-email';
  if (isVerifyEmailPage) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    return <EmailVerification token={token} onNavigate={handleNavigate} />;
  }

  if (isAdminLoggedIn) {
    return <Dashboard onLogout={handleAdminLogout} />;
  }

  const noLayoutPages = ['auth', 'admin', 'register'];
  if (noLayoutPages.includes(currentPage)) {
    switch (currentPage) {
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} onLogin={handleClientLogin} />;
      case 'admin':
        return (
          <div>
            <BackToHomeButton onClick={() => setCurrentPage('home')} />
            <Admin onLogin={handleAdminLogin} onRegisterClick={() => setCurrentPage('register')} />
          </div>
        );
      case 'register':
        return (
          <div>
            <BackToHomeButton onClick={() => setCurrentPage('home')} />
            <Register />
          </div>
        );
      default:
        return null;
    }
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} isClientLoggedIn={isClientLoggedIn} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'wallet':
        return <div className="page-placeholder"><h2>My Wallet</h2></div>;
      case 'settings':
        return <div className="page-placeholder"><h2>Paramètres</h2></div>;
      case 'auctions':
        return <div className="page-placeholder"><h2>Enchères</h2></div>;
      case 'categories':
        return <div className="page-placeholder"><h2>Catégories</h2></div>;
      case 'sell':
        return <div className="page-placeholder"><h2>Vendre</h2></div>;
      default:
        return <HomePage onNavigate={handleNavigate} isClientLoggedIn={isClientLoggedIn} />;
    }
  };

  return (
    <Layout 
      onNavigate={handleNavigate} 
      isClientLoggedIn={isClientLoggedIn} 
      onClientLogout={handleClientLogout}
    >
      {renderPageContent()}
    </Layout>
  );
}

function BackToHomeButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
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
  );
}

export default App;