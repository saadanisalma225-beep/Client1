// ProductsPage.js - Version complète
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductsPage.css";

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/admin/produits`;

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("en_attente");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // 📥 Charger les produits
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/?statut=${selectedStatus}`);
      if (response.data.success) {
        setProducts(response.data.produits || []);
        setError(null);
      } else {
        setProducts([]);
        setError(response.data.message || "Erreur de chargement");
      }
    } catch (err) {
      console.error("Erreur chargement produits:", err);
      if (err.code === 'ERR_NETWORK') {
        setError("❌ Impossible de joindre le serveur. Vérifiez que le backend tourne sur http://localhost:5000");
      } else if (err.response?.status === 401) {
        setError("❌ Non authentifié. Veuillez vous reconnecter.");
      } else {
        setError(`❌ Erreur: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 📥 Charger les catégories et domaines pour les filtres
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/categorie/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      if (response.data.success) {
        setCategories(response.data.categories || []);
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/domaine/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      if (response.data.success) {
        setDomains(response.data.domaines || []);
      }
    } catch (err) {
      console.error("Erreur chargement domaines:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDomains();
  }, [selectedStatus]);

  // 🔍 Filtrer les produits
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.nom_produit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.vendeur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.vendeur_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? product.id_categorie === parseInt(selectedCategory) : true;
    const matchDomain = selectedDomain ? product.id_domaine === parseInt(selectedDomain) : true;
    return matchSearch && matchCategory && matchDomain;
  });

  // ✅ Valider un produit
  const validateProduct = async (product) => {
    if (window.confirm(`Valider le produit "${product.nom_produit}" ? Il sera mis en vente aux enchères immédiatement.`)) {
      try {
        const response = await api.put(`/${product.id_produit}/valider`);
        if (response.data.success) {
          setSuccessMessage(`✅ Produit "${product.nom_produit}" validé avec succès ! Il est maintenant visible sur la plateforme.`);
          fetchProducts();
          setTimeout(() => setSuccessMessage(null), 4000);
        } else {
          setError(response.data.message || "Erreur lors de la validation");
        }
      } catch (err) {
        console.error("Erreur validation:", err);
        setError(err.response?.data?.message || "Erreur lors de la validation");
        setTimeout(() => setError(null), 4000);
      }
    }
  };

  // ❌ Refuser un produit
  const rejectProduct = async () => {
    if (!rejectionReason.trim()) {
      alert("Veuillez indiquer une raison de refus");
      return;
    }

    try {
      const response = await api.put(`/${selectedProduct.id_produit}/refuser`, {
        raison_refus: rejectionReason
      });
      if (response.data.success) {
        setSuccessMessage(`❌ Produit "${selectedProduct.nom_produit}" refusé. Un email sera envoyé au vendeur.`);
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedProduct(null);
        fetchProducts();
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setError(response.data.message || "Erreur lors du refus");
      }
    } catch (err) {
      console.error("Erreur refus:", err);
      setError(err.response?.data?.message || "Erreur lors du refus");
    }
  };

  // 📊 Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 💰 Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // 🏷️ Obtenir le nom de la catégorie
  const getCategoryName = (id_categorie) => {
    const category = categories.find(c => c.id_categorie === id_categorie);
    return category ? category.nom_categorie : "Catégorie inconnue";
  };

  // 🏷️ Obtenir le nom du domaine
  const getDomainName = (id_domaine) => {
    const domain = domains.find(d => d.id_domaine === id_domaine);
    return domain ? domain.nom_domaine : "Domaine inconnu";
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDomain("");
  };

  // Statistiques
  const stats = {
    total: products.length,
    en_attente: products.filter(p => p.statut === 'en_attente').length,
    actif: products.filter(p => p.statut === 'actif').length,
    refuse: products.filter(p => p.statut === 'refuse').length
  };

  if (loading) {
    return (
      <div className="products-page" style={{ textAlign: "center", padding: "60px" }}>
        <div className="loading-spinner"></div>
        <p>⏳ Chargement des produits {selectedStatus === 'en_attente' ? 'en attente' : ''}...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="header">
        <div>
          <h1>Gestion des produits</h1>
          <p className="subtitle">Superviser et valider les produits soumis par les clients avant leur mise en vente aux enchères</p>
        </div>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Rechercher produit ou vendeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les domaines</option>
            {domains.map(domain => (
              <option key={domain.id_domaine} value={domain.id_domaine}>
                {domain.nom_domaine}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category.id_categorie} value={category.id_categorie}>
                {category.nom_categorie}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select status-filter"
          >
            <option value="en_attente">⏳ En attente de validation</option>
            <option value="actif">✅ Produits validés</option>
            <option value="refuse">❌ Produits refusés</option>
            <option value="tous">📋 Tous les produits</option>
          </select>

          <button className="refresh-btn" onClick={fetchProducts}>
            🔄 Actualiser
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="stats-row">
        <div className="stat-card-mini">
          <span className="stat-icon">📊</span>
          <div>
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card-mini pending">
          <span className="stat-icon">⏳</span>
          <div>
            <span className="stat-label">En attente</span>
            <span className="stat-value">{stats.en_attente}</span>
          </div>
        </div>
        <div className="stat-card-mini approved">
          <span className="stat-icon">✅</span>
          <div>
            <span className="stat-label">Validés</span>
            <span className="stat-value">{stats.actif}</span>
          </div>
        </div>
        <div className="stat-card-mini rejected">
          <span className="stat-icon">❌</span>
          <div>
            <span className="stat-label">Refusés</span>
            <span className="stat-value">{stats.refuse}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>❌ Erreur</strong>
          <p>{error}</p>
          <button onClick={fetchProducts}>Réessayer</button>
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          <strong>✅ Succès</strong>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Indicateur de filtres */}
      {(searchTerm || selectedCategory || selectedDomain) && (
        <div className="filters-info">
          <span>
            🔍 Filtres actifs : 
            {searchTerm && <strong> "{searchTerm}"</strong>}
            {selectedCategory && <strong> - {getCategoryName(parseInt(selectedCategory))}</strong>}
            {selectedDomain && <strong> - {getDomainName(parseInt(selectedDomain))}</strong>}
            <span className="filter-count">({filteredProducts.length} produit(s))</span>
          </span>
          <button onClick={handleClearFilters}>✕ Effacer les filtres</button>
        </div>
      )}

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>Aucun produit {selectedStatus === 'en_attente' ? 'en attente de validation' : selectedStatus === 'actif' ? 'validé' : selectedStatus === 'refuse' ? 'refusé' : ''}</p>
          {selectedStatus === 'en_attente' && (
            <p className="empty-subtitle">Les produits soumis par les clients apparaîtront ici pour validation</p>
          )}
        </div>
      ) : (
        <div className="products-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={`product-${product.id_produit}`}>
              {/* Image du produit */}
              <div className="product-image">
                <img
                  src={product.image_produit 
                    ? `http://localhost:5000/uploads/produits/${product.image_produit}`
                    : "https://via.placeholder.com/120x120?text=Pas+d'image"}
                  alt={product.nom_produit}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120x120?text=Image+non+trouvée";
                  }}
                />
              </div>

              {/* Informations du produit */}
              <div className="product-info">
                <div className="product-header">
                  <h3>{product.nom_produit}</h3>
                  <span className={`status-badge ${product.statut}`}>
                    {product.statut === 'en_attente' && '⏳ EN ATTENTE'}
                    {product.statut === 'actif' && '✅ VALIDÉ'}
                    {product.statut === 'refuse' && '❌ REFUSÉ'}
                  </span>
                </div>

                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">💰 Prix de départ :</span>
                    <span className="detail-value">{formatPrice(product.prix_depart)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📂 Domaine :</span>
                    <span className="detail-value">{getDomainName(product.id_domaine)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏷️ Catégorie :</span>
                    <span className="detail-value">{getCategoryName(product.id_categorie)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👤 Vendeur :</span>
                    <span className="detail-value">{product.vendeur_nom || product.vendeur_email || `ID: ${product.id_utilisateur}`}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📅 Date de soumission :</span>
                    <span className="detail-value">{formatDate(product.date_creation)}</span>
                  </div>
                  {product.description_produit && (
                    <div className="detail-row description">
                      <span className="detail-label">📝 Description :</span>
                      <span className="detail-value">{product.description_produit.substring(0, 100)}...</span>
                    </div>
                  )}
                  {product.raison_refus && product.statut === 'refuse' && (
                    <div className="detail-row rejection-reason">
                      <span className="detail-label">⚠️ Raison du refus :</span>
                      <span className="detail-value">{product.raison_refus}</span>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="product-actions">
                  <button 
                    className="view-btn"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowDetailsModal(true);
                    }}
                  >
                    👁️ Voir détails
                  </button>
                  
                  {product.statut === 'en_attente' && (
                    <>
                      <button 
                        className="validate-btn"
                        onClick={() => validateProduct(product)}
                      >
                        ✅ Valider
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowRejectModal(true);
                        }}
                      >
                        ❌ Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Détails du produit */}
      {showDetailsModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Détails du produit</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-product-image">
                <img
                  src={selectedProduct.image_produit 
                    ? `http://localhost:5000/uploads/produits/${selectedProduct.image_produit}`
                    : "https://via.placeholder.com/300x300?text=Pas+d'image"}
                  alt={selectedProduct.nom_produit}
                />
              </div>
              <div className="detail-info">
                <h3>{selectedProduct.nom_produit}</h3>
                <p className="detail-price">{formatPrice(selectedProduct.prix_depart)}</p>
                <div className="detail-grid">
                  <p><strong>📂 Domaine :</strong> {getDomainName(selectedProduct.id_domaine)}</p>
                  <p><strong>🏷️ Catégorie :</strong> {getCategoryName(selectedProduct.id_categorie)}</p>
                  <p><strong>👤 Vendeur :</strong> {selectedProduct.vendeur_nom || selectedProduct.vendeur_email}</p>
                  <p><strong>📅 Date de soumission :</strong> {formatDate(selectedProduct.date_creation)}</p>
                  <p><strong>🏷️ Statut :</strong> 
                    <span className={`status-badge ${selectedProduct.statut}`} style={{ marginLeft: '8px' }}>
                      {selectedProduct.statut === 'en_attente' && '⏳ EN ATTENTE'}
                      {selectedProduct.statut === 'actif' && '✅ VALIDÉ'}
                      {selectedProduct.statut === 'refuse' && '❌ REFUSÉ'}
                    </span>
                  </p>
                </div>
                <p><strong>📝 Description complète :</strong></p>
                <p className="detail-description">{selectedProduct.description_produit || "Aucune description"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Refus */}
      {showRejectModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content reject-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❌ Refuser le produit</h2>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Produit : <strong>{selectedProduct.nom_produit}</strong></p>
              <p>Vendeur : <strong>{selectedProduct.vendeur_nom || selectedProduct.vendeur_email}</strong></p>
              <label>Raison du refus :</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Indiquez pourquoi ce produit est refusé (sera communiqué au vendeur)..."
                rows="4"
              />
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}>Annuler</button>
                <button className="reject-confirm-btn" onClick={rejectProduct}>Confirmer le refus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;