// client/Gagnes.js
import React, { useState, useEffect } from 'react';
import {
  Trophy,
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
  DollarSign,
  Award,
  ThumbsUp
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './Gagnes.css';

const Gagnes = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({
    total_gagnes: 0,
    total_depenses: 0,
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
    fetchWonProducts(token, user.id);
  }, [onNavigate]);

  const fetchWonProducts = async (token, userId) => {
    setLoading(true);
    try {
      // Données simulées - À remplacer par votre API
      const mockProducts = [
        {
          id: 1,
          titre: 'Tapis Boucherouite Multicolore',
          categorie: 'Tapis & Textiles',
          prix_gagne: 1800,
          prix_depart: 1000,
          enchères_placées: 12,
          vues: 89,
          date_gagne: '2025-12-22T16:30:00',
          date_fin: '2025-12-22T16:30:00',
          image: 'https://images.unsplash.com/photo-1611461665705-cb05d58fd577?w=400',
          vendeur: {
            nom: 'Fatima Zahra',
            email: 'fatima.z@email.com',
            telephone: '+212 6 78 90 12 34',
            ville: 'Marrakech',
            note: 4.7,
            avis: 8
          },
          statut: 'livre',
          mode_paiement: 'Carte bancaire',
          reference: 'ACH-2025-001',
          frais_livraison: 150,
          date_livraison: '2025-12-24',
          adresse_livraison: '123 Rue Mohamed V, Casablanca, Maroc',
          temps_restant: 'Livré'
        },
        {
          id: 2,
          titre: 'Poterie Tamegroute Verte',
          categorie: 'Céramique & Poterie',
          prix_gagne: 950,
          prix_depart: 600,
          enchères_placées: 8,
          vues: 156,
          date_gagne: '2025-12-20T14:15:00',
          date_fin: '2025-12-20T14:15:00',
          image: 'https://images.unsplash.com/photo-1543253283-32c4fde1c6a4?w=400',
          vendeur: {
            nom: 'Mohamed Chraibi',
            email: 'mohamed.c@email.com',
            telephone: '+212 6 34 56 78 90',
            ville: 'Tamegroute',
            note: 4.9,
            avis: 12
          },
          statut: 'en_attente',
          mode_paiement: 'PayPal',
          reference: 'ACH-2025-002',
          frais_livraison: 80,
          date_livraison: '2025-12-27',
          adresse_livraison: '45 Rue de la Paix, Fès, Maroc',
          temps_restant: 'En préparation'
        },
        {
          id: 3,
          titre: 'Bracelet en Argent Berbère',
          categorie: 'Bijoux',
          prix_gagne: 650,
          prix_depart: 400,
          enchères_placées: 6,
          vues: 234,
          date_gagne: '2025-12-18T19:00:00',
          date_fin: '2025-12-18T19:00:00',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
          vendeur: {
            nom: 'Nadia El Mansouri',
            email: 'nadia.m@email.com',
            telephone: '+212 6 12 34 56 78',
            ville: 'Agadir',
            note: 4.6,
            avis: 6
          },
          statut: 'livre',
          mode_paiement: 'Virement',
          reference: 'ACH-2025-003',
          frais_livraison: 50,
          date_livraison: '2025-12-21',
          adresse_livraison: '78 Rue de la Kasbah, Marrakech, Maroc',
          temps_restant: 'Livré'
        },
        {
          id: 4,
          titre: 'Tableau Art Moderne Contemporain',
          categorie: 'Art',
          prix_gagne: 3200,
          prix_depart: 2000,
          enchères_placées: 18,
          vues: 412,
          date_gagne: '2025-12-15T20:30:00',
          date_fin: '2025-12-15T20:30:00',
          image: 'https://images.unsplash.com/photo-1536924940843-1a508bad2cbe?w=400',
          vendeur: {
            nom: 'Sophie Laurent',
            email: 'sophie.l@email.com',
            telephone: '+212 6 23 45 67 89',
            ville: 'Rabat',
            note: 4.8,
            avis: 15
          },
          statut: 'en_attente',
          mode_paiement: 'Carte bancaire',
          reference: 'ACH-2025-004',
          frais_livraison: 200,
          date_livraison: '2025-12-28',
          adresse_livraison: '12 Avenue Hassan II, Rabat, Maroc',
          temps_restant: 'En préparation'
        }
      ];

      setProducts(mockProducts);
      
      const total = mockProducts.reduce((sum, p) => sum + p.prix_gagne, 0);
      setStats({
        total_gagnes: mockProducts.length,
        total_depenses: total,
        moyenne_prix: Math.round(total / mockProducts.length),
        periode: 'Tous les temps'
      });
      
    } catch (error) {
      console.error('Erreur chargement produits gagnés:', error);
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
      'en_attente': { label: 'En préparation', className: 'status-en-attente' },
      'en_cours': { label: 'En cours de livraison', className: 'status-en-cours' }
    };
    return statuses[statut] || statuses['en_attente'];
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
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
        filtered = filtered.filter(p => new Date(p.date_gagne) >= cutoff);
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
            <h2>
              <Trophy size={20} />
              Détails de l'achat
            </h2>
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
                <span>Prix gagné : <strong>{formatPrice(p.prix_gagne)}</strong></span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Date : {formatDate(p.date_gagne)}</span>
              </div>
              <div className="detail-item">
                <span className={`status-badge ${status.className}`}>{status.label}</span>
              </div>
              <div className="detail-item">
                <Gavel size={16} />
                <span>{p.enchères_placées} enchères placées</span>
              </div>
            </div>

            <div className="modal-section">
              <h4>Vendeur</h4>
              <div className="vendeur-info">
                <div className="vendeur-detail">
                  <User size={14} />
                  <span>{p.vendeur.nom}</span>
                </div>
                <div className="vendeur-detail">
                  <Mail size={14} />
                  <span>{p.vendeur.email}</span>
                </div>
                <div className="vendeur-detail">
                  <Phone size={14} />
                  <span>{p.vendeur.telephone}</span>
                </div>
                <div className="vendeur-detail">
                  <MapPin size={14} />
                  <span>{p.vendeur.ville}</span>
                </div>
                <div className="vendeur-detail">
                  <Star size={14} />
                  <span>{p.vendeur.note} ({p.vendeur.avis} avis)</span>
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
                <div className="livraison-detail">
                  <Package size={14} />
                  <span>Statut : {p.temps_restant}</span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h4>Résumé financier</h4>
              <div className="finance-info">
                <div className="finance-item">
                  <span>Prix d'achat</span>
                  <span>{formatPrice(p.prix_gagne)}</span>
                </div>
                <div className="finance-item">
                  <span>Frais de livraison</span>
                  <span>+ {formatPrice(p.frais_livraison)}</span>
                </div>
                <div className="finance-item total">
                  <span>Total payé</span>
                  <span>{formatPrice(p.prix_gagne + p.frais_livraison)}</span>
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
                Contacter le vendeur
              </button>
              <button className="btn-rate">
                <ThumbsUp size={16} />
                Donner un avis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="gagnes-page">
      {/* Header */}
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
                <Trophy size={16} />
                <span className="stat-number">{stats.total_gagnes}</span>
                <span className="stat-label">enchères gagnées</span>
              </div>
              <div className="stat-item">
                <DollarSign size={16} />
                <span className="stat-number">{formatPrice(stats.total_depenses)}</span>
                <span className="stat-label">dépenses totales</span>
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
            placeholder="Rechercher un produit gagné..."
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
            <p>Chargement des produits gagnés...</p>
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
                      <Trophy size={12} />
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
                    <div className="product-price">{formatPrice(product.prix_gagne)}</div>

                    <div className="product-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>Gagné le {formatDate(product.date_gagne)}</span>
                      </div>
                      <div className="meta-item">
                        <User size={14} />
                        <span>{product.vendeur.nom}</span>
                      </div>
                      <div className="meta-item">
                        <Gavel size={14} />
                        <span>{product.enchères_placées} enchères</span>
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
            <Trophy size={48} className="empty-icon" />
            <h3>Aucune enchère gagnée</h3>
            <p>Les enchères que vous remportez apparaîtront ici.</p>
            <button className="btn-create-product" onClick={() => onNavigate?.('auctions')}>
              Explorer les enchères
            </button>
          </div>
        )}
      </section>

      {renderDetailsModal()}
    </div>
  );
};

export default Gagnes;