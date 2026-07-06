// client/VoirDetails.js
import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Clock,
  Eye,
  MessageCircle,
  Gavel,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Flame,
  TrendingUp,
  Award,
  Shield,
  Truck,
  Star,
  StarHalf
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './VoirDetails.css';

const VoirDetails = ({ onNavigate, productId }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [client, setClient] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [activeTab, setActiveTab] = useState('description');

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
    fetchProductData(productId || 1);
  }, [onNavigate, productId]);

  const fetchProductData = async (id) => {
    setLoading(true);
    try {
      // Données simulées - À remplacer par votre API
      const productData = {
        id: id || 1,
        titre: 'Tapis Berbère Azilal Vintage 1980',
        categorie: 'Tapis & Textiles',
        sous_categorie: 'Tapis Berbère',
        description: `Magnifique tapis berbère fait main, authentique pièce d'artisanat marocain. 
        Fabriqué selon les techniques traditionnelles transmises de génération en génération dans les montagnes de l'Atlas.
        
        Caractéristiques :
        • Matière : Laine naturelle 100%
        • Dimensions : 200 x 150 cm
        • Couleurs : Rouge, orange, jaune, noir
        • Motifs : Géométriques traditionnels
        • État : Excellent, quelques signes d'usage authentiques
        • Origine : Région d'Azilal
        
        Ce tapis unique raconte l'histoire de son créateur à travers ses motifs et ses couleurs. 
        Chaque nœud est une œuvre d'art qui reflète la richesse de la culture berbère.`,
        prix_actuel: 10000,
        prix_depart: 5000,
        prix_acheter: 15000,
        enchères_reçues: 24,
        vues: 156,
        questions: 3,
        temps_restant: "Moins d'1 heure",
        date_debut: '2025-12-01T10:00:00',
        date_fin: '2025-12-24T18:00:00',
        images: [
          'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=800',
          'https://images.unsplash.com/photo-1611461665705-cb05d58fd577?w=800',
          'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=800',
          'https://images.unsplash.com/photo-1611461665705-cb05d58fd577?w=800'
        ],
        vendeur: {
          id: 1,
          nom: 'Imane sh',
          prenom: 'Imane',
          photo: 'https://i.pravatar.cc/150?img=5',
          membre_depuis: 'Décembre 2023',
          note: 4.8,
          avis: 127,
          produits_vendus: 45,
          temps_reponse: '2h'
        },
        offres: [
          { montant: 10000, encherisseur: 'Karim B.', date: '2025-12-24T17:30:00' },
          { montant: 9500, encherisseur: 'Nadia F.', date: '2025-12-24T16:45:00' },
          { montant: 9000, encherisseur: 'Youssef M.', date: '2025-12-24T15:20:00' }
        ],
        questions_reponses: [
          { 
            id: 1, 
            question: 'Quelle est la matière exacte du tapis ?', 
            reponse: 'Le tapis est en laine naturelle 100%, non traitée chimiquement.',
            date: '2025-12-20',
            auteur: 'Sophie L.'
          },
          {
            id: 2,
            question: 'Est-ce que le tapis a été nettoyé ?',
            reponse: 'Oui, un nettoyage professionnel a été effectué en novembre 2025.',
            date: '2025-12-21',
            auteur: 'Ahmed R.'
          }
        ],
        statut: 'actif',
        garantie: true,
        livraison: 'Maroc, International',
        delai_livraison: '3-5 jours ouvrés'
      };

      setProduct(productData);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
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

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= product.prix_actuel) {
      alert('Veuillez entrer un montant supérieur au prix actuel');
      return;
    }
    alert(`Enchère de ${formatPrice(amount)} placée avec succès !`);
    setBidAmount('');
  };

  const handleBuyNow = () => {
    alert('Achat direct demandé ! Vous allez être redirigé vers le paiement.');
  };

  if (loading) {
    return (
      <div className="voir-details-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="voir-details-page">
      {/* Navigation */}
      <div className="details-navigation">
        <button className="btn-back" onClick={() => onNavigate?.('encheres')}>
          <ChevronLeft size={20} />
          Retour à mes enchères
        </button>
        <div className="nav-actions">
          <button className="btn-share" onClick={() => alert('Partager le produit')}>
            <Share2 size={18} />
            Partager
          </button>
          <button 
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
          </button>
        </div>
      </div>

      {/* Galerie d'images */}
      <div className="product-gallery">
        <div className="main-image">
          <img src={product.images[selectedImage]} alt={product.titre} />
          <span className="product-status">En cours</span>
          <div className="image-counter">
            {selectedImage + 1} / {product.images.length}
          </div>
        </div>
        <div className="thumbnails">
          {product.images.map((img, index) => (
            <button
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={img} alt={`Vue ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="product-main-content">
        <div className="product-info">
          {/* En-tête */}
          <div className="product-header">
            <div className="product-category">{product.categorie}</div>
            <h1 className="product-title">{product.titre}</h1>
            <div className="product-meta">
              <span className="meta-item">
                <Eye size={16} />
                {product.vues} vues
              </span>
              <span className="meta-item">
                <Clock size={16} />
                {product.temps_restant}
              </span>
              <span className="meta-item">
                <MessageCircle size={16} />
                {product.questions} questions
              </span>
            </div>
          </div>

          {/* Prix et enchères */}
          <div className="product-pricing">
            <div className="price-section">
              <div className="current-price">
                <span className="price-label">Prix actuel</span>
                <span className="price-value">{formatPrice(product.prix_actuel)}</span>
              </div>
              <div className="price-details">
                <span className="start-price">
                  Prix de départ : {formatPrice(product.prix_depart)}
                </span>
                <span className="bids-count">
                  <Flame size={14} />
                  {product.enchères_reçues} enchères
                </span>
              </div>
            </div>

            {/* Actions d'enchère */}
            <div className="bid-section">
              <div className="bid-input-group">
                <input
                  type="number"
                  className="bid-input"
                  placeholder="Votre enchère..."
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={product.prix_actuel + 100}
                />
                <button className="btn-bid" onClick={handleBid}>
                  <Gavel size={18} />
                  Enchérir
                </button>
              </div>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                <ShoppingCart size={18} />
                Acheter maintenant
              </button>
            </div>

            {/* Dernières offres */}
            <div className="recent-bids">
              <h4>Dernières enchères</h4>
              <div className="bids-list">
                {product.offres.map((offre, index) => (
                  <div className="bid-item" key={index}>
                    <span className="bidder">{offre.encherisseur}</span>
                    <span className="bid-amount">{formatPrice(offre.montant)}</span>
                    <span className="bid-time">{formatDate(offre.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description et onglets */}
          <div className="product-tabs">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                Questions ({product.questions})
              </button>
              <button
                className={`tab-btn ${activeTab === 'vendeur' ? 'active' : ''}`}
                onClick={() => setActiveTab('vendeur')}
              >
                Vendeur
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <p className="product-description">{product.description}</p>
                  <div className="product-features">
                    <div className="feature-item">
                      <Shield size={18} />
                      <span>Garantie d'authenticité</span>
                    </div>
                    <div className="feature-item">
                      <Truck size={18} />
                      <span>Livraison : {product.livraison}</span>
                    </div>
                    <div className="feature-item">
                      <Clock size={18} />
                      <span>Délai : {product.delai_livraison}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="questions-content">
                  {product.questions_reponses.length > 0 ? (
                    product.questions_reponses.map((qr) => (
                      <div className="qa-item" key={qr.id}>
                        <div className="question">
                          <strong>Q :</strong> {qr.question}
                          <span className="qa-date">{qr.date}</span>
                        </div>
                        <div className="reponse">
                          <strong>R :</strong> {qr.reponse}
                          <span className="qa-author">- {qr.auteur}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-questions">Aucune question pour le moment.</p>
                  )}
                  <button className="btn-ask-question">
                    Poser une question
                  </button>
                </div>
              )}

              {activeTab === 'vendeur' && (
                <div className="vendeur-content">
                  <div className="vendeur-profile">
                    <img 
                      src={product.vendeur.photo} 
                      alt={product.vendeur.nom}
                      className="vendeur-avatar-large"
                    />
                    <div className="vendeur-info-details">
                      <h3>{product.vendeur.nom}</h3>
                      <p className="vendeur-since">
                        Membre depuis {product.vendeur.membre_depuis}
                      </p>
                      <div className="vendeur-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < Math.floor(product.vendeur.note) ? '#f6ad55' : 'none'} stroke="#f6ad55" />
                          ))}
                          <span className="rating-value">{product.vendeur.note}</span>
                        </div>
                        <span className="reviews-count">({product.vendeur.avis} avis)</span>
                      </div>
                      <div className="vendeur-stats-details">
                        <div className="stat-detail">
                          <TrendingUp size={14} />
                          <span>{product.vendeur.produits_vendus} produits vendus</span>
                        </div>
                        <div className="stat-detail">
                          <Clock size={14} />
                          <span>Réponse moyenne : {product.vendeur.temps_reponse}</span>
                        </div>
                        <div className="stat-detail">
                          <Award size={14} />
                          <span>Vendeur vérifié</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoirDetails;