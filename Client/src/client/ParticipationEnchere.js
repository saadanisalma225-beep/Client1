// client/ParticipationEnchere.js
import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Heart,
  Clock,
  Eye,
  Flame,
  Timer,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Shield,
  Truck,
  Award,
  TrendingUp,
  Share2,
  MessageCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Zap,
  Gift,
  Wallet,
  Settings,
  HelpCircle,
  Users,
  BarChart,
  Plus,
  Minus
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './ParticipationEnchere.css';

const ParticipationEnchere = ({ onNavigate, productId }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [client, setClient] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [timeLeft, setTimeLeft] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  useEffect(() => {
    if (product && product.date_fin) {
      const timer = setInterval(() => {
        updateTimeLeft();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  const updateTimeLeft = () => {
    if (!product) return;
    const now = new Date();
    const end = new Date(product.date_fin);
    const diff = end - now;
    
    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeLeft({ days, hours, minutes, seconds, ended: false });
  };

  // ✅ Fonction corrigée - renommée sans "use" au début
  const getFallbackProductData = (id) => {
    return {
      id: id || 1,
      titre: 'Tapis Berbère Azilal Vintage 1980',
      categorie: 'Tapis & Textiles',
      description: `Magnifique tapis berbère fait main, authentique pièce d'artisanat marocain. Fabriqué selon les techniques traditionnelles transmises de génération en génération dans les montagnes de l'Atlas.
      
      Caractéristiques :
      • Matière : Laine naturelle 100%
      • Dimensions : 200 x 150 cm
      • Couleurs : Rouge, orange, jaune, noir
      • Motifs : Géométriques traditionnels
      • État : Excellent, quelques signes d'usage authentiques
      • Origine : Région d'Azilal`,
      prix_actuel: 10000,
      prix_depart: 5000,
      prix_acheter: 15000,
      enchères: 24,
      vues: 156,
      questions: 3,
      date_fin: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      date_debut: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      images: [
        'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=800',
        'https://images.unsplash.com/photo-1611461665705-cb05d58fd577?w=800',
        'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=800'
      ],
      vendeur: {
        id: 1,
        nom: 'Imane sh',
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
      statut: 'actif',
      garantie: true,
      livraison: 'Maroc, International',
      delai_livraison: '3-5 jours ouvrés',
      specifications: {
        'Matériau': 'Laine naturelle',
        'Dimensions': '200 x 150 cm',
        'Couleur': 'Rouge, orange, jaune',
        'Origine': 'Azilal, Maroc',
        'État': 'Excellent'
      }
    };
  };

  const fetchProductData = async (id) => {
    setLoading(true);
    setError('');
    try {
      // ===== APPEL API BACKEND =====
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/encheres/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const item = data.enchere || data.produit || data;
        const productData = {
          id: item.id,
          titre: item.titre || item.nom || 'Sans titre',
          categorie: item.categorie || item.categorie_nom || 'Non catégorisé',
          description: item.description || '',
          prix_actuel: item.prix_actuel || item.prix_courant || item.prix || 0,
          prix_depart: item.prix_depart || item.prix_initial || 0,
          prix_acheter: item.prix_acheter || item.prix_direct || null,
          enchères: item.nb_enchères || item.enchères_count || 0,
          vues: item.vues || 0,
          questions: item.nb_questions || item.questions_count || 0,
          date_fin: item.date_fin || item.date_expiration || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          date_debut: item.date_debut || item.date_creation || new Date().toISOString(),
          images: item.images || [item.image || item.image_url || 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=800'],
          vendeur: {
            id: item.vendeur?.id || 0,
            nom: item.vendeur?.nom || item.vendeur_nom || 'Vendeur',
            photo: item.vendeur?.photo || item.vendeur_photo || 'https://i.pravatar.cc/150?img=5',
            membre_depuis: item.vendeur?.membre_depuis || 'Janvier 2024',
            note: item.vendeur?.note || item.note_vendeur || 4.5,
            avis: item.vendeur?.avis || 0,
            produits_vendus: item.vendeur?.produits_vendus || 0,
            temps_reponse: item.vendeur?.temps_reponse || '2h'
          },
          offres: item.offres || [
            { montant: 10000, encherisseur: 'Karim B.', date: '2025-12-24T17:30:00' },
            { montant: 9500, encherisseur: 'Nadia F.', date: '2025-12-24T16:45:00' },
            { montant: 9000, encherisseur: 'Youssef M.', date: '2025-12-24T15:20:00' }
          ],
          statut: item.statut || 'actif',
          garantie: item.garantie || true,
          livraison: item.livraison || 'Maroc, International',
          delai_livraison: item.delai_livraison || '3-5 jours ouvrés',
          specifications: item.specifications || {
            'Matériau': 'Laine naturelle',
            'Dimensions': '200 x 150 cm',
            'Couleur': 'Rouge, orange, jaune',
            'Origine': 'Azilal, Maroc',
            'État': 'Excellent'
          }
        };
        setProduct(productData);
      } else {
        // Si l'API retourne une erreur, on utilise les données de secours
        setError(data.message || 'Erreur de chargement');
        // ✅ Utilisation de la fonction corrigée
        const fallbackData = getFallbackProductData(id);
        setProduct(fallbackData);
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      setError('Impossible de contacter le serveur');
      // ✅ Utilisation de la fonction corrigée
      const fallbackData = getFallbackProductData(id);
      setProduct(fallbackData);
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
      setError('Veuillez entrer un montant supérieur au prix actuel');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmBid = async () => {
    setIsBidding(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/encheres/${product.id}/encherir`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          montant: parseFloat(bidAmount)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Enchère de ${formatPrice(parseFloat(bidAmount))} placée avec succès !`);
        setProduct({ ...product, prix_actuel: parseFloat(bidAmount), enchères: product.enchères + 1 });
        setBidAmount('');
        setShowConfirmModal(false);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.message || 'Erreur lors du placement de l\'enchère');
      }
    } catch (error) {
      console.error('Erreur enchère:', error);
      setError('Impossible de contacter le serveur');
    } finally {
      setIsBidding(false);
    }
  };

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/favoris/${product.id}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Erreur favori:', error);
    }
  };

  const renderTimeLeft = () => {
    if (timeLeft.ended) {
      return <span className="time-ended">Enchère terminée</span>;
    }
    return (
      <div className="time-digits">
        <div className="time-unit">
          <span className="digit">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="unit-label">j</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <span className="digit">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="unit-label">h</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <span className="digit">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="unit-label">m</span>
        </div>
        <span className="time-separator">:</span>
        <div className="time-unit">
          <span className="digit">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="unit-label">s</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="participation-enchere-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement de l'enchère...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="participation-enchere-page">
      {/* Navigation */}
      <div className="page-navigation">
        <button className="btn-back" onClick={() => onNavigate?.('auctions')}>
          <ChevronLeft size={20} />
          Retour aux enchères
        </button>
        <div className="nav-actions">
          <button className="btn-share" onClick={() => alert('Partager le produit')}>
            <Share2 size={18} />
          </button>
          <button 
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Messages d'erreur/succès */}
      {error && (
        <div className="message-banner error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      {success && (
        <div className="message-banner success">
          <CheckCircle size={18} />
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* Contenu principal */}
      <div className="enchere-detail-container">
        {/* Galerie d'images */}
        <div className="enchere-gallery">
          <div className="main-image">
            <img src={product.images[0]} alt={product.titre} />
            <div className="image-badge">En cours</div>
          </div>
          <div className="thumbnails">
            {product.images.slice(1, 4).map((img, index) => (
              <div className="thumbnail" key={index}>
                <img src={img} alt={`Vue ${index + 2}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Informations produit */}
        <div className="enchere-info">
          <div className="info-header">
            <span className="product-category">{product.categorie}</span>
            <h1 className="product-title">{product.titre}</h1>
            <div className="product-meta-stats">
              <span className="stat">
                <Eye size={14} />
                {product.vues} vues
              </span>
              <span className="stat">
                <MessageCircle size={14} />
                {product.questions} questions
              </span>
              <span className="stat">
                <Gavel size={14} />
                {product.enchères} enchères
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="timer-section">
            <div className="timer-icon">
              <Clock size={20} />
              <span>Temps restant</span>
            </div>
            {renderTimeLeft()}
          </div>

          {/* Prix et enchères */}
          <div className="price-section">
            <div className="current-bid">
              <span className="price-label">Offre actuelle</span>
              <span className="price-value">{formatPrice(product.prix_actuel)}</span>
            </div>
            <div className="price-details">
              <span className="start-price">Prix de départ : {formatPrice(product.prix_depart)}</span>
              {product.prix_acheter && (
                <span className="buy-now-price">Achat immédiat : {formatPrice(product.prix_acheter)}</span>
              )}
            </div>
          </div>

          {/* Formulaire d'enchère */}
          <div className="bid-form">
            <div className="bid-input-group">
              <input
                type="number"
                className="bid-input"
                placeholder="Votre enchère..."
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={product.prix_actuel + 1}
              />
              <button 
                className="btn-bid"
                onClick={handleBid}
                disabled={isBidding || timeLeft.ended}
              >
                {isBidding ? 'En cours...' : 'Enchérir'}
              </button>
            </div>
            <div className="bid-hint">
              <span>Prochaine offre minimum : {formatPrice(product.prix_actuel + 1)}</span>
            </div>
          </div>

          {/* Ajouter aux favoris / Vendeur */}
          <div className="product-actions-row">
            <button className="btn-add-to-watchlist" onClick={toggleFavorite}>
              <Heart size={16} />
              Ajouter aux favoris
            </button>
            <div className="vendeur-mini">
              <img src={product.vendeur.photo} alt={product.vendeur.nom} />
              <div>
                <span>{product.vendeur.nom}</span>
                <div className="rating-mini">
                  <Star size={12} fill="#f6ad55" stroke="#f6ad55" />
                  <span>{product.vendeur.note}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets supplémentaires */}
      <div className="detail-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Détails
          </button>
          <button
            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Spécifications
          </button>
          <button
            className={`tab-btn ${activeTab === 'offres' ? 'active' : ''}`}
            onClick={() => setActiveTab('offres')}
          >
            Offres récentes
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="details-content">
              <p className="description">{product.description}</p>
              <div className="features-grid">
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
                <div className="feature-item">
                  <Award size={18} />
                  <span>Vendeur vérifié</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              <div className="spec-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div className="spec-item" key={key}>
                    <span className="spec-key">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offres' && (
            <div className="offres-content">
              {product.offres.map((offre, index) => (
                <div className="offre-item" key={index}>
                  <div className="offre-info">
                    <span className="offre-encherisseur">{offre.encherisseur}</span>
                    <span className="offre-montant">{formatPrice(offre.montant)}</span>
                  </div>
                  <span className="offre-date">{formatDate(offre.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vendeur complet */}
      <div className="vendeur-section">
        <h3>À propos du vendeur</h3>
        <div className="vendeur-card">
          <img src={product.vendeur.photo} alt={product.vendeur.nom} className="vendeur-avatar-large" />
          <div className="vendeur-details">
            <h4>{product.vendeur.nom}</h4>
            <p className="vendeur-since">Membre depuis {product.vendeur.membre_depuis}</p>
            <div className="vendeur-rating-details">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.vendeur.note) ? '#f6ad55' : 'none'} stroke="#f6ad55" />
                ))}
                <span className="rating-value">{product.vendeur.note}</span>
              </div>
              <span className="reviews-count">({product.vendeur.avis} avis)</span>
            </div>
            <div className="vendeur-stats-grid">
              <div className="vstat">
                <TrendingUp size={14} />
                <span>{product.vendeur.produits_vendus} produits vendus</span>
              </div>
              <div className="vstat">
                <Clock size={14} />
                <span>Réponse : {product.vendeur.temps_reponse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmer l'enchère</h2>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Vous êtes sur le point de placer une enchère de :</p>
              <div className="modal-bid-amount">{formatPrice(parseFloat(bidAmount))}</div>
              <p>Sur le produit : <strong>{product.titre}</strong></p>
              <div className="modal-warning">
                <AlertCircle size={16} />
                <span>Cette enchère est irréversible. Assurez-vous d'avoir les fonds nécessaires.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>Annuler</button>
              <button className="btn-confirm" onClick={confirmBid} disabled={isBidding}>
                {isBidding ? 'En cours...' : 'Confirmer l\'enchère'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipationEnchere;