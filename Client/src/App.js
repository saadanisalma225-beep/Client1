// App.js
import React, { useState, useEffect } from 'react';
import Layout from './client/components/Layout';
import Admin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import Register from './admin/Register';
import HomePage from './client/HomePage';
import AuthPage from './client/AuthPage';
import ProfilePage from './client/ProfilePage';
import Encheres from './client/Encheres';
import VoirDetails from './client/VoirDetails';
import EncheresEnCours from './client/EncheresEnCours';
import Publies from './client/Publies';
import PubliesSimple from './client/PubliesSimple'; // ✅ NOUVEL IMPORT
import EnAttente from './client/EnAttente';
import Vendus from './client/Vendus';
import Gagnes from './client/Gagnes';
import ParticipationEnchere from './client/ParticipationEnchere';
import WalletPage from './client/Wallet';
import EmailVerification from './client/EmailVerification';
import DomainesPage from './client/DomainesPage';
import CategoriesPage from './client/CategoriesPage';
import ContactPage from './client/ContactPage';
import { FileText } from 'lucide-react';

// ✅ Composant pour la page "Publiés" (liste vide)
const PubliesListPage = ({ onNavigate }) => {
  return (
    <div className="conteneur-publier">
      <div className="assistant-wrapper">
        <div className="empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <FileText size={48} style={{ color: '#cbd5e0', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '8px' }}>
            Vous n'avez pas encore publié de produits
          </h3>
          <p style={{ color: '#718096', marginBottom: '20px' }}>
            Publiez votre premier produit dès maintenant !
          </p>
          <button 
            className="btn-create-product"
            onClick={() => onNavigate('sell')}
            style={{
              padding: '12px 32px',
              background: '#ed8936',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Vendre un produit
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('home');
  const [currentPageData, setCurrentPageData] = useState(null);

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
    setCurrentPageData(data);
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
        return <HomePage key="home" onNavigate={handleNavigate} isClientLoggedIn={isClientLoggedIn} />;
      case 'profile':
        return <ProfilePage key="profile" onNavigate={handleNavigate} />;
      case 'encheres':
        return <Encheres key="encheres" onNavigate={handleNavigate} />;
      case 'publies':
        // ✅ Page "Publiés" - Liste vide avec bouton "Vendre"
        return <PubliesListPage key="publies-list" onNavigate={handleNavigate} />;
      case 'attente':
        return <EnAttente key="attente" onNavigate={handleNavigate} />;
      case 'vendus':
        return <Vendus key="vendus" onNavigate={handleNavigate} />;
      case 'gagnes':
        return <Gagnes key="gagnes" onNavigate={handleNavigate} />;
      case 'auctions':
        return <EncheresEnCours key="auctions" onNavigate={handleNavigate} />;
      case 'product-detail':
        return <ParticipationEnchere key={`product-${currentPageData}`} onNavigate={handleNavigate} productId={currentPageData} />;
      case 'domaines':
        return <DomainesPage key="domaines" onNavigate={handleNavigate} />;
      case 'categories':
        return <CategoriesPage key="categories" onNavigate={handleNavigate} />;
      case 'wallet':
        return <WalletPage key="wallet" onNavigate={handleNavigate} />;
      case 'settings':
        return <div key="settings" className="page-placeholder"><h2>Paramètres</h2></div>;
      case 'sell':
        // ✅ Page "Vendre" - Formulaire en deux étapes (version simplifiée)
        return <PubliesSimple key="sell-form" onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage key="contact" onNavigate={handleNavigate} />;
      default:
        return <HomePage key="home-default" onNavigate={handleNavigate} isClientLoggedIn={isClientLoggedIn} />;
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