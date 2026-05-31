import React, { useState } from "react";
import "./DomainesPage.css";

function DomainesPage() {

  const [domains, setDomains] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    intro: "",
    image: ""
  });

  const saveDomain = () => {

    if (!formData.name) return;

    if (formData.id) {

      setDomains(
        domains.map((domain) =>
          domain.id === formData.id
            ? formData
            : domain
        )
      );

    } else {

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

    setDomains(
      domains.filter(
        (domain) => domain.id !== id
      )
    );

  };

  const filteredDomains =
    domains.filter((domain) =>
      domain.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <div className="domains-page">

      <div className="header">

        <h1>Mes domaines</h1>

        <div className="header-actions">

          <button
            className="add-btn"
            onClick={() => {

              const value =
                prompt("Recherche domaine");

              setSearch(value || "");

            }}
          >
            Rechercher
          </button>

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
            Ajouter un domaine
          </button>

        </div>

      </div>

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
              placeholder="Nom domaine"
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

                const file =
                  e.target.files[0];

                if (file) {

                  const imageURL =
                    URL.createObjectURL(file);

                  setFormData({
                    ...formData,
                    image: imageURL
                  });

                }

              }}
            />

            <textarea
              placeholder="Introduction"
              value={formData.intro}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  intro: e.target.value
                })
              }
            />

            <button
              className="add-btn"
              onClick={saveDomain}
            >
              Sauvegarder
            </button>

          </div>

        </div>

      )}

      {filteredDomains.map((domain) => (

        <div
          className="domain-card"
          key={domain.id}
        >

          <div className="domain-image">

            <img
              src={
                domain.image ||
                "https://via.placeholder.com/250"
              }
              alt={domain.name}
            />

          </div>

          <div className="domain-info">

            <h2>{domain.name}</h2>

            <p>{domain.intro}</p>

            <div className="actions">

              <button
                className="edit-btn"
                onClick={() =>
                  editDomain(domain)
                }
              >
                Modifier
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteDomain(domain.id)
                }
              >
                Supprimer
              </button>

            </div>

          </div>

        </div>

      ))}

    </div>

  );

}

export default DomainesPage;