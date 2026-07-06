// client/Vendus.js
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  FileText,
  Eye,
  Calendar,
  User,
  Gavel,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronRight,
  MoreVertical,
  AlertCircle,
  Package,
  Truck,
  DollarSign
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './Vendus.css';

const Vendus = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({
    total_vendus: 0,
    total_revenus: 0,
    moyenne_prix: 0,
    periode: 'Ce mois'
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
    fetchSoldProducts(token, user.id);
  }, [onNavigate]);

  const fetchSoldProducts = async (token, userId) => {
    setLoading(true);
    try {
      // Données simulées - À remplacer par votre API
      const mockProducts = [
        {
          id: 1,
          titre: 'Tapis Berbère Azilal Vintage',
          categorie: 'Tapis & Textiles',
          prix_vente: 10000,
          prix_depart: 5000,
          enchères_reçues: 24,
          vues: 156,
          date_vente: '2025-12-20T14:30:00',
          date_fin: '2025-12-20T14:30:00',
          image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400',
          acheteur: {
            nom: 'Karim Benali',
            email: 'karim.b@email.com',
            telephone: '+212 6 12 34 56 78',
            ville: 'Casablanca',
            note: 4.8,
            avis: 3
          },
          statut: 'livre',
          mode_paiement: 'Carte bancaire',
          reference: 'VEN-2025-001',
          frais: 500,
          commission: 1000,
          date_livraison: '2025-12-22',
          adresse_livraison: '123 Rue Mohamed V, Casablanca, Maroc'
        },
        {
          id: 2,
          titre: 'Vase en Céramique Fassi',
          categorie: 'Céramique & Poterie',
          prix_vente: 1850,
          prix_depart: 1200,
          enchères_reçues: 8,
          vues: 89,
          date_vente: '2025-12-15T16:45:00',
          date_fin: '2025-12-15T16:45:00',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
          acheteur: {
            nom: 'Nadia El Fassi',
            email: 'nadia.f@email.com',
            telephone: '+212 6 98 76 54 32',
            ville: 'Fès',
            note: 5.0,
            avis: 2
          },
          statut: 'livre',
          mode_paiement: 'PayPal',
          reference: 'VEN-2025-002',
          frais: 150,
          commission: 185,
          date_livraison: '2025-12-18',
          adresse_livraison: '45 Rue de la Paix, Fès, Maroc'
        },
        {
          id: 3,
          titre: 'Collier Berbère Argent Massif',
          categorie: 'Bijoux',
          prix_vente: 450,
          prix_depart: 300,
          enchères_reçues: 12,
          vues: 234,
          date_vente: '2025-12-10T12:00:00',
          date_fin: '2025-12-10T12:00:00',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
          acheteur: {
            nom: 'Youssef Maaroufi',
            email: 'youssef.m@email.com',
            telephone: '+212 6 45 67 89 01',
            ville: 'Marrakech',
            note: 4.5,
            avis: 1
          },
          statut: 'livre',
          mode_paiement: 'Virement',
          reference: 'VEN-2025-003',
          frais: 50,
          commission: 45,
          date_livraison: '2025-12-13',
          adresse_livraison: '78 Rue de la Kasbah, Marrakech, Maroc'
        },
        {
          id: 4,
          titre: 'Lampe Marocaine en Cuivre',
          categorie: 'Décoration',
          prix_vente: 3500,
          prix_depart: 2000,
          enchères_reçues: 15,
          vues: 312,
          date_vente: '2025-12-05T18:00:00',
          date_fin: '2025-12-05T18:00:00',
          image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400',
          acheteur: {
            nom: 'Sophie Laurent',
            email: 'sophie.l@email.com',
            telephone: '+212 6 23 45 67 89',
            ville: 'Rabat',
            note: 4.9,
            avis: 4
          },
          statut: 'en_cours',
          mode_paiement: 'Carte bancaire',
          reference: 'VEN-2025-004',
          frais: 200,
          commission: 350,
          date_livraison: '2025-12-08',
          adresse_livraison: '12 Avenue Hassan II, Rabat, Maroc'
        }
      ];

      setProducts(mockProducts);
      
      const total = mockProducts.reduce((sum, p) => sum + p.prix_vente, 0);
      setStats({
        total_vendus: mockProducts.length,
        total_revenus: total,
        moyenne_prix: Math.round(total / mockProducts.length),
        periode: 'Tous les temps'
      });
      
    } catch (error) {
      console.error('Erreur chargement produits vendus:', error);
    } finally {
      setLoading(false);
    }
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
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (statut) => {
    const statuses = {
      'livre': { label: 'Livré', className: 'status-livre' },
      'en_cours': { label: 'En cours de livraison', className: 'status-en-cours' },
      'en_attente': { label: 'En attente', className: 'status-attente' }
    };
    return statuses[statut] || statuses['en_cours'];
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.acheteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par période
    if (filterPeriod !== 'all') {
      const now = new Date();
      const periodMap = {
        'semaine': 7,
        'mois': 30,
        'trimestre': 90
      };
      const days = periodMap[filterPeriod];
      if (days) {
        const cutoff = new Date(now.setDate(now.getDate() - days));
        filtered = filtered.filter(p => new Date(p.date_vente) >= cutoff);
      }
    }
    
    return filtered;
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = getFilteredProducts();

  // Render du modal de détails
  const renderDetailsModal = () => {
    if (!selectedProduct) return null;
    const p = selectedProduct;
    const status = getStatusBadge(p.statut);

    return (
      <div className="modal-overlay" onClick={handleCloseDetails}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Détails de la vente</h2>
            <button className="modal-close" onClick={handleCloseDetails}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="modal-product-info">
              <img src={p.image} alt={p.titre} className="modal-product-image" />
              <div>
                <h3>{p.titre}</h3>
                <span className="modal-category">{p.categorie}</span>
                <p className="modal-reference">Référence : {p.reference}</p>
              </div>
            </div>

            <div className="modal-details-grid">
              <div className="detail-item">
                <DollarSign size={16} />
                <span>Prix de vente : <strong>{formatPrice(p.prix_vente)}</strong></span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Date : {formatDate(p.date_vente)}</span>
              </div>
              <div className="detail-item">
                <span className={`status-badge ${status.className}`}>{status.label}</span>
              </div>
              <div className="detail-item">
                <Gavel size={16} />
                <span>{p.enchères_reçues} enchères</span>
              </div>
            </div>

            <div className="modal-section">
              <h4>Acheteur</h4>
              <div className="acheteur-info">
                <div className="acheteur-detail">
                  <User size={14} />
                  <span>{p.acheteur.nom}</span>
                </div>
                <div className="acheteur-detail">
                  <Mail size={14} />
                  <span>{p.acheteur.email}</span>
                </div>
                <div className="acheteur-detail">
                  <Phone size={14} />
                  <span>{p.acheteur.telephone}</span>
                </div>
                <div className="acheteur-detail">
                  <MapPin size={14} />
                  <span>{p.acheteur.ville}</span>
                </div>
                <div className="acheteur-detail">
                  <Star size={14} />
                  <span>{p.acheteur.note} ({p.acheteur.avis} avis)</span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h4>Livraison</h4>
              <div className="livraison-info">
                <div className="livraison-detail">
                  <Truck size={14} />
                  <span>Adresse : {p.adresse_livraison}</span>
                </div>
                <div className="livraison-detail">
                  <Calendar size={14} />
                  <span>Livré le : {formatDate(p.date_livraison)}</span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h4>Résumé financier</h4>
              <div className="finance-info">
                <div className="finance-item">
                  <span>Prix de vente</span>
                  <span>{formatPrice(p.prix_vente)}</span>
                </div>
                <div className="finance-item">
                  <span>Commission ({Math.round((p.commission / p.prix_vente) * 100)}%)</span>
                  <span>- {formatPrice(p.commission)}</span>
                </div>
                <div className="finance-item">
                  <span>Frais de traitement</span>
                  <span>- {formatPrice(p.frais)}</span>
                </div>
                <div className="finance-item total">
                  <span>Total perçu</span>
                  <span>{formatPrice(p.prix_vente - p.commission - p.frais)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-download">
                <Download size={16} />
                Télécharger la facture
              </button>
              <button className="btn-contact">
                <Mail size={16} />
                Contacter l'acheteur
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vendus-page">
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
                <CheckCircle size={16} />
                <span className="stat-number">{stats.total_vendus}</span>
                <span className="stat-label">produits vendus</span>
              </div>
              <div className="stat-item">
                <DollarSign size={16} />
                <span className="stat-number">{formatPrice(stats.total_revenus)}</span>
                <span className="stat-label">revenus totaux</span>
              </div>
              <div className="stat-item">
                <TrendingUp size={16} />
                <span className="stat-number">{formatPrice(stats.moyenne_prix)}</span>
                <span className="stat-label">prix moyen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit vendu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select 
            className="filter-select"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">Toutes les périodes</option>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="trimestre">Ce trimestre</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <section className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des produits vendus...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const status = getStatusBadge(product.statut);
              return (
                <div className="product-card" key={product.id}>
                  <div className="product-card-image">
                    <img src={product.image} alt={product.titre} />
                    <span className={`product-status ${status.className}`}>
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
                    <div className="product-price">{formatPrice(product.prix_vente)}</div>

                    <div className="product-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>Vendu le {formatDate(product.date_vente)}</span>
                      </div>
                      <div className="meta-item">
                        <User size={14} />
                        <span>{product.acheteur.nom}</span>
                      </div>
                      <div className="meta-item">
                        <Gavel size={14} />
                        <span>{product.enchères_reçues} enchères</span>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button 
                        className="btn-view-details"
                        onClick={() => handleViewDetails(product)}
                      >
                        Voir détails
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle size={48} className="empty-icon" />
            <h3>Aucun produit vendu</h3>
            <p>Les produits que vous vendez apparaîtront ici.</p>
            <button className="btn-create-product" onClick={() => onNavigate?.('sell')}>
              Publier un produit
            </button>
          </div>
        )}
      </section>

      {/* Modal Détails */}
      {renderDetailsModal()}
    </div>
  );
};

export default Vendus;