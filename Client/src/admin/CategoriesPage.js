import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoriesPage.css";

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/admin/categorie`;

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

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [formData, setFormData] = useState({
    id_categorie: null,
    nom_categorie: "",
    description_categorie: "",
    id_domaine: "",
    image_categorie: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    categorie: null,
    productCount: 0,
    loading: false
  });

  // 📥 Charger les catégories et les domaines
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/");
      if (response.data.success) {
        setCategories(response.data.categories || []);
        setError(null);
      } else {
        setCategories([]);
        setError(response.data.message || "Erreur de chargement");
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
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

  const fetchDomains = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/domaine/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
      });
      if (response.data.success) {
        const domainesList = response.data.domaines || [];
        setDomains(domainesList);

        // ✅ Auto-select first domain if none selected and domains exist
        if (domainesList.length > 0 && !selectedDomain) {
          setSelectedDomain(domainesList[0].id_domaine.toString());
        }
      }
    } catch (err) {
      console.error("Erreur chargement domaines:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDomains();
  }, []);

  // 🔍 Filtrer les catégories
  const filteredCategories = categories.filter((categorie) => {
    const matchSearch = categorie.nom_categorie?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDomain = selectedDomain ? categorie.id_domaine === parseInt(selectedDomain) : true;
    return matchSearch && matchDomain;
  });

  // 🔗 Obtenir le nom du domaine d'une catégorie
  const getDomainName = (id_domaine) => {
    const domain = domains.find(d => d.id_domaine === id_domaine);
    return domain ? domain.nom_domaine : "Domaine inconnu";
  };

  // 🖼️ Get image URL
  const getImageUrl = (filename) => {
    if (!filename) return null;
    return `http://localhost:5000/uploads/categories/${filename}`;
  };

  // Count products for a category
  const getProductCountForCategory = (id_categorie) => {
    const cat = categories.find(c => c.id_categorie === id_categorie);
    return cat?.product_count || cat?.nombre_produits || 0;
  };

  // 📝 Sauvegarder (ajout ou modification)
  const saveCategory = async () => {
    if (!formData.nom_categorie) {
      alert("Le nom de la catégorie est requis");
      return;
    }
    if (!formData.id_domaine) {
      alert("Veuillez sélectionner un domaine");
      return;
    }

    try {
      const data = new FormData();
      data.append("nom_categorie", formData.nom_categorie);
      data.append("description_categorie", formData.description_categorie);
      data.append("id_domaine", formData.id_domaine);

      if (selectedImage) {
        data.append("image", selectedImage);
      } else if (formData.id_categorie && formData.image_categorie) {
        data.append("keep_image", "true");
        data.append("existing_image", formData.image_categorie);
      }

      if (formData.id_categorie) {
        await axios.put(`${API_URL}/${formData.id_categorie}`, data, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        await axios.post(`${API_URL}/`, data, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      await fetchCategories();
      resetForm();
      setShowForm(false);
      setDeleteError(null);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      alert(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  // ✏️ Éditer une catégorie
  const editCategory = (categorie) => {
    setFormData({
      id_categorie: categorie.id_categorie,
      nom_categorie: categorie.nom_categorie,
      description_categorie: categorie.description_categorie || "",
      id_domaine: categorie.id_domaine.toString(),
      image_categorie: categorie.image_categorie || ""
    });
    setSelectedImage(null);
    setImagePreview(categorie.image_categorie ? getImageUrl(categorie.image_categorie) : null);
    setShowForm(true);
    setDeleteError(null);
  };

  // Open delete confirmation modal
  const openDeleteModal = async (categorie) => {
    setDeleteModal({ open: true, categorie, productCount: 0, loading: true });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/categorie/${categorie.id_categorie}/products/count`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      setDeleteModal(prev => ({
        ...prev,
        productCount: response.data?.count || 0,
        loading: false
      }));
    } catch (err) {
      const count = getProductCountForCategory(categorie.id_categorie);
      setDeleteModal(prev => ({
        ...prev,
        productCount: count,
        loading: false
      }));
    }
  };

  // Confirm and execute delete
  const confirmDelete = async () => {
    const { categorie } = deleteModal;
    if (!categorie) return;

    try {
      await api.delete(`/${categorie.id_categorie}`);
      await fetchCategories();
      setDeleteError(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      if (err.response?.status === 409) {
        setDeleteError(`❌ Impossible de supprimer la catégorie "${categorie.nom_categorie}". Des produits y sont encore associés.`);
      } else {
        setDeleteError(err.response?.data?.message || "Erreur lors de la suppression");
      }
      setTimeout(() => setDeleteError(null), 5000);
    } finally {
      setDeleteModal({ open: false, categorie: null, productCount: 0, loading: false });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, categorie: null, productCount: 0, loading: false });
  };

  // 🖼️ Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected new image (revert to existing)
  const handleRemoveNewImage = () => {
    setSelectedImage(null);
    if (formData.image_categorie) {
      setImagePreview(getImageUrl(formData.image_categorie));
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id_categorie: null,
      nom_categorie: "",
      description_categorie: "",
      id_domaine: "",
      image_categorie: ""
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    // ✅ Keep the selected domain, don't clear it
    fetchCategories();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    // ✅ Keep the selected domain, only clear search
  };

  // ✅ Get current selected domain name for display
  const getSelectedDomainName = () => {
    const domain = domains.find(d => d.id_domaine === parseInt(selectedDomain));
    return domain ? domain.nom_domaine : "";
  };

  if (loading) {
    return (
      <div className="categories-page" style={{ textAlign: "center", padding: "60px" }}>
        ⏳ Chargement des catégories...
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="header">
        <h1>Gestion des catégories</h1>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* ✅ Domain filter - first domain selected by default, no "All" option */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="filter-select"
          >
            {domains.map(domain => (
              <option key={domain.id_domaine} value={domain.id_domaine}>
                {domain.nom_domaine}
              </option>
            ))}
          </select>

          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Actualiser
          </button>

          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              // ✅ Pre-fill domain in form with currently selected domain
              if (selectedDomain) {
                setFormData(prev => ({ ...prev, id_domaine: selectedDomain }));
              }
              setShowForm(true);
              setDeleteError(null);
            }}
          >
            + Ajouter une catégorie
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>❌ Erreur</strong>
          <p>{error}</p>
          <button onClick={fetchCategories}>Réessayer</button>
        </div>
      )}

      {deleteError && (
        <div className="error-banner delete-error">
          <strong>⚠️ Suppression impossible</strong>
          <p>{deleteError}</p>
        </div>
      )}

      {/* ✅ Show domain info banner */}
      {selectedDomain && (
        <div className="domain-info-banner">
          <span>📁 Domaine sélectionné : <strong>{getSelectedDomainName()}</strong></span>
          <span className="category-count">{filteredCategories.length} catégorie(s)</span>
        </div>
      )}

      {/* Indicateur de filtres de recherche */}
      {searchTerm && (
        <div className="filters-info">
          <span>
            🔍 Recherche : <strong>"{searchTerm}"</strong>
            ({filteredCategories.length} résultat(s))
          </span>
          <button onClick={handleClearFilters}>✕ Effacer la recherche</button>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="category-form-card">
          <h3>{formData.id_categorie ? "✏️ Modifier la catégorie" : "➕ Nouvelle catégorie"}</h3>

          {/* 🖼️ Image Upload */}
          <div className="form-group image-upload-group">
            <label>Image de la catégorie</label>
            <div className="image-preview-container">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Aperçu" 
                  className="image-preview"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/200x150?text=Image+non+disponible"; }}
                />
              ) : (
                <div className="image-placeholder">
                  <span>📷 Aucune image</span>
                </div>
              )}
            </div>

            <div className="image-input-actions">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
                id="category-image-input"
              />

              {(selectedImage || (formData.id_categorie && formData.image_categorie && imagePreview)) && (
                <button 
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveNewImage}
                >
                  🗑️ {selectedImage ? "Annuler la nouvelle image" : "Supprimer l'image"}
                </button>
              )}
            </div>

            {selectedImage && (
              <p className="file-name">📎 {selectedImage.name}</p>
            )}
            {formData.id_categorie && formData.image_categorie && !selectedImage && (
              <p className="file-name existing">💾 Image actuelle conservée</p>
            )}
          </div>

          <div className="form-group">
            <label>Nom de la catégorie *</label>
            <input
              type="text"
              placeholder="Ex: Smartphones, PC Portables, Accessoires..."
              value={formData.nom_categorie}
              onChange={(e) => setFormData({ ...formData, nom_categorie: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Domaine parent *</label>
            <select
              value={formData.id_domaine}
              onChange={(e) => setFormData({ ...formData, id_domaine: e.target.value })}
            >
              <option value="">Sélectionner un domaine</option>
              {domains.map(domain => (
                <option key={domain.id_domaine} value={domain.id_domaine}>
                  {domain.nom_domaine}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description (optionnelle)</label>
            <textarea
              placeholder="Description de la catégorie..."
              value={formData.description_categorie}
              onChange={(e) => setFormData({ ...formData, description_categorie: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={saveCategory}>
              {formData.id_categorie ? "Mettre à jour" : "Ajouter"}
            </button>
            <button 
              className="cancel-btn" 
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ✅ Show message when no domain selected (shouldn't happen with auto-select, but just in case) */}
      {!selectedDomain && domains.length > 0 ? (
        <div className="empty-state">
          <p>📂 Veuillez sélectionner un domaine pour voir les catégories.</p>
        </div>
      ) : filteredCategories.length === 0 && !showForm ? (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <p>❌ Aucune catégorie ne correspond à la recherche dans <strong>{getSelectedDomainName()}</strong></p>
              <button className="add-btn" onClick={handleClearFilters}>
                Effacer la recherche
              </button>
            </>
          ) : (
            <>
              <p>📂 Aucune catégorie dans <strong>{getSelectedDomainName()}</strong> pour le moment.</p>
              <button className="add-btn" onClick={() => {
                resetForm();
                if (selectedDomain) {
                  setFormData(prev => ({ ...prev, id_domaine: selectedDomain }));
                }
                setShowForm(true);
              }}>
                + Ajouter une catégorie
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map((categorie) => (
            <div className="category-card" key={`categorie-${categorie.id_categorie}`}>
              {/* 🖼️ Category Image */}
              <div className="category-image">
                <img
                  src={categorie.image_categorie ? getImageUrl(categorie.image_categorie) : "https://via.placeholder.com/300x180?text=Pas+d'image"}
                  alt={categorie.nom_categorie}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x180?text=Image+non+trouvée"; }}
                />
              </div>

              <div className="category-header">
                <h3>{categorie.nom_categorie}</h3>
                <span className="domain-badge">
                  {getDomainName(categorie.id_domaine)}
                </span>
              </div>

              <p className="category-description">
                {categorie.description_categorie || "Aucune description"}
              </p>

              <div className="category-meta">
                <span className="meta-label">ID: {categorie.id_categorie}</span>
              </div>

              <div className="category-actions">
                <button className="edit-btn" onClick={() => editCategory(categorie)}>
                  ✏️ Modifier
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => openDeleteModal(categorie)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      {deleteModal.open && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Confirmer la suppression</h3>
              <button className="modal-close" onClick={closeDeleteModal}>×</button>
            </div>

            <div className="modal-body">
              {deleteModal.loading ? (
                <p>⏳ Chargement des informations...</p>
              ) : (
                <>
                  <p>
                    Vous êtes sur le point de supprimer la catégorie :
                    <br />
                    <strong>"{deleteModal.categorie?.nom_categorie}"</strong>
                  </p>

                  <div className={`warning-box ${deleteModal.productCount > 0 ? 'danger' : 'info'}`}>
                    <span className="warning-icon">
                      {deleteModal.productCount > 0 ? '🔴' : '🟢'}
                    </span>
                    <div>
                      <strong>
                        {deleteModal.productCount > 0 
                          ? `Cette catégorie contient ${deleteModal.productCount} produit(s)` 
                          : "Cette catégorie ne contient aucun produit"}
                      </strong>
                      {deleteModal.productCount > 0 && (
                        <p className="warning-detail">
                          ⚠️ <strong>Attention :</strong> La suppression de cette catégorie 
                          entraînera la suppression définitive de <strong>{deleteModal.productCount} produit(s)</strong> associé(s).
                          Cette action est <strong>irréversible</strong>.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={closeDeleteModal}
                disabled={deleteModal.loading}
              >
                Annuler
              </button>
              <button 
                className={`confirm-delete-btn ${deleteModal.productCount > 0 ? 'danger' : ''}`}
                onClick={confirmDelete}
                disabled={deleteModal.loading}
              >
                {deleteModal.productCount > 0 
                  ? `🗑️ Supprimer (${deleteModal.productCount} produit(s))` 
                  : "🗑️ Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;