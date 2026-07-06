// client/Publies.js
import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  User,
  Gavel,
  TrendingUp,
  Tag,
  Package,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
  PlusCircle,
  Heart,
  Award,
  ShoppingBag
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './Publies.css';

const Publies = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState({
    publies: 0,
    en_attente: 0,
    vendus: 0,
    encheres: 0
  });
  const [filter, setFilter] = useState('publies');

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
    fetchProductsData(token, user.id);
  }, [onNavigate]);

  const fetchProductsData = async (token, userId) => {
    setLoading(true);
    try {
      // Données simulées - À remplacer par votre API
      const mockProducts = [
        {
          id: 1,
          titre: 'Tapis Berbère Azilal Vintage',
          categorie: 'Tapis & Textiles',
          prix: 1311,
          prix_depart: 5000,
          prix_actuel: 10000,
          statut: 'enchere',
          date_validation: '2025-12-17',
          date_creation: '2025-12-01',
          image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400',
          vues: 156,
          enchères: 24,
          description: 'Magnifique tapis berbère fait main...',
          offre_actuelle: 'Karim B.',
          temps_restant: '2j 14h',
          expert: 'Admin',
          validation: true,
          est_publie: true,
          est_en_attente: false
        },
        {
          id: 2,
          titre: 'Vase en Céramique Fassi',
          categorie: 'Céramique & Poterie',
          prix: 850,
          prix_depart: 1200,
          prix_actuel: 1850,
          statut: 'en_attente',
          date_validation: null,
          date_creation: '2025-12-15',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
          vues: 89,
          enchères: 0,
          description: 'Vase en céramique émaillée...',
          offre_actuelle: null,
          temps_restant: null,
          expert: null,
          validation: false,
          est_publie: false,
          est_en_attente: true
        },
        {
          id: 3,
          titre: 'Collier Berbère Argent Massif',
          categorie: 'Bijoux',
          prix: 1200,
          prix_depart: 300,
          prix_actuel: 450,
          statut: 'vendu',
          date_validation: '2025-12-10',
          date_creation: '2025-11-20',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
          vues: 234,
          enchères: 18,
          description: 'Collier en argent massif...',
          offre_actuelle: 'Nadia F.',
          temps_restant: null,
          expert: 'Admin',
          validation: true,
          est_publie: true,
          est_en_attente: false,
          acheteur: 'Sophie L.',
          date_vente: '2025-12-20'
        }
      ];

      setProducts(mockProducts);
      setStats({
        publies: mockProducts.filter(p => p.statut === 'enchere' || p.statut === 'vendu').length,
        en_attente: mockProducts.filter(p => p.statut === 'en_attente').length,
        vendus: mockProducts.filter(p => p.statut === 'vendu').length,
        encheres: mockProducts.filter(p => p.statut === 'enchere').length
      });
      
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    if (filter === 'publies') return products.filter(p => p.statut === 'enchere' || p.statut === 'vendu');
    if (filter === 'en_attente') return products.filter(p => p.statut === 'en_attente');
    if (filter === 'vendus') return products.filter(p => p.statut === 'vendu');
    if (filter === 'enchere') return products.filter(p => p.statut === 'enchere');
    if (filter === 'favoris') return products.filter(p => p.favoris);
    if (filter === 'gagnes') return products.filter(p => p.gagne);
    return products;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'enchere': { label: 'En enchère', className: 'status-enchere', icon: <Gavel size={14} /> },
      'en_attente': { label: 'En attente', className: 'status-attente', icon: <Clock size={14} /> },
      'vendu': { label: 'Vendu', className: 'status-vendu', icon: <CheckCircle size={14} /> }
    };
    return badges[statut] || badges['en_attente'];
  };

  const handleAddProduct = () => {
    onNavigate?.('sell');
  };

  const renderProductCard = (product) => {
    const status = getStatusBadge(product.statut);

    return (
      <div className="product-card" key={product.id}>
        <div className="product-card-image">
          <img src={product.image} alt={product.titre} />
          <span className={`product-status ${status.className}`}>
            {status.icon}
            {status.label}
          </span>
        </div>

        <div className="product-card-content">
          <div className="product-header">
            <h3 className="product-title">{product.titre}</h3>
            <button className="btn-more-options">
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="product-category">{product.categorie}</div>

          <div className="product-price">
            {product.statut === 'vendu' ? (
              <span className="price-sold">{formatPrice(product.prix)}</span>
            ) : (
              <span className="price-current">{formatPrice(product.prix)}</span>
            )}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <Calendar size={14} />
              <span>
                {product.statut === 'en_attente' 
                  ? `Créé le ${formatDate(product.date_creation)}`
                  : `Validé le ${formatDate(product.date_validation)}`
                }
              </span>
            </div>
            {product.statut === 'enchere' && (
              <>
                <div className="meta-item">
                  <Eye size={14} />
                  <span>{product.vues} vues</span>
                </div>
                <div className="meta-item">
                  <Gavel size={14} />
                  <span>{product.enchères} enchères</span>
                </div>
              </>
            )}
            {product.statut === 'vendu' && (
              <div className="meta-item">
                <User size={14} />
                <span>Vendu à {product.acheteur}</span>
              </div>
            )}
          </div>

          {product.statut === 'enchere' && product.temps_restant && (
            <div className="product-timer">
              <Clock size={14} />
              <span>Temps restant : <strong>{product.temps_restant}</strong></span>
            </div>
          )}

          {product.statut === 'en_attente' && (
            <div className="product-waiting-message">
              <AlertCircle size={14} />
              <span>En cours de validation par l'administrateur</span>
            </div>
          )}

          <div className="product-actions">
            <button 
              className="btn-view"
              onClick={() => onNavigate?.('product-detail', product.id)}
            >
              Voir détails
              <ChevronRight size={16} />
            </button>
            {product.statut === 'en_attente' && (
              <button className="btn-edit">
                <Edit size={16} />
                Modifier
              </button>
            )}
            {product.statut === 'enchere' && (
              <button className="btn-manage">
                <Gavel size={16} />
                Gérer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="publies-page">
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
              Membre depuis {client?.created_at ? formatDate(client.created_at) : 'Juillet 2026'}
            </p>
            
            <div className="vendeur-stats">
              <div className="stat-item">
                <Gavel size={16} />
                <span className="stat-number">{stats.encheres}</span>
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

      {/* Navigation Tabs */}
      <section className="tabs-section">
        <div className="tabs-container">
          <button 
            className={`tab-btn ${filter === 'enchere' ? 'active' : ''}`}
            onClick={() => setFilter('enchere')}
          >
            <Gavel size={16} />
            Mes Enchères
          </button>
          <button 
            className={`tab-btn ${filter === 'favoris' ? 'active' : ''}`}
            onClick={() => setFilter('favoris')}
          >
            <Heart size={16} />
            Favoris
          </button>
          <button 
            className={`tab-btn ${filter === 'publies' ? 'active' : ''}`}
            onClick={() => setFilter('publies')}
          >
            <FileText size={16} />
            Publies
          </button>
          <button 
            className={`tab-btn ${filter === 'vendus' ? 'active' : ''}`}
            onClick={() => setFilter('vendus')}
          >
            <ShoppingBag size={16} />
            Vendus
          </button>
          <button 
            className={`tab-btn ${filter === 'en_attente' ? 'active' : ''}`}
            onClick={() => setFilter('en_attente')}
          >
            <Clock size={16} />
            En attente
          </button>
          <button 
            className={`tab-btn ${filter === 'gagnes' ? 'active' : ''}`}
            onClick={() => setFilter('gagnes')}
          >
            <Award size={16} />
            Gagnés
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement de vos produits...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => renderProductCard(product))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <Package size={64} className="empty-icon" />
            </div>
            <h3>Vous n'avez pas encore publié de produits</h3>
            <p>Commencez à vendre vos produits artisanaux en les publiant sur Bazart.</p>
            <button className="btn-sell-product" onClick={handleAddProduct}>
              <PlusCircle size={20} />
              Vendre un produit
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Publies;