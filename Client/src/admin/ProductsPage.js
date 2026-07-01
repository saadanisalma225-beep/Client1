import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/admin/ProductsPage.css";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/produit/");
      if (response.data.success) {
        setProducts(response.data.produits || []);
        setError(null);
      } else {
        setProducts([]);
        setError(response.data.message || "Erreur de chargement");
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError("❌ Impossible de joindre le serveur");
      } else if (err.response?.status === 401) {
        setError("❌ Non authentifié");
      } else {
        setError(`❌ Erreur: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/admin/categorie/");
      if (response.data.success) setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await api.get("/admin/domaine/");
      if (response.data.success) setDomains(response.data.domaines || []);
    } catch (err) {
      console.error("Erreur chargement domaines:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDomains();
  }, []);

  // 🎯 Auto-select first domain and first category when data loads
  useEffect(() => {
    if (domains.length > 0 && !selectedDomain) {
      const firstDomain = domains[0];
      setSelectedDomain(String(firstDomain.id_domaine));

      // Find first category belonging to this domain
      const catsForDomain = categories.filter(c => c.id_domaine === firstDomain.id_domaine);
      if (catsForDomain.length > 0) {
        setSelectedCategory(String(catsForDomain[0].id_categorie));
      }
    }
  }, [domains, categories]);

  // 🔍 Filtrer les produits
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.nom_produit?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory 
      ? product.id_categorie_produit === parseInt(selectedCategory) 
      : true;
    const matchDomain = selectedDomain 
      ? (() => {
          const cat = categories.find(c => c.id_categorie === product.id_categorie_produit);
          return cat && cat.id_domaine === parseInt(selectedDomain);
        })()
      : true;
    return matchSearch && matchCategory && matchDomain;
  });

  // 🖼️ Get all image URLs
  const getAllImages = (product) => {
    const images = product.produit_image_produit || [];
    if (Array.isArray(images)) return images;
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getFirstImage = (product) => {
    const images = getAllImages(product);
    return images.length > 0 ? images[0] : null;
  };

  const getImageUrl = (filename) => `http://localhost:5000/uploads/produits/${filename}`;

  const validateProduct = async (product) => {
    if (window.confirm(`Approuver l'expertise du produit "${product.nom_produit}" ?`)) {
      try {
        const response = await api.put(`/admin/produit/${product.id_produit}`, {
          expertise_approuved_produit: true
        });
        if (response.data.success) {
          setSuccessMessage(`✅ Expertise approuvée pour "${product.nom_produit}"`);
          fetchProducts();
          setTimeout(() => setSuccessMessage(null), 4000);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de l'approbation");
      }
    }
  };

  const rejectProduct = async () => {
    if (!rejectionReason.trim()) {
      alert("Veuillez indiquer une raison de refus");
      return;
    }
    try {
      const response = await api.put(`/admin/produit/${selectedProduct.id_produit}`, {
        expertise_approuved_produit: false,
        a_expertise_produit: false
      });
      if (response.data.success) {
        setSuccessMessage(`❌ Expertise refusée pour "${selectedProduct.nom_produit}"`);
        setShowRejectModal(false);
        setRejectionReason("");
        setSelectedProduct(null);
        fetchProducts();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du refus");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  const getCategoryName = (id_categorie) => {
    const category = categories.find(c => c.id_categorie === id_categorie);
    return category ? category.nom_categorie : "Catégorie inconnue";
  };

  const filteredCategories = selectedDomain
    ? categories.filter(c => c.id_domaine === parseInt(selectedDomain))
    : categories;

  const handleClearFilters = () => {
    setSearchTerm("");
    // Reset to first domain and its first category
    if (domains.length > 0) {
      const firstDomain = domains[0];
      setSelectedDomain(String(firstDomain.id_domaine));
      const catsForDomain = categories.filter(c => c.id_domaine === firstDomain.id_domaine);
      if (catsForDomain.length > 0) {
        setSelectedCategory(String(catsForDomain[0].id_categorie));
      } else {
        setSelectedCategory("");
      }
    } else {
      setSelectedCategory("");
      setSelectedDomain("");
    }
  };

  const openDetails = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setShowDetailsModal(true);
  };

  const stats = {
    total: products.length,
    en_attente: products.filter(p => p.a_expertise_produit && !p.expertise_approuved_produit).length,
    actif: products.filter(p => p.expertise_approuved_produit).length,
    refuse: products.filter(p => !p.a_expertise_produit).length
  };

  if (loading) {
    return (
      <div className="products-page" style={{ textAlign: "center", padding: "60px" }}>
        <div className="loading-spinner"></div>
        <p>⏳ Chargement...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="header">
        <div>
          <h1>Gestion des produits</h1>
          <p className="subtitle">Superviser et valider les produits soumis par les clients</p>
        </div>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedDomain}
            onChange={(e) => {
              const newDomain = e.target.value;
              setSelectedDomain(newDomain);
              // Auto-select first category of new domain
              const catsForDomain = categories.filter(c => c.id_domaine === parseInt(newDomain));
              if (catsForDomain.length > 0) {
                setSelectedCategory(String(catsForDomain[0].id_categorie));
              } else {
                setSelectedCategory("");
              }
            }}
            className="filter-select"
          >
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
            {filteredCategories.map(category => (
              <option key={category.id_categorie} value={category.id_categorie}>
                {category.nom_categorie}
              </option>
            ))}
          </select>

          <button 
            className="refresh-btn" 
            onClick={fetchProducts}
            title="Actualiser"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Stats */}
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
          <button onClick={() => setError(null)}>Fermer</button>
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          <strong>✅ Succès</strong>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Filters info */}
      {(searchTerm || selectedCategory || selectedDomain) && (
        <div className="filters-info">
          <span>
            🔍 Filtres actifs :
            {selectedDomain && <strong> {domains.find(d => d.id_domaine === parseInt(selectedDomain))?.nom_domaine}</strong>}
            {selectedCategory && <strong> / {getCategoryName(parseInt(selectedCategory))}</strong>}
            {searchTerm && <strong> / "{searchTerm}"</strong>}
            <span className="filter-count"> ({filteredProducts.length} produit(s))</span>
          </span>
          <button onClick={handleClearFilters}>✕ Réinitialiser</button>
        </div>
      )}

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>Aucun produit trouvé dans cette catégorie</p>
        </div>
      ) : (
        <div className="products-list">
          {filteredProducts.map((product) => {
            const images = getAllImages(product);
            return (
              <div className="product-card" key={`product-${product.id_produit}`}>
                <div className="product-image">
                  <img
                    src={getFirstImage(product) ? getImageUrl(getFirstImage(product)) : "https://via.placeholder.com/120x120?text=Pas+d'image"}
                    alt={product.nom_produit}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/120x120?text=Image+non+trouvée"; }}
                  />
                  {images.length > 1 && (
                    <span className="image-count">+{images.length - 1}</span>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-header">
                    <h3>{product.nom_produit}</h3>
                    <span className={`status-badge ${
                      product.expertise_approuved_produit ? 'actif' : 
                      product.a_expertise_produit ? 'en_attente' : 'refuse'
                    }`}>
                      {product.expertise_approuved_produit && '✅ APPROUVÉ'}
                      {!product.expertise_approuved_produit && product.a_expertise_produit && '⏳ EN ATTENTE'}
                      {!product.a_expertise_produit && '❌ SANS EXPERTISE'}
                    </span>
                  </div>

                  <div className="product-details">
                    <div className="detail-row">
                      <span className="detail-label">💰 Prix départ :</span>
                      <span className="detail-value">{formatPrice(product.prix_debut_produit)}</span>
                    </div>
                    {product.prix_fin_produit && (
                      <div className="detail-row">
                        <span className="detail-label">💰 Prix final :</span>
                        <span className="detail-value">{formatPrice(product.prix_fin_produit)}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">📂 Domaine :</span>
                      <span className="detail-value">{product.nom_domaine || "Domaine inconnu"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🏷️ Catégorie :</span>
                      <span className="detail-value">{product.nom_categorie || getCategoryName(product.id_categorie_produit)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📅 Date :</span>
                      <span className="detail-value">{formatDate(product.date_publication_produit)}</span>
                    </div>
                    {product.description_produit && (
                      <div className="detail-row description">
                        <span className="detail-label">📝 Description :</span>
                        <span className="detail-value">{product.description_produit.substring(0, 100)}...</span>
                      </div>
                    )}
                  </div>

                  <div className="product-actions">
                    <button className="view-btn" onClick={() => openDetails(product)}>
                      👁️ Voir détails
                    </button>
                    {product.a_expertise_produit && !product.expertise_approuved_produit && (
                      <button className="validate-btn" onClick={() => validateProduct(product)}>
                        ✅ Approuver
                      </button>
                    )}
                    {product.a_expertise_produit && !product.expertise_approuved_produit && (
                      <button className="reject-btn" onClick={() => {
                        setSelectedProduct(product);
                        setShowRejectModal(true);
                      }}>
                        ❌ Refuser
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Détails avec Gallery */}
      {showDetailsModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Détails du produit</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {(() => {
                const images = getAllImages(selectedProduct);
                return images.length > 0 ? (
                  <div className="image-gallery">
                    <div className="gallery-main">
                      <img
                        src={getImageUrl(images[currentImageIndex])}
                        alt={`${selectedProduct.nom_produit} ${currentImageIndex + 1}`}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=Image+non+trouvée"; }}
                      />
                      {images.length > 1 && (
                        <>
                          <button 
                            className="gallery-nav prev" 
                            onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                          >
                            ‹
                          </button>
                          <button 
                            className="gallery-nav next" 
                            onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                          >
                            ›
                          </button>
                          <div className="gallery-counter">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>
                    {images.length > 1 && (
                      <div className="gallery-thumbnails">
                        {images.map((img, idx) => (
                          <img
                            key={idx}
                            src={getImageUrl(img)}
                            alt={`Miniature ${idx + 1}`}
                            className={idx === currentImageIndex ? 'active' : ''}
                            onClick={() => setCurrentImageIndex(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="detail-product-image">
                    <img src="https://via.placeholder.com/300x300?text=Pas+d'image" alt="Pas d'image" />
                  </div>
                );
              })()}

              <div className="detail-info">
                <h3>{selectedProduct.nom_produit}</h3>
                <p className="detail-price">{formatPrice(selectedProduct.prix_debut_produit)}</p>
                <div className="detail-grid">
                  <p><strong>📂 Domaine :</strong> {selectedProduct.nom_domaine || "Domaine inconnu"}</p>
                  <p><strong>🏷️ Catégorie :</strong> {selectedProduct.nom_categorie || getCategoryName(selectedProduct.id_categorie_produit)}</p>
                  <p><strong>📅 Date :</strong> {formatDate(selectedProduct.date_publication_produit)}</p>
                  <p><strong>🏷️ État :</strong> {selectedProduct.etat_produit}</p>
                  <p><strong>🔍 Expertise :</strong> 
                    {selectedProduct.expertise_approuved_produit ? ' ✅ Approuvée' : 
                     selectedProduct.a_expertise_produit ? ' ⏳ En attente' : ' ❌ Sans expertise'}
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
              <h2>❌ Refuser l'expertise</h2>
              <button className="modal-close" onClick={() => setShowRejectModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Produit : <strong>{selectedProduct.nom_produit}</strong></p>
              <label>Raison du refus :</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Indiquez pourquoi cette expertise est refusée..."
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