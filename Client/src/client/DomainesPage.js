// client/DomainesPage.js
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import './DomainesPage.css';

const DomainesPage = ({ onNavigate }) => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/domaines');
        const data = await response.json();
        if (response.ok) {
          setDomains(data);
        } else {
          setError('Erreur lors du chargement des domaines');
        }
      } catch (err) {
        setError('Impossible de contacter le serveur');
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  // Données fictives si l'API n'est pas disponible
  const defaultDomains = [
    { 
      id: 1, 
      nom: 'Art', 
      description: 'Explorer vos œuvres où la créativité prend vie. Une collection d\'œuvres usagées qui apportent l\'éclat de ...',
      categories_count: 2
    },
    { 
      id: 2, 
      nom: 'Collection', 
      description: 'Plongez au cœur d\'une passion dévorante. Découvrez des pièces rares et des ensembles soigneusement créatifs pour ...',
      categories_count: 3
    },
    { 
      id: 3, 
      nom: 'Accessoires', 
      description: 'La touche finale qui fait la différence. Des compléments élégants et fonctionnels conçus pour ...',
      categories_count: 2
    },
    { 
      id: 4, 
      nom: 'Technologie', 
      description: 'À la pointe de l\'innovation. Cet espace est dédié aux outils et aux avancées qui façonnent notre monde moderne et ...',
      categories_count: 2
    },
  ];

  const displayDomains = domains.length > 0 ? domains : defaultDomains;

  // Fonction pour gérer le clic sur une carte domaine
  const handleDomainClick = (domain) => {
    // Rediriger vers les catégories avec le nom du domaine
    onNavigate?.('categories');
  };

  if (loading) {
    return (
      <div className="domaines-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement des domaines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="domaines-page">
      {/* Header */}
      <div className="domaines-header">
        <h1>Nos Domaines</h1>
        <p className="domaines-subtitle">
          Découvrez notre sélection d'objets de collection organisée par domaines
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Domaines Grid */}
      <div className="domaines-grid">
        {displayDomains.map((domain) => (
          <div 
            className="domaine-card" 
            key={domain.id}
            onClick={() => handleDomainClick(domain)}
          >
            <div className="domaine-card-content">
              <h3>{domain.nom}</h3>
              <p>{domain.description}</p>
              <div className="domaine-meta">
                <span className="categories-count">
                  {domain.categories_count || domain.categories?.length || 0} catégorie(s)
                </span>
              </div>
              <button 
                className="btn-explorer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDomainClick(domain);
                }}
              >
                Explorer
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainesPage;