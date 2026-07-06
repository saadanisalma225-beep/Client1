// client/EncheresEnCours.js
import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Heart,
  Clock,
  Eye,
  Flame,
  Timer,
  Filter,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  ChevronRight,
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  Star,
  Calendar,
  Tag,
  ShoppingBag
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './EncheresEnCours.css';

const EncheresEnCours = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

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
    fetchActiveAuctions(token);
  }, [onNavigate]);

  // ✅ Fonction corrigée - renommée sans "use" au début
  const getFallbackData = () => {
    return [
      {
        id: 1,
        titre: 'Tapis Berbère Azilal Vintage',
        categorie: 'Tapis & Textiles',
        prix_actuel: 10000,
        prix_depart: 5000,
        enchères: 24,
        vues: 156,
        temps_restant: '2j 14h 30min',
        date_fin: '2025-12-24T18:00:00',
        image: 'https://images.unsplash.com/photo-1600164318544-79e50b5b488c?w=400',
        vendeur: 'Imane sh',
        note_vendeur: 4.8,
        enchères_actives: true,
        favoris: 0,
        questions: 3,
        categorie_id: 1,
        description: 'Magnifique tapis berbère fait main...'
      },
      {
        id: 2,
        titre: 'Vase en Céramique Fassi',
        categorie: 'Céramique & Poterie',
        prix_actuel: 1850,
        prix_depart: 1200,
        enchères: 8,
        vues: 89,
        temps_restant: '5j 8h 15min',
        date_fin: '2025-12-28T12:00:00',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
        vendeur: 'Nadia El Fassi',
        note_vendeur: 4.9,
        enchères_actives: true,
        favoris: 0,
        questions: 1,
        categorie_id: 2,
        description: 'Vase en céramique émaillée...'
      },
      {
        id: 3,
        titre: 'Collier Berbère Argent',
        categorie: 'Bijoux',
        prix_actuel: 1200,
        prix_depart: 300,
        enchères: 24,
        vues: 234,
        temps_restant: '1j 6h 20min',
        date_fin: '2025-12-23T20:00:00',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
        vendeur: 'Mohamed Chraibi',
        note_vendeur: 4.7,
        enchères_actives: true,
        favoris: 0,
        questions: 5,
        categorie_id: 3,
        description: 'Collier en argent massif...'
      },
      {
        id: 4,
        titre: 'Lampe Marocaine Cuivre',
        categorie: 'Décoration',
        prix_actuel: 3500,
        prix_depart: 2000,
        enchères: 15,
        vues: 312,
        temps_restant: '3j 2h 45min',
        date_fin: '2025-12-26T22:00:00',
        image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400',
        vendeur: 'Sophie Laurent',
        note_vendeur: 4.6,
        enchères_actives: true,
        favoris: 0,
        questions: 2,
        categorie_id: 4,
        description: 'Lampe en cuivre...'
      }
    ];
  };

  const fetchActiveAuctions = async (token) => {
    setLoading(true);
    setError('');
    try {
      // ===== APPEL API BACKEND =====
      const response = await fetch('http://localhost:5000/api/encheres/actives', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Transformer les données de l'API pour correspondre au format attendu
        const formattedProducts = data.encheres.map(item => ({
          id: item.id,
          titre: item.titre || item.nom || 'Sans titre',
          categorie: item.categorie || item.categorie_nom || 'Non catégorisé',
          prix_actuel: item.prix_actuel || item.prix_courant || item.prix || 0,
          prix_depart: item.prix_depart || item.prix_initial || 0,
          enchères: item.nb_enchères || item.enchères_count || 0,
          vues: item.vues || 0,
          temps_restant: item.temps_restant || 'En cours',
          date_fin: item.date_fin || item.date_expiration || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          image: item.image || item.image_url || 'https://via.placeholder.com/400',
          vendeur: item.vendeur?.nom || item.vendeur_nom || 'Vendeur',
          note_vendeur: item.vendeur?.note || item.note_vendeur || 4.5,
          enchères_actives: item.actif !== undefined ? item.actif : true,
          favoris: item.favoris || 0,
          questions: item.nb_questions || item.questions_count || 0,
          categorie_id: item.categorie_id || item.categorie?.id || 0,
          description: item.description || ''
        }));

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } else {
        // Si l'API retourne une erreur, on utilise les données de secours
        console.warn('API error, using fallback data:', data.message);
        setError(data.message || 'Erreur de chargement');
        // ✅ Utilisation de la fonction corrigée
        const fallbackData = getFallbackData();
        setProducts(fallbackData);
        setFilteredProducts(fallbackData);
      }
      
    } catch (error) {
      console.error('Erreur chargement enchères:', error);
      setError('Impossible de contacter le serveur');
      // ✅ Utilisation de la fonction corrigée
      const fallbackData = getFallbackData();
      setProducts(fallbackData);
      setFilteredProducts(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Toutes les catégories' },
    { id: 1, label: 'Tapis & Textiles' },
    { id: 2, label: 'Céramique & Poterie' },
    { id: 3, label: 'Bijoux' },
    { id: 4, label: 'Décoration' }
  ];

  const toggleFavorite = (productId) => {
    let newFavorites;
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));

    // ===== Appel API pour ajouter/supprimer des favoris =====
    const token = localStorage.getItem('token');
    const isFavorite = favorites.includes(productId);
    
    fetch(`http://localhost:5000/api/favoris/${productId}`, {
      method: isFavorite ? 'DELETE' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).catch(err => console.error('Erreur favori:', err));
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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, selectedCategory, sortBy);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    applyFilters(searchTerm, categoryId, sortBy);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    applyFilters(searchTerm, selectedCategory, sort);
  };

  const applyFilters = (term, category, sort) => {
    let filtered = products.filter(product => {
      const matchSearch = product.titre?.toLowerCase().includes(term) ||
                         product.categorie?.toLowerCase().includes(term) ||
                         product.vendeur?.toLowerCase().includes(term);
      const matchCategory = category === 'all' || product.categorie_id === category;
      return matchSearch && matchCategory;
    });

    // Tri
    switch(sort) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin));
        break;
      case 'prix-croissant':
        filtered.sort((a, b) => (a.prix_actuel || 0) - (b.prix_actuel || 0));
        break;
      case 'prix-decroissant':
        filtered.sort((a, b) => (b.prix_actuel || 0) - (a.prix_actuel || 0));
        break;
      case 'enchères':
        filtered.sort((a, b) => (b.enchères || 0) - (a.enchères || 0));
        break;
      case 'fin-proche':
        filtered.sort((a, b) => new Date(a.date_fin) - new Date(b.date_fin));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const getTimeRemaining = (endDate) => {
    if (!endDate) return 'En cours';
    
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Terminé';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}j ${hours}h ${minutes}min`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const renderProductCard = (product) => {
    const isFavorite = favorites.includes(product.id);
    const timeRemaining = getTimeRemaining(product.date_fin);

    return (
      <div className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`} key={product.id}>
        <div className="product-card-image">
          <img src={product.image} alt={product.titre} />
          <button 
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <div className="product-badge">Enchère</div>
        </div>

        <div className="product-card-content">
          <div className="product-header">
            <h3 className="product-title">{product.titre}</h3>
            <span className="product-category">{product.categorie}</span>
          </div>

          <div className="product-price">
            <span className="price-label">Prix actuel</span>
            <span className="price-value">{formatPrice(product.prix_actuel)}</span>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <Gavel size={14} />
              <span>{product.enchères} enchères</span>
            </div>
            <div className="meta-item">
              <Eye size={14} />
              <span>{product.vues} vues</span>
            </div>
          </div>

          <div className="product-timer">
            <Timer size={14} />
            <span>Temps restant : <strong>{timeRemaining}</strong></span>
          </div>

          <div className="product-vendeur">
            <span>Par {product.vendeur}</span>
            <div className="vendeur-rating">
              <Star size={12} fill="#f6ad55" stroke="#f6ad55" />
              <span>{product.note_vendeur}</span>
            </div>
          </div>

          <button 
            className="btn-participate"
            onClick={() => onNavigate?.('product-detail', product.id)}
          >
            Participer à l'enchère
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="encheres-en-cours-page">
      {/* Header */}
      <section className="page-header">
        <div className="header-content">
          <h1>Enchères en Cours</h1>
          <p>Découvrez tous les produits actuellement en enchère. Faites vos offres avant qu'il ne soit trop tard !</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <Gavel size={24} />
            <div>
              <span className="stat-number">{filteredProducts.length}</span>
              <span className="stat-label">Produits en enchère</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="search-filters-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filters-bar">
          <div className="categories-filter">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="sort-filter">
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="recent">Plus récent</option>
              <option value="prix-croissant">Prix croissant</option>
              <option value="prix-decroissant">Prix décroissant</option>
              <option value="enchères">Plus d'enchères</option>
              <option value="fin-proche">Fin proche</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={18} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="results-section">
        <div className="results-header">
          <span className="results-count">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} en enchère
          </span>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des enchères...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`products-grid ${viewMode === 'list' ? 'list-mode' : ''}`}>
            {filteredProducts.map(product => renderProductCard(product))}
          </div>
        ) : (
          <div className="empty-state">
            <Gavel size={48} className="empty-icon" />
            <h3>Aucune enchère trouvée</h3>
            <p>Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default EncheresEnCours;