// client/EnAttente.js
import React, { useState, useEffect } from 'react';
import {
  Clock,
  FileText,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Calendar,
  AlertCircle,
  User,
  Gavel,
  Loader,
  ChevronRight,
  MoreVertical,
  Send,
  X
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './EnAttente.css';

const EnAttente = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [stats, setStats] = useState({
    en_attente: 0,
    en_cours: 0,
    en_revision: 0
  });
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

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
    fetchPendingProducts(token, user.id);
  }, [onNavigate]);

  const fetchPendingProducts = async (token, userId) => {
    setLoading(true);
    try {
      // Données simulées - À remplacer par votre API
      const mockProducts = [
        {
          id: 1,
          titre: 'Imane Monte',
          categorie: '3 Mesures Financière Débatif Kéros Lesbiques',
          prix: 500,
          description: 'Produit en attente de validation par l\'administrateur. Expertise en cours.',
          date_creation: '2025-12-24',
          date_soumission: '2025-12-20',
          image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400',
          statut: 'en_cours', // en_cours, en_revision, valide, rejete
          expert: 'Admin',
          etape: 2, // 1: Soumis, 2: En cours d'expertise, 3: Révision finale
          commentaires: [
            { 
              id: 1, 
              auteur: 'Admin', 
              message: 'Produit reçu, en cours d\'analyse', 
              date: '2025-12-20 14:30',
              type: 'info'
            },
            {
              id: 2,
              auteur: 'Expert',
              message: 'Vérification des caractéristiques en cours',
              date: '2025-12-21 10:15',
              type: 'info'
            }
          ],
          modifications_autorisees: true,
          temps_estime: '24-48 heures',
          priorite: 'normale'
        },
        {
          id: 2,
          titre: 'Tapis Berbère Azilal',
          categorie: 'Tapis & Textiles',
          prix: 1500,
          description: 'Tapis authentique en attente de validation. Documents fournis.',
          date_creation: '2025-12-22',
          date_soumission: '2025-12-18',
          image: 'https://images.unsplash.com/photo-1611461665705-cb05d58fd577?w=400',
          statut: 'en_revision',
          expert: 'Expert Tapis',
          etape: 3,
          commentaires: [
            {
              id: 1,
              auteur: 'Admin',
              message: 'Produit soumis avec succès',
              date: '2025-12-18 09:00',
              type: 'info'
            },
            {
              id: 2,
              auteur: 'Expert',
              message: 'Expertise terminée, en attente de validation finale',
              date: '2025-12-22 16:45',
              type: 'success'
            }
          ],
          modifications_autorisees: false,
          temps_estime: '12-24 heures',
          priorite: 'elevee'
        },
        {
          id: 3,
          titre: 'Vase en Céramique Fassi',
          categorie: 'Céramique & Poterie',
          prix: 850,
          description: 'Vase en céramique émaillée, en attente de validation.',
          date_creation: '2025-12-23',
          date_soumission: '2025-12-19',
          image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
          statut: 'en_cours',
          expert: 'Expert Céramique',
          etape: 2,
          commentaires: [
            {
              id: 1,
              auteur: 'Admin',
              message: 'Produit reçu, en attente d\'expertise',
              date: '2025-12-19 11:30',
              type: 'info'
            }
          ],
          modifications_autorisees: true,
          temps_estime: '48-72 heures',
          priorite: 'basse'
        }
      ];

      setProducts(mockProducts);
      setStats({
        en_attente: mockProducts.length,
        en_cours: mockProducts.filter(p => p.statut === 'en_cours').length,
        en_revision: mockProducts.filter(p => p.statut === 'en_revision').length
      });
      
    } catch (error) {
      console.error('Erreur chargement produits en attente:', error);
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
      year: 'numeric'
    });
  };

  const getStatusBadge = (statut, etape) => {
    const statuses = {
      'en_cours': { 
        label: 'En cours d\'expertise', 
        className: 'status-en-cours',
        icon: <Loader size={14} className="spin" />
      },
      'en_revision': { 
        label: 'En révision', 
        className: 'status-en-revision',
        icon: <Clock size={14} />
      },
      'valide': { 
        label: 'Validé', 
        className: 'status-valide',
        icon: <CheckCircle size={14} />
      },
      'rejete': { 
        label: 'Rejeté', 
        className: 'status-rejete',
        icon: <X size={14} />
      }
    };
    return statuses[statut] || statuses['en_cours'];
  };

  const getEtapeProgress = (etape) => {
    const total = 3;
    const progress = (etape / total) * 100;
    return progress;
  };

  const getEtapeLabel = (etape) => {
    const labels = {
      1: 'Soumis',
      2: 'En cours d\'expertise',
      3: 'Révision finale'
    };
    return labels[etape] || 'En cours';
  };

  const handleToggleExpand = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Logique pour ouvrir le formulaire de modification
    alert(`Modification du produit: ${product.titre}`);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId));
      alert('Produit supprimé avec succès');
    }
  };

  const handleResubmit = (productId) => {
    alert('Produit renvoyé pour révision');
  };

  const renderProductCard = (product) => {
    const status = getStatusBadge(product.statut, product.etape);
    const isExpanded = expandedProduct === product.id;

    return (
      <div className={`pending-card ${isExpanded ? 'expanded' : ''}`} key={product.id}>
        <div className="pending-card-header" onClick={() => handleToggleExpand(product.id)}>
          <div className="pending-card-image">
            <img src={product.image} alt={product.titre} />
          </div>
          
          <div className="pending-card-info">
            <div className="product-title-row">
              <h3 className="product-title">{product.titre}</h3>
              <span className={`status-badge ${status.className}`}>
                {status.icon}
                {status.label}
              </span>
            </div>
            
            <div className="product-category">{product.categorie}</div>
            
            <div className="product-price">{formatPrice(product.prix)}</div>
            
            <div className="product-meta">
              <div className="meta-item">
                <Calendar size={14} />
                <span>Soumis le {formatDate(product.date_soumission)}</span>
              </div>
              <div className="meta-item">
                <Clock size={14} />
                <span>Délai estimé : {product.temps_estime}</span>
              </div>
            </div>
          </div>

          <div className="pending-card-actions">
            <button 
              className="btn-expand"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleExpand(product.id);
              }}
            >
              {isExpanded ? 'Réduire' : 'Détails'}
              <ChevronRight size={16} className={isExpanded ? 'rotated' : ''} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="pending-card-details">
            {/* Progression */}
            <div className="progress-section">
              <div className="progress-header">
                <span>Progression de l'expertise</span>
                <span className="progress-step">{getEtapeLabel(product.etape)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getEtapeProgress(product.etape)}%` }}
                ></div>
              </div>
              <div className="progress-steps">
                <span className={product.etape >= 1 ? 'completed' : ''}>Soumis</span>
                <span className={product.etape >= 2 ? 'completed' : ''}>Expertise</span>
                <span className={product.etape >= 3 ? 'completed' : ''}>Validation</span>
              </div>
            </div>

            {/* Commentaires */}
            <div className="comments-section">
              <h4>Historique de traitement</h4>
              {product.commentaires.map((comment) => (
                <div className={`comment-item ${comment.type}`} key={comment.id}>
                  <div className="comment-header">
                    <span className="comment-author">{comment.auteur}</span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <p className="comment-message">{comment.message}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="details-actions">
              {product.modifications_autorisees && (
                <button className="btn-edit" onClick={() => handleEdit(product)}>
                  <Edit size={16} />
                  Modifier le produit
                </button>
              )}
              <button 
                className="btn-view"
                onClick={() => onNavigate?.('product-detail', product.id)}
              >
                <Eye size={16} />
                Voir le produit
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 size={16} />
                Supprimer
              </button>
              {product.statut === 'en_revision' && (
                <button 
                  className="btn-resubmit"
                  onClick={() => handleResubmit(product.id)}
                >
                  <Send size={16} />
                  Renvoyer pour révision
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="en-attente-page">
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
                <span className="stat-number">{stats.en_attente}</span>
                <span className="stat-label">produits en attente</span>
              </div>
              <div className="stat-item">
                <Loader size={16} className="spin" />
                <span className="stat-number">{stats.en_cours}</span>
                <span className="stat-label">en cours</span>
              </div>
              <div className="stat-item">
                <Clock size={16} />
                <span className="stat-number">{stats.en_revision}</span>
                <span className="stat-label">en révision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info banner */}
      <div className="info-banner">
        <AlertCircle size={18} />
        <span>
          {stats.en_attente} produit(s) en attente de validation. 
          {stats.en_cours > 0 && ` ${stats.en_cours} en cours d'expertise.`}
          {stats.en_revision > 0 && ` ${stats.en_revision} en révision finale.`}
        </span>
      </div>

      {/* Content */}
      <section className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des produits en attente...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="pending-list">
            {products.map(product => renderProductCard(product))}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle size={48} className="empty-icon" />
            <h3>Aucun produit en attente</h3>
            <p>Tous vos produits ont été traités ou validés.</p>
            <button className="btn-create-product" onClick={() => onNavigate?.('sell')}>
              Publier un nouveau produit
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default EnAttente;