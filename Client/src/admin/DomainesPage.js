import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DomainesPage.css";

// ========== CORRECTIONS IMPORTANTES ==========
// 1. URL corrigée : /api/admin/domaine (au lieu de /api/domaines)
// 2. Token corrigé : "adminToken" (au lieu de "token")
// 3. Gestion d'image améliorée avec nettoyage mémoire
// =============================================

const API_BASE_URL = "http://localhost:5000/api";
const API_URL = `${API_BASE_URL}/admin/domaine`;  // ✅ CORRIGÉ

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
    // ✅ CORRIGÉ: utiliser "adminToken" au lieu de "token"
    const token = localStorage.getItem("adminToken");
    console.log("🔑 Token présent:", !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Erreur interceptor:", error);
    return Promise.reject(error);
  }
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
    image_domaine: null,
    imagePreview: null
  });

  // 📥 Charger les domaines depuis l'API
  const fetchDomaines = async () => {
    setLoading(true);
    console.log("📡 Appel API:", API_URL);
    
    try {
      const response = await api.get("/");
      console.log("✅ Réponse reçue:", response.data);
      
      if (response.data.success) {
        setDomains(response.data.domaines || []);
        setError(null);
      } else {
        setDomains([]);
        setError("Erreur: " + (response.data.message || "Données invalides"));
      }
    } catch (err) {
      console.error("❌ Erreur détaillée:", err);
      
      // Messages d'erreur précis
      if (err.code === 'ERR_NETWORK') {
        setError("❌ Impossible de joindre le serveur. Vérifiez que le backend tourne sur http://localhost:5000");
      } else if (err.response?.status === 401) {
        setError("❌ Non authentifié. Veuillez vous reconnecter.");
      } else if (err.response?.status === 404) {
        setError("❌ API non trouvée. Vérifiez l'URL: /api/admin/domaine");
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

  // 📝 Sauvegarder (ajout ou modification)
  const saveDomain = async () => {
    if (!formData.nom_domaine) {
      alert("Le nom du domaine est requis");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("nom_domaine", formData.nom_domaine);
      submitData.append("description_domaine", formData.description_domaine || "");
      
      if (formData.image_domaine instanceof File) {
        submitData.append("image", formData.image_domaine);
      }

      if (formData.id_domaine) {
        // Mode modification
        await api.put(`/${formData.id_domaine}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // Mode ajout
        await api.post("/", submitData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      await fetchDomaines();
      
      // Réinitialiser le formulaire
      setFormData({
        id_domaine: null,
        nom_domaine: "",
        description_domaine: "",
        image_domaine: null,
        imagePreview: null
      });
      setShowForm(false);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      alert(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  // ✏️ Éditer un domaine
  const editDomain = (domain) => {
    setFormData({
      id_domaine: domain.id_domaine,
      nom_domaine: domain.nom_domaine,
      description_domaine: domain.description_domaine || "",
      image_domaine: null,
      imagePreview: domain.image_domaine 
        ? `http://localhost:5000/uploads/domaines/${domain.image_domaine}`
        : null
    });
    setShowForm(true);
  };

  // 🗑️ Supprimer un domaine
  const deleteDomain = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce domaine ?")) {
      try {
        await api.delete(`/${id}`);
        await fetchDomaines();
      } catch (err) {
        console.error("Erreur suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // 🖼️ Gérer la sélection d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Nettoyer l'ancienne preview si elle existe
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      
      setFormData({
        ...formData,
        image_domaine: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  // Nettoyage des URLs ObjectURL au démontage
  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

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

          <button className="add-btn" onClick={handleRefresh}>
            🔄 Actualiser
          </button>

          <button
            className="add-btn"
            onClick={() => {
              setFormData({
                id_domaine: null,
                nom_domaine: "",
                description_domaine: "",
                image_domaine: null,
                imagePreview: null
              });
              setShowForm(true);
            }}
          >
            + Ajouter un domaine
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: "#ffebee",
          color: "#c62828",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #ffcdd2"
        }}>
          <strong>❌ Erreur</strong>
          <p style={{ marginTop: "5px", marginBottom: "0" }}>{error}</p>
          <button 
            onClick={fetchDomaines}
            style={{
              marginTop: "10px",
              background: "#c62828",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Indicateur de recherche */}
      {searchTerm && (
        <div style={{
          background: "#e3f2fd",
          padding: "10px 15px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <span>
            🔍 Résultats : <strong>"{searchTerm}"</strong> ({filteredDomains.length} domaine(s))
          </span>
          <button
            onClick={handleClearSearch}
            style={{
              background: "#1976d2",
              border: "none",
              color: "white",
              padding: "5px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            ✕ Effacer
          </button>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="domain-card">
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
            <input
              type="text"
              placeholder="Nom du domaine *"
              value={formData.nom_domaine}
              onChange={(e) => setFormData({ ...formData, nom_domaine: e.target.value })}
            />

            <textarea
              placeholder="Description du domaine"
              value={formData.description_domaine}
              onChange={(e) => setFormData({ ...formData, description_domaine: e.target.value })}
              rows="4"
            />

            {formData.imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img 
                  src={formData.imagePreview} 
                  alt="Aperçu" 
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="add-btn" onClick={saveDomain}>
                {formData.id_domaine ? "Mettre à jour" : "Ajouter"}
              </button>
              <button 
                className="delete-btn" 
                onClick={() => setShowForm(false)}
                style={{ background: "#ccc", borderColor: "#ccc", color: "#333" }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des domaines */}
      {filteredDomains.length === 0 && !showForm ? (
        <div style={{
          textAlign: "center",
          padding: "60px",
          color: "#666",
          background: "white",
          borderRadius: "15px"
        }}>
          {searchTerm ? (
            <>
              <p>❌ Aucun domaine trouvé pour <strong>"{searchTerm}"</strong></p>
              <button className="add-btn" onClick={handleRefresh} style={{ marginTop: "15px" }}>
                Afficher tous les domaines
              </button>
            </>
          ) : (
            <>
              <p>📂 Aucun domaine pour le moment.</p>
              <button className="add-btn" onClick={() => setShowForm(true)} style={{ marginTop: "15px" }}>
                + Ajouter votre premier domaine
              </button>
            </>
          )}
        </div>
      ) : (
        // ✅ Clés uniques avec préfixe pour éviter les conflits
        filteredDomains.map((domain) => (
          <div className="domain-card" key={`domaine-${domain.id_domaine}`}>
            <div className="domain-image">
              <img
                src={
                  domain.image_domaine 
                    ? `http://localhost:5000/uploads/domaines/${domain.image_domaine}`
                    : "https://via.placeholder.com/250?text=Pas+d'image"
                }
                alt={domain.nom_domaine}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/250?text=Image+non+trouvée";
                }}
              />
            </div>

            <div className="domain-info">
              <h2>{domain.nom_domaine}</h2>
              <p>{domain.description_domaine || "Aucune description"}</p>

              <div className="actions">
                <button className="edit-btn" onClick={() => editDomain(domain)}>
                  ✏️ Modifier
                </button>
                <button className="delete-btn" onClick={() => deleteDomain(domain.id_domaine)}>
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DomainesPage;