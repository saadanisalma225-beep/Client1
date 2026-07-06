// client/Encheres.js
import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Heart,
  FileText,
  CheckCircle,
  Clock,
  Trophy,
  Eye,
  MessageCircle,
  Timer,
  MoreVertical,
  User,
  Calendar
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './Encheres.css';

const Encheres = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('actives');
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState({
    actives: 0,
    favoris: 0,
    publies: 0,
    vendus: 0,
    attente: 0,
    gagnes: 0
  });

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!encryptedUser || !token) {
      onNavigate?.('auth');
      return;
    }

    const user = decryptData(encryptedUser);
    if (!user) {
      onNavigate?.('auth');
      return;
    }

    setClient(user);
    fetchUserData(token, user.id);
  }, [onNavigate]);

  const fetchUserData = async (token, userId) => {
    setLoading(true);
    try {
      // DONNÉES D'IMANE - Affichées pour tout le monde
      const imaneData = {
        actives: [
          {
            id: 1,
            titre: 'Tapis Berbère Azilal Vintage',
            categorie: 'Tapis & Textiles',
            prix_actuel: 10000,
            prix_depart: 5000,
            enchères_reçues: 24,
            vues: 156,
            temps_restant: "Moins d'1 heure",
            date_fin: '2025-12-24T18:00:00',
            date_debut: '2025-12-01T10:00:00',
            image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400',
            statut: 'actif',
            questions: 3,
            offre_actuelle: 'Imane sh',
            plus_haute_offre: 10000
          }
        ],
        favoris: [],
        publies: [],
        vendus: [],
        attente: [],
        gagnes: []
      };

      setAuctions(imaneData);
      setStats({
        actives: 1,
        favoris: 0,
        publies: 1,
        vendus: 0,
        attente: 0,
        gagnes: 0
      });
      
    } catch (error) {
      console.error('Erreur chargement enchères:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'actives', label: 'Mes Enchères', icon: <Gavel size={18} /> },
    { id: 'favoris', label: 'Favoris', icon: <Heart size={18} /> },
    { id: 'publies', label: 'Publiés', icon: <FileText size={18} /> },
    { id: 'vendus', label: 'Vendus', icon: <CheckCircle size={18} /> },
    { id: 'attente', label: 'En Attente', icon: <Clock size={18} /> },
    { id: 'gagnes', label: 'Gagnés', icon: <Trophy size={18} /> }
  ];

  const getCurrentData = () => {
    let data = [];
    switch(activeTab) {
      case 'actives': data = auctions.actives || []; break;
      case 'favoris': data = auctions.favoris || []; break;
      case 'publies': data = auctions.publies || []; break;
      case 'vendus': data = auctions.vendus || []; break;
      case 'attente': data = auctions.attente || []; break;
      case 'gagnes': data = auctions.gagnes || []; break;
      default: return [];
    }
    return data;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const currentData = getCurrentData();

  return (
    <div className="encheres-page">
      {/* Header du profil vendeur */}
      <section className="vendeur-header">
        <div className="vendeur-header-bg"></div>
        <div className="vendeur-header-content">
          <div className="vendeur-avatar">
            <img 
              src={client?.photo_profil ? `http://localhost:5000${client.photo_profil}` : 'https://i.pravatar.cc/150?img=5'} 
              alt={client?.nom}
            />
          </div>
          
          <div className="vendeur-info">
            <h1>{client?.prenom} {client?.nom}</h1>
            <p className="membre-since">
              Membre depuis {client?.created_at ? formatDate(client.created_at) : 'Décembre 2025'}
            </p>
            
            <div className="vendeur-stats">
              <div className="stat-item">
                <Gavel size={16} />
                <span className="stat-number">{stats.actives}</span>
                <span className="stat-label">enchères actives</span>
              </div>
              <div className="stat-item">
                <FileText size={16} />
                <span className="stat-number">{stats.publies}</span>
                <span className="stat-label">produits publiés</span>
              </div>
              <div className="stat-item">
                <CheckCircle size={16} />
                <span className="stat-number">{stats.vendus}</span>
                <span className="stat-label">produits vendus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="tabs-section">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.id === 'actives' && currentData.length > 0 && (
                <span className="tab-badge">{currentData.length}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement de vos enchères...</p>
          </div>
        ) : currentData.length > 0 ? (
          <div className="auctions-list">
            {currentData.map((auction) => (
              <div className="auction-card" key={auction.id}>
                <div className="auction-card-image">
                  <img src={auction.image} alt={auction.titre} />
                  <span className="auction-status status-active">En cours</span>
                  <div className="auction-timer-badge">
                    <Timer size={14} />
                    {auction.temps_restant}
                  </div>
                </div>
                
                <div className="auction-card-content">
                  <div className="auction-header">
                    <h3 className="auction-title">{auction.titre}</h3>
                    <button className="btn-more-options">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  
                  <div className="auction-price-large">
                    {formatPrice(auction.prix_actuel)}
                  </div>
                  
                  <div className="auction-dates">
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>Désormais le {formatDate(auction.date_fin)}</span>
                    </div>
                    <div className="date-info">
                      <Clock size={14} />
                      <span>Moins d'1 heure</span>
                    </div>
                  </div>
                  
                  <div className="auction-stats-grid">
                    <div className="stat-box">
                      <span className="stat-value">{auction.enchères_reçues}</span>
                      <span className="stat-label">Enchères</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-value">{auction.vues}</span>
                      <span className="stat-label">Vues</span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-value">{auction.questions}</span>
                      <span className="stat-label">Questions</span>
                    </div>
                  </div>
                  
                  <div className="auction-actions-row">
                    {/* ✅ Bouton "Voir détails" avec navigation vers product-detail */}
                    <button 
                      className="btn-view-details"
                      onClick={() => onNavigate?.('product-detail', auction.id)}
                    >
                      Voir détails
                    </button>
                    <button className="btn-manage">
                      Gérer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Gavel size={48} className="empty-icon" />
            <h3>Vous n'avez pas encore d'enchères actives</h3>
            <p>Publiez un produit pour commencer à enchérir !</p>
            <button className="btn-create-auction" onClick={() => onNavigate?.('sell')}>
              Publier un produit
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Encheres;