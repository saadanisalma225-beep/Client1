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
    id_domaine: ""
  });
  const [deleteError, setDeleteError] = useState(null);

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
        setDomains(response.data.domaines || []);
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
      if (formData.id_categorie) {
        // Mode modification
        await api.put(`/${formData.id_categorie}`, {
          nom_categorie: formData.nom_categorie,
          description_categorie: formData.description_categorie,
          id_domaine: formData.id_domaine
        });
      } else {
        // Mode ajout
        await api.post("/", {
          nom_categorie: formData.nom_categorie,
          description_categorie: formData.description_categorie,
          id_domaine: formData.id_domaine
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
      id_domaine: categorie.id_domaine.toString()
    });
    setShowForm(true);
    setDeleteError(null);
  };

  // 🗑️ Supprimer une catégorie
  const deleteCategory = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${nom}" ?`)) {
      try {
        await api.delete(`/${id}`);
        await fetchCategories();
        setDeleteError(null);
      } catch (err) {
        console.error("Erreur suppression:", err);
        if (err.response?.status === 409) {
          setDeleteError(`❌ Impossible de supprimer la catégorie "${nom}". Des produits y sont encore associés.`);
        } else {
          setDeleteError(err.response?.data?.message || "Erreur lors de la suppression");
        }
        // Effacer le message après 5 secondes
        setTimeout(() => setDeleteError(null), 5000);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_categorie: null,
      nom_categorie: "",
      description_categorie: "",
      id_domaine: ""
    });
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedDomain("");
    fetchCategories();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDomain("");
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

          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Actualiser
          </button>

          <button
            className="add-btn"
            onClick={() => {
              resetForm();
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

      {/* Indicateur de filtres */}
      {(searchTerm || selectedDomain) && (
        <div className="filters-info">
          <span>
            🔍 Filtres actifs : 
            {searchTerm && <strong> "{searchTerm}"</strong>}
            {selectedDomain && <strong> {domains.find(d => d.id_domaine === parseInt(selectedDomain))?.nom_domaine}</strong>}
            ({filteredCategories.length} catégorie(s))
          </span>
          <button onClick={handleClearFilters}>✕ Effacer les filtres</button>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="category-form-card">
          <h3>{formData.id_categorie ? "✏️ Modifier la catégorie" : "➕ Nouvelle catégorie"}</h3>
          
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

      {/* Liste des catégories */}
      {filteredCategories.length === 0 && !showForm ? (
        <div className="empty-state">
          {searchTerm || selectedDomain ? (
            <>
              <p>❌ Aucune catégorie ne correspond aux filtres</p>
              <button className="add-btn" onClick={handleClearFilters}>
                Afficher toutes les catégories
              </button>
            </>
          ) : (
            <>
              <p>📂 Aucune catégorie pour le moment.</p>
              <button className="add-btn" onClick={() => setShowForm(true)}>
                + Ajouter votre première catégorie
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map((categorie) => (
            <div className="category-card" key={`categorie-${categorie.id_categorie}`}>
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
                  onClick={() => deleteCategory(categorie.id_categorie, categorie.nom_categorie)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;