import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Heart,
  FileText,
  CheckCircle,
  Clock,
  Trophy,
  Camera,
  Settings
} from 'lucide-react';
import { encryptData, decryptData } from '././../utils/crypto';
import '../assets/css/client/ProfilePage.css';

const ProfilePage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('favoris');
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

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

    fetch('http://localhost:5000/api/auth/client/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClient(data.client);
          localStorage.setItem('user', encryptData(data.client));
        }
        setLoading(false);
      })
      .catch(() => {
        setClient(user);
        setLoading(false);
      });
  }, [onNavigate]);

  const tabs = [
    { id: 'encheres', label: 'Mes Enchères', icon: <Gavel size={18} strokeWidth={2} /> },
    { id: 'favoris', label: 'Favoris', icon: <Heart size={18} strokeWidth={2} /> },
    { id: 'publies', label: 'Publiés', icon: <FileText size={18} strokeWidth={2} /> },
    { id: 'vendus', label: 'Vendus', icon: <CheckCircle size={18} strokeWidth={2} /> },
    { id: 'attente', label: 'En Attente', icon: <Clock size={18} strokeWidth={2} /> },
    { id: 'gagnes', label: 'Gagnés', icon: <Trophy size={18} strokeWidth={2} /> },
  ];

  const stats = [
    { label: 'enchères actives', value: client?.enchères_actives || 0, icon: <Gavel size={20} strokeWidth={2} /> },
    { label: 'produits publiés', value: client?.produits_publiés || 0, icon: <FileText size={20} strokeWidth={2} /> },
    { label: 'produits vendus', value: client?.produits_vendus || 0, icon: <CheckCircle size={20} strokeWidth={2} /> },
  ];

  const favoris = [
    { id: 1, title: 'Collier Berbère Argent', price: '450 MAD', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300', bids: 8, timeLeft: '2j 5h' },
    { id: 2, title: 'Tapis Azilal Petit', price: '1,200 MAD', image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=300', bids: 12, timeLeft: '5j 12h' },
  ];

  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!client) return null;

  const memberSince = new Date(client.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="profile-page">
      <section className="profile-header-section">
        <div className="profile-header-bg"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            <img 
              src={client.photo_profil ? `http://localhost:5000${client.photo_profil}` : 'https://i.pravatar.cc/150?img=5'} 
              alt={client.nom}
            />
            <button className="btn-edit-photo" title="Modifier la photo">
              <Camera size={16} strokeWidth={2} />
            </button>
          </div>
          
          <div className="profile-info">
            <h1>{client.prenom} {client.nom}</h1>
            <p className="member-since">Membre depuis {memberSince}</p>
            
            <div className="profile-stats-row">
              {stats.map((stat, index) => (
                <div className="profile-stat" key={index}>
                  <span className="stat-icon">{stat.icon}</span>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-parametres" onClick={() => onNavigate?.('profile-settings')}>
            <Settings size={16} strokeWidth={2} />
            <span>Paramètres</span>
          </button>
        </div>
      </section>

      <section className="tabs-section">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="content-container">
          {activeTab === 'favoris' && (
            <div className="favoris-grid">
              <h2 className="section-title">Mes Favoris</h2>
              {favoris.length > 0 ? (
                <div className="products-grid">
                  {favoris.map((item) => (
                    <div className="product-card" key={item.id}>
                      <div className="product-image">
                        <img src={item.image} alt={item.title} />
                        <button className="btn-favori active">
                          <Heart size={16} strokeWidth={2} fill="currentColor" />
                        </button>
                        <span className="product-badge">Favori</span>
                      </div>
                      <div className="product-info">
                        <h3>{item.title}</h3>
                        <p className="product-desc">Description du produit artisanal marocain authentique.</p>
                        <div className="product-meta">
                          <div className="meta-item">
                            <span className="meta-label">Prix</span>
                            <span className="meta-value">{item.price}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Intérêts</span>
                            <span className="meta-value">{item.bids}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">État</span>
                            <span className="meta-value status-publié">Publié</span>
                          </div>
                        </div>
                        <button className="btn-voir-details" onClick={() => onNavigate?.('product-detail', item.id)}>
                          Voir détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Heart size={48} strokeWidth={1.5} className="empty-icon" />
                  <p>Vous n'avez pas encore de favoris</p>
                  <button className="btn-explore" onClick={() => onNavigate?.('home')}>
                    Explorer les enchères
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'encheres' && (
            <div className="empty-state">
              <Gavel size={48} strokeWidth={1.5} className="empty-icon" />
              <p>Vous n'avez pas encore d'enchères actives</p>
              <button className="btn-explore" onClick={() => onNavigate?.('home')}>
                Commencer à enchérir
              </button>
            </div>
          )}

          {activeTab === 'publies' && (
            <div className="empty-state">
              <FileText size={48} strokeWidth={1.5} className="empty-icon" />
              <p>Vous n'avez pas encore publié de produits</p>
              <button className="btn-explore" onClick={() => onNavigate?.('sell')}>
                Vendre un produit
              </button>
            </div>
          )}

          {activeTab === 'vendus' && (
            <div className="empty-state">
              <CheckCircle size={48} strokeWidth={1.5} className="empty-icon" />
              <p>Aucun produit vendu pour le moment</p>
            </div>
          )}

          {activeTab === 'attente' && (
            <div className="empty-state">
              <Clock size={48} strokeWidth={1.5} className="empty-icon" />
              <p>Aucun produit en attente</p>
            </div>
          )}

          {activeTab === 'gagnes' && (
            <div className="empty-state">
              <Trophy size={48} strokeWidth={1.5} className="empty-icon" />
              <p>Vous n'avez pas encore remporté d'enchères</p>
              <button className="btn-explore" onClick={() => onNavigate?.('home')}>
                Explorer les enchères
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;