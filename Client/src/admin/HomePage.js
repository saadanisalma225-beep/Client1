// HomePage.js
import React from 'react';
import './HomePage.css';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo">
            <h2>Bazart.</h2>
          </div>
          <nav className="main-nav">
            <a href="#home" onClick={(e) => { e.preventDefault(); }}>Accueil</a>
            <a href="#sell" onClick={(e) => { e.preventDefault(); }}>Vendre</a>
            <a href="#auctions" onClick={(e) => { e.preventDefault(); }}>Enchères</a>
            <a href="#categories" onClick={(e) => { e.preventDefault(); }}>Catégories</a>
            <a href="#wallet" onClick={(e) => { e.preventDefault(); }}>My Wallet</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); }}>Contact</a>
          </nav>
          <div className="header-actions">
            <button className="btn-login" onClick={() => onNavigate?.('admin')}>
              Administration
            </button>
            <button className="btn-register" onClick={() => onNavigate?.('auth')} title="Connexion / Inscription">
              👤
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">L'artisanat marocain authentique</h1>
          <p className="hero-subtitle">
            Découvrez des pièces uniques d'artisanat traditionnel marocain. 
            Tapis berbères, poteries, bijoux et objets d'art aux enchères.
          </p>
          <div className="hero-buttons">
            <a href="#auctions" className="btn-primary">Explorer les enchères →</a>
            <a href="#about" className="btn-secondary">En savoir plus</a>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://via.placeholder.com/600x400?text=Artisanat+Marocain" 
            alt="Artisanat marocain"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;