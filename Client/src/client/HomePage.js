import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Trophy,
  Search,
  Heart,
  Flame,
  Timer,
  Users,
  ShoppingBag,
  ThumbsUp,
  Clock,
  ArrowRight,
  Gavel,
  User
} from 'lucide-react';
import '../assets/css/client/HomePage.css';

const HomePage = ({ onNavigate, isClientLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredCategories = [
    { name: 'Tapis Berbères', image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400', count: '124 enchères' },
    { name: 'Poteries & Céramiques', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', count: '89 enchères' },
    { name: 'Bijoux Traditionnels', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', count: '156 enchères' },
    { name: 'Cuirs & Maroquinerie', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400', count: '67 enchères' },
  ];

  const featuredAuctions = [
    { id: 1, title: 'Tapis Azilal Vintage 1980', price: '2,500 MAD', timeLeft: '2j 14h', image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400', bids: 12 },
    { id: 2, title: 'Vase Fassi Émaillé', price: '850 MAD', timeLeft: '5j 8h', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400', bids: 8 },
    { id: 3, title: 'Collier Amber Berbère', price: '1,200 MAD', timeLeft: '1j 6h', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', bids: 24 },
  ];

  const stats = [
    { number: '15K+', label: 'Membres actifs', icon: <Users size={28} strokeWidth={2} /> },
    { number: '8K+', label: 'Objets vendus', icon: <ShoppingBag size={28} strokeWidth={2} /> },
    { number: '98%', label: 'Satisfaction client', icon: <ThumbsUp size={28} strokeWidth={2} /> },
    { number: '24/7', label: 'Support disponible', icon: <Clock size={28} strokeWidth={2} /> },
  ];

  const steps = [
    { icon: <User size={32} strokeWidth={2} />, title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement et vérifiez votre email pour commencer.' },
    { icon: <Search size={32} strokeWidth={2} />, title: 'Trouvez votre trésor', desc: 'Parcourez nos catégories et trouvez l\'objet qui vous fait rêver.' },
    { icon: <Gavel size={32} strokeWidth={2} />, title: 'Enchérissez & Gagnez', desc: 'Placez votre enchère et remportez des pièces uniques.' },
  ];

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Trophy size={16} strokeWidth={2} />
            Plateforme d'enchères N°1 au Maroc
          </div>
          <h1 className="hero-title">
            L'artisanat marocain<br />
            <span className="gradient-text">authentique & rare</span>
          </h1>
          <p className="hero-subtitle">
            Découvrez des pièces uniques d'artisanat traditionnel marocain. 
            Tapis berbères, poteries, bijoux et objets d'art aux enchères.
          </p>
          <div className="hero-buttons">
            <button className="btn-hero-primary" onClick={() => onNavigate?.(isClientLoggedIn ? 'auctions' : 'auth')}>
              {isClientLoggedIn ? 'Commencer les enchères' : 'S\'inscrire gratuitement'}
              <ChevronRight size={18} strokeWidth={2} />
            </button>
            <button className="btn-hero-secondary" onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>
              Explorer les catégories
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-card">
          <img 
          src="https://kimi-web-img.moonshot.cn/img/them.fr/b948d7a922e348a99845b47d8140813a1523d5a7.jpg" 
          alt="Tapis Berbère Azilal - Enchère en cours"
        />
            
           
            <div className="floating-badge badge-live">
              <span className="live-dot"></span>
              Enchères en direct
            </div>
            <div className="floating-badge badge-price">
              <Flame size={16} strokeWidth={2} />
              À partir de 100 MAD
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-icon-wrapper">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="categories-section" id="categories">
        <div className="section-header">
          <span className="section-tag">Catégories</span>
          <h2>Explorez nos collections</h2>
          <p>Des trésors artisanaux soigneusement sélectionnés pour vous</p>
        </div>
        <div className="categories-grid">
          {featuredCategories.map((cat, index) => (
            <div className="category-card" key={index} onClick={() => onNavigate?.('categories')}>
              <div className="category-image">
                <img src={cat.image} alt={cat.name} />
                <div className="category-overlay"></div>
              </div>
              <div className="category-info">
                <h3>{cat.name}</h3>
                <span className="category-count">{cat.count}</span>
                <button className="btn-explore">
                  Explorer
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="auctions-section" id="auctions">
        <div className="section-header">
          <span className="section-tag">Enchères en cours</span>
          <h2>Objets à ne pas manquer</h2>
          <p>Les enchères les plus populaires de cette semaine</p>
        </div>
        <div className="auctions-grid">
          {featuredAuctions.map((auction) => (
            <div className="auction-card" key={auction.id}>
              <div className="auction-image">
                <img src={auction.image} alt={auction.title} />
                <div className="auction-timer">
                  <Timer size={12} strokeWidth={2} />
                  {auction.timeLeft}
                </div>
                <div className="auction-bids">
                  <Flame size={12} strokeWidth={2} />
                  {auction.bids} enchères
                </div>
              </div>
              <div className="auction-info">
                <h3>{auction.title}</h3>
                <div className="auction-price-row">
                  <div className="current-price">
                    <span className="price-label">Prix actuel</span>
                    <span className="price-value">{auction.price}</span>
                  </div>
                  <button className="btn-bid" onClick={() => onNavigate?.(isClientLoggedIn ? 'bid' : 'auth')}>
                    Enchérir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <button className="btn-view-all" onClick={() => onNavigate?.(isClientLoggedIn ? 'auctions' : 'auth')}>
            Voir toutes les enchères
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-header light">
          <span className="section-tag">Comment ça marche</span>
          <h2>Enchérissez en 3 étapes</h2>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="step-card">
                <div className="step-icon-wrapper">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <ArrowRight size={20} strokeWidth={2} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à découvrir l'exceptionnel ?</h2>
          <p>Rejoignez notre communauté de passionnés et accédez aux plus belles pièces d'artisanat marocain.</p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => onNavigate?.(isClientLoggedIn ? 'auctions' : 'auth')}>
              {isClientLoggedIn ? 'Explorer les enchères' : 'Créer mon compte gratuitement'}
            </button>
            {!isClientLoggedIn && (
              <button className="btn-cta-secondary" onClick={() => onNavigate?.('auth')}>
                Se connecter
              </button>
            )}
          </div>
        </div>
        <div className="cta-decoration">
          <div className="cta-circle c1"></div>
          <div className="cta-circle c2"></div>
          <div className="cta-circle c3"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 