import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./DomainesPage.css";

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/admin/domaine`;

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

function DomainesPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id_domaine: null,
    nom_domaine: "",
    description_domaine: "",
    image_domaine: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Ref for scrolling to form
  const formRef = useRef(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    domaine: null,
    categoryCount: 0,
    productCount: 0,
    loading: false
  });

  // 📥 Charger les domaines
  const fetchDomaines = async () => {
    setLoading(true);
    try {
      const response = await api.get("/");
      if (response.data.success) {
        setDomains(response.data.domaines || []);
        setError(null);
      } else {
        setDomains([]);
        setError(response.data.message || "Erreur de chargement");
      }
    } catch (err) {
      console.error("Erreur chargement domaines:", err);
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

  useEffect(() => {
    fetchDomaines();
  }, []);

  // 🔍 Filtrer les domaines
  const filteredDomains = domains.filter((domain) =>
    domain.nom_domaine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setSearchTerm("");
    fetchDomaines();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // 🖼️ Get image URL
  const getImageUrl = (filename) => {
    if (!filename) return null;
    return `http://localhost:5000/uploads/domaines/${filename}`;
  };

  // 📝 Sauvegarder (ajout ou modification)
  const saveDomain = async () => {
    if (!formData.nom_domaine) {
      alert("Le nom du domaine est requis");
      return;
    }

    try {
      const data = new FormData();
      data.append("nom_domaine", formData.nom_domaine);
      data.append("description_domaine", formData.description_domaine || "");

      if (selectedImage) {
        data.append("image", selectedImage);
      } else if (formData.id_domaine && formData.image_domaine) {
        data.append("keep_image", "true");
        data.append("existing_image", formData.image_domaine);
      }

      if (formData.id_domaine) {
        await axios.put(`${API_URL}/${formData.id_domaine}`, data, {
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

      await fetchDomaines();
      resetForm();
      setShowForm(false);
      setDeleteError(null);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      alert(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  // ✏️ Éditer un domaine + scroll to form
  const editDomain = (domain) => {
    setFormData({
      id_domaine: domain.id_domaine,
      nom_domaine: domain.nom_domaine,
      description_domaine: domain.description_domaine || "",
      image_domaine: domain.image_domaine || ""
    });
    setSelectedImage(null);
    setImagePreview(domain.image_domaine ? getImageUrl(domain.image_domaine) : null);
    setShowForm(true);
    setDeleteError(null);

    // ✅ Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ─── Open delete confirmation modal ───
  const openDeleteModal = async (domaine) => {
    setDeleteModal({ open: true, domaine, categoryCount: 0, productCount: 0, loading: true });

    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/domaine/${domaine.id_domaine}/stats`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      setDeleteModal(prev => ({
        ...prev,
        categoryCount: response.data?.categoryCount || 0,
        productCount: response.data?.productCount || 0,
        loading: false
      }));
    } catch (err) {
      setDeleteModal(prev => ({
        ...prev,
        categoryCount: 0,
        productCount: 0,
        loading: false
      }));
    }
  };

  // ─── Confirm and execute delete ───
  const confirmDelete = async () => {
    const { domaine } = deleteModal;
    if (!domaine) return;

    try {
      await api.delete(`/${domaine.id_domaine}`);
      await fetchDomaines();
      setDeleteError(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      setDeleteError(err.response?.data?.message || "Erreur lors de la suppression");
      setTimeout(() => setDeleteError(null), 5000);
    } finally {
      setDeleteModal({ open: false, domaine: null, categoryCount: 0, productCount: 0, loading: false });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, domaine: null, categoryCount: 0, productCount: 0, loading: false });
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
    if (formData.image_domaine) {
      setImagePreview(getImageUrl(formData.image_domaine));
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id_domaine: null,
      nom_domaine: "",
      description_domaine: "",
      image_domaine: ""
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="domains-page" style={{ textAlign: "center", padding: "60px" }}>
        ⏳ Chargement des domaines...
      </div>
    );
  }

  return (
    <div className="domains-page">
      <div className="header">
        <h1>Mes domaines</h1>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Rechercher un domaine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Actualiser
          </button>

          <button
            className="add-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
              setDeleteError(null);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
          >
            + Ajouter un domaine
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>❌ Erreur</strong>
          <p>{error}</p>
          <button onClick={fetchDomaines}>Réessayer</button>
        </div>
      )}

      {deleteError && (
        <div className="error-banner delete-error">
          <strong>⚠️ Suppression impossible</strong>
          <p>{deleteError}</p>
        </div>
      )}

      {/* Indicateur de recherche */}
      {searchTerm && (
        <div className="filters-info">
          <span>
            🔍 Résultats : <strong>"{searchTerm}"</strong> ({filteredDomains.length} domaine(s))
          </span>
          <button onClick={handleClearSearch}>✕ Effacer</button>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="domain-form-card" ref={formRef}>
          <h3>{formData.id_domaine ? "✏️ Modifier le domaine" : "➕ Nouveau domaine"}</h3>

          {/* 🖼️ Image Upload */}
          <div className="form-group image-upload-group">
            <label>Image du domaine</label>
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
                id="domain-image-input"
              />

              {(selectedImage || (formData.id_domaine && formData.image_domaine && imagePreview)) && (
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
            {formData.id_domaine && formData.image_domaine && !selectedImage && (
              <p className="file-name existing">💾 Image actuelle conservée</p>
            )}
          </div>

          <div className="form-group">
            <label>Nom du domaine *</label>
            <input
              type="text"
              placeholder="Ex: Électronique, Mode, Maison..."
              value={formData.nom_domaine}
              onChange={(e) => setFormData({ ...formData, nom_domaine: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description (optionnelle)</label>
            <textarea
              placeholder="Description du domaine..."
              value={formData.description_domaine}
              onChange={(e) => setFormData({ ...formData, description_domaine: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={saveDomain}>
              {formData.id_domaine ? "Mettre à jour" : "Ajouter"}
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

      {/* Liste des domaines */}
      {filteredDomains.length === 0 && !showForm ? (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <p>❌ Aucun domaine trouvé pour <strong>"{searchTerm}"</strong></p>
              <button className="add-btn" onClick={handleClearSearch}>
                Afficher tous les domaines
              </button>
            </>
          ) : (
            <>
              <p>📂 Aucun domaine pour le moment.</p>
              <button className="add-btn" onClick={() => {
                resetForm();
                setShowForm(true);
                setTimeout(() => {
                  formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}>
                + Ajouter votre premier domaine
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="domains-grid">
          {filteredDomains.map((domain) => (
            <div className="domain-card" key={`domaine-${domain.id_domaine}`}>
              <div className="domain-image">
                <img
                  src={domain.image_domaine ? getImageUrl(domain.image_domaine) : "https://via.placeholder.com/300x180?text=Pas+d'image"}
                  alt={domain.nom_domaine}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x180?text=Image+non+trouvée"; }}
                />
              </div>

              <div className="domain-header">
                <h3>{domain.nom_domaine}</h3>
              </div>

              <p className="domain-description">
                {domain.description_domaine || "Aucune description"}
              </p>

              <div className="domain-meta">
                <span className="meta-label">ID: {domain.id_domaine}</span>
              </div>

              <div className="domain-actions">
                <button className="edit-btn" onClick={() => editDomain(domain)}>
                  ✏️ Modifier
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => openDeleteModal(domain)}
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
                    Vous êtes sur le point de supprimer le domaine :
                    <br />
                    <strong>"{deleteModal.domaine?.nom_domaine}"</strong>
                  </p>

                  <div className={`warning-box ${(deleteModal.categoryCount > 0 || deleteModal.productCount > 0) ? 'danger' : 'info'}`}>
                    <span className="warning-icon">
                      {(deleteModal.categoryCount > 0 || deleteModal.productCount > 0) ? '🔴' : '🟢'}
                    </span>
                    <div>
                      <strong>
                        {deleteModal.categoryCount > 0 
                          ? `Ce domaine contient ${deleteModal.categoryCount} catégorie(s)` 
                          : "Ce domaine ne contient aucune catégorie"}
                      </strong>

                      {deleteModal.categoryCount > 0 && deleteModal.productCount > 0 && (
                        <p className="warning-detail">
                          Dont <strong>{deleteModal.productCount} produit(s)</strong> au total
                        </p>
                      )}

                      {(deleteModal.categoryCount > 0 || deleteModal.productCount > 0) && (
                        <p className="warning-detail">
                          ⚠️ <strong>Attention :</strong> La suppression de ce domaine 
                          entraînera la suppression définitive de <strong>{deleteModal.categoryCount} catégorie(s)</strong> 
                          {deleteModal.productCount > 0 && (
                            <> et <strong>{deleteModal.productCount} produit(s)</strong></>
                          )} associé(s).
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
                className={`confirm-delete-btn ${(deleteModal.categoryCount > 0 || deleteModal.productCount > 0) ? 'danger' : ''}`}
                onClick={confirmDelete}
                disabled={deleteModal.loading}
              >
                {(deleteModal.categoryCount > 0 || deleteModal.productCount > 0)
                  ? `🗑️ Supprimer (${deleteModal.categoryCount} cat. / ${deleteModal.productCount} prod.)` 
                  : "🗑️ Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DomainesPage;