// client/CategoriesPage.js
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import './CategoriesPage.css';

const CategoriesPage = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [domainName, setDomainName] = useState('Art');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Récupérer les catégories du domaine "Art" (id=1 par défaut)
        const response = await fetch('http://localhost:5000/api/categories?domaine_id=1');
        const data = await response.json();
        if (response.ok) {
          setCategories(data);
        } else {
          setError('Erreur lors du chargement des catégories');
        }
      } catch (err) {
        setError('Impossible de contacter le serveur');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Données fictives si l'API n'est pas disponible
  const defaultCategories = [
    { 
      id: 1, 
      nom: 'Peintures', 
      description: "Divers d'art picturales et créations graphiques",
      enchères_activées: 0
    },
    { 
      id: 2, 
      nom: 'Sculptures', 
      description: "Formes artistiques ou trois dimensions, des créations aux acrobates.",
      enchères_activées: 0
    },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Fonction pour gérer le clic sur le bouton "Explorateur"
  const handleExplorerClick = (e) => {
    e.stopPropagation(); // Empêcher la propagation du clic
    onNavigate?.('domaines'); // Rediriger vers la page des domaines
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <h1>Catégories de {domainName}</h1>
        <p className="categories-subtitle">
          Explorez notre collection complète d'objets de collection
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="categories-grid">
        {displayCategories.map((category) => (
          <div 
            className="category-card" 
            key={category.id}
          >
            <div className="category-card-content">
              <h3>{category.nom}</h3>
              <p className="category-description">{category.description}</p>
              <div className="category-meta">
                <span className="encheres-count">
                  {category.enchères_activées || 0} achèvement activés
                </span>
              </div>
              <button 
                className="btn-explorer-category"
                onClick={handleExplorerClick} // ← MODIFIÉ : redirige vers Domaines
              >
                Explorateur
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;