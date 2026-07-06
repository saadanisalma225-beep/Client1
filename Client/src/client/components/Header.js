import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  Bell,
  User,
  LogOut,
  Wallet,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { decryptData } from '../../utils/crypto';  

const Header = ({ onNavigate, isClientLoggedIn, onClientLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Use decryptData instead of JSON.parse
    const encryptedUser = localStorage.getItem('user');
    if (isClientLoggedIn && encryptedUser) {
      const user = decryptData(encryptedUser);  // ← FIXED: use decryptData
      if (user) {
        setClient(user);
      } else {
        setClient(null);
      }
    } else {
      setClient(null);
    }
  }, [isClientLoggedIn]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setClient(null);
    onClientLogout?.();
    onNavigate?.('home');
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo" onClick={() => onNavigate?.('home')}>
          <div className="logo-icon">🔨</div>
          <h2>Bazart.</h2>
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate?.('home'); }}>Accueil</a>
          <a href="#auctions" onClick={(e) => { e.preventDefault(); onNavigate?.('auctions'); }}>Enchères</a>
          <a href="#categories" onClick={(e) => { e.preventDefault(); onNavigate?.('categories'); }}>Catégories</a>
          <a href="#sell" onClick={(e) => { e.preventDefault(); onNavigate?.('sell'); }}>Vendre</a>
          <a href="#wallet" onClick={(e) => { e.preventDefault(); onNavigate?.('wallet'); }}>My Wallet</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); onNavigate?.('contact'); }}>Contact</a> {/* ← AJOUT */}
        </nav>

        <div className="header-actions">
          {isClientLoggedIn && client ? (
            <>
              <button className="btn-icon" title="Rechercher">
                <Search size={20} strokeWidth={2} />
              </button>
              <button className="btn-icon" title="Favoris">
                <Heart size={20} strokeWidth={2} />
              </button>
              <button className="btn-icon notif-btn" title="Notifications">
                <Bell size={20} strokeWidth={2} />
                <span className="notif-badge">3</span>
              </button>
              <div className="profile-menu">
                <img 
                  src={client?.photo_profil ? `http://localhost:5000${client.photo_profil}` : 'https://i.pravatar.cc/150?img=5'} 
                  alt="Profil" 
                  className="profile-avatar-small"
                  onClick={() => onNavigate?.('profile')}
                />
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <span>{client?.prenom} {client?.nom}</span>
                    <small>{client?.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => onNavigate?.('profile')}>
                    <User size={16} strokeWidth={2} />
                    Mon profil
                  </button>
                  <button onClick={() => onNavigate?.('wallet')}>
                    <Wallet size={16} strokeWidth={2} />
                    Mon wallet
                  </button>
                  <button onClick={() => onNavigate?.('settings')}>
                    <Settings size={16} strokeWidth={2} />
                    Paramètres
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={16} strokeWidth={2} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => onNavigate?.('admin')}>
                Administration
              </button>
              <button className="btn-primary-header" onClick={() => onNavigate?.('auth')}>
                <User size={18} strokeWidth={2} />
                <span>Connexion</span>
              </button>
            </>
          )}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;