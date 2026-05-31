import React, { useState } from "react";
import "./DomainesPage.css";

function DomainesPage() {
  // État pour les domaines
  const [domains, setDomains] = useState([
    {
      id: 1,
      name: "Art",
      intro: "Un texte de présentation doit raconter une histoire (storytelling), définir l'inspiration principale et cibler les émotions du public.",
      image: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
    },
    {
      id: 2,
      name: "Musique",
      intro: "Découvrez les instruments de musique anciens et modernes, une collection unique pour les passionnés.",
      image: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
    },
    {
      id: 3,
      name: "Littérature",
      intro: "Livres rares, manuscrits anciens et premières éditions pour les collectionneurs avertis.",
      image: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    intro: "",
    image: ""
  });

  // Filtrer les domaines selon le terme de recherche
  const filteredDomains = domains.filter((domain) =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour actualiser/afficher tous les domaines
  const handleRefresh = () => {
    setSearchTerm("");  // Vide la recherche => affiche tous les domaines
  };

  // Fonction pour vider la recherche
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const saveDomain = () => {
    if (!formData.name) return;

    if (formData.id) {
      // Modification
      setDomains(
        domains.map((domain) =>
          domain.id === formData.id ? formData : domain
        )
      );
    } else {
      // Ajout
      setDomains([
        ...domains,
        {
          ...formData,
          id: Date.now()
        }
      ]);
    }

    setFormData({
      id: null,
      name: "",
      intro: "",
      image: ""
    });
    setShowForm(false);
  };

  const editDomain = (domain) => {
    setFormData(domain);
    setShowForm(true);
  };

  const deleteDomain = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce domaine ?")) {
      setDomains(domains.filter((domain) => domain.id !== id));
      // Si après suppression il n'y a plus de résultats, on peut garder la recherche ou l'effacer
    }
  };

  return (
    <div className="domains-page">
      <div className="header">
        <h1>Mes domaines</h1>

        <div className="header-actions">
          {/* Champ de recherche - recherche en temps réel */}
          <input
            type="text"
            placeholder="Rechercher un domaine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Bouton Actualiser - Affiche TOUS les domaines */}
          <button className="add-btn" onClick={handleRefresh}>
            🔄 Actualiser
          </button>

          {/* Bouton Ajouter */}
          <button
            className="add-btn"
            onClick={() => {
              setFormData({
                id: null,
                name: "",
                intro: "",
                image: ""
              });
              setShowForm(true);
            }}
          >
            + Ajouter un domaine
          </button>
        </div>
      </div>

      {/* Indicateur de recherche active */}
      {searchTerm && (
        <div style={{
          background: "#e3f2fd",
          padding: "10px 15px",
          borderRadius: "8px",
          marginBottom: "20px",
          color: "#1976d2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <span>
            🔍 Résultats pour : <strong>"{searchTerm}"</strong> ({filteredDomains.length} domaine(s) trouvé(s))
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
            ✕ Effacer la recherche
          </button>
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="domain-card">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%"
            }}
          >
            <input
              type="text"
              placeholder="Nom du domaine"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageURL = URL.createObjectURL(file);
                  setFormData({
                    ...formData,
                    image: imageURL
                  });
                }
              }}
            />

            <textarea
              placeholder="Description / Introduction"
              value={formData.intro}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  intro: e.target.value
                })
              }
              rows="4"
            />

            <button className="add-btn" onClick={saveDomain}>
              Sauvegarder
            </button>
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
        filteredDomains.map((domain) => (
          <div className="domain-card" key={domain.id}>
            <div className="domain-image">
              <img
                src={domain.image || "https://via.placeholder.com/250"}
                alt={domain.name}
              />
            </div>

            <div className="domain-info">
              <h2>{domain.name}</h2>
              <p>{domain.intro}</p>

              <div className="actions">
                <button className="edit-btn" onClick={() => editDomain(domain)}>
                  ✏️ Modifier
                </button>
                <button className="delete-btn" onClick={() => deleteDomain(domain.id)}>
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