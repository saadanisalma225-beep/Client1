// client/components/CollectionsSection.js
import React from 'react';
import { Gavel, ChevronRight, Rug, Vase, Ring, ShoppingBag } from 'lucide-react';
import './CollectionsSection.css';

const CollectionsSection = ({ onNavigate }) => {
  // Données des collections
  const collections = [
    {
      id: 1,
      nom: 'Tapis Berbères',
      enchères: 24,
      icon: Rug,
      color: '#3182ce',
      bgColor: '#ebf8ff'
    },
    {
      id: 2,
      nom: 'Poteries et Canapés',
      enchères: 89,
      icon: Vase,
      color: '#38a169',
      bgColor: '#f0fff4'
    },
    {
      id: 3,
      nom: 'Bijoux Traditionnels',
      enchères: 56,
      icon: Ring,
      color: '#805ad5',
      bgColor: '#faf5ff'
    },
    {
      id: 4,
      nom: 'Cuirs et Poupées',
      enchères: 67,
      icon: ShoppingBag,
      color: '#ed8936',
      bgColor: '#fffbeb'
    }
  ];

  const handleExplore = (collectionId) => {
    // Navigation vers la page des catégories ou des enchères de cette collection
    if (onNavigate) {
      onNavigate('categories', { collectionId });
    }
  };

  return (
    <section className="collections-section">
      <div className="collections-container">
        {/* Header */}
        <div className="collections-header">
          <div className="collections-tag">
            <Gavel size={14} strokeWidth={2} />
            <span>Collections</span>
          </div>
          <h1 className="collections-title">Explorez nos collections</h1>
          <p className="collections-subtitle">
            Des trésors artisanaux soigneusement sélectionnés pour vous
          </p>
        </div>

        {/* Grid */}
        <div className="collections-grid">
          {collections.map((collection) => {
            const Icon = collection.icon;
            return (
              <div 
                key={collection.id}
                className="collection-card"
                onClick={() => handleExplore(collection.id)}
              >
                <div 
                  className="collection-icon-wrapper"
                  style={{ 
                    backgroundColor: collection.bgColor,
                    color: collection.color 
                  }}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
                <h3 className="collection-name">{collection.nom}</h3>
                <div className="collection-encheres">
                  <Gavel size={14} strokeWidth={2} />
                  <span>{collection.enchères} enchères</span>
                </div>
                <button 
                  className="btn-explorer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExplore(collection.id);
                  }}
                >
                  Explorer
                  <ChevronRight size={16} strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;