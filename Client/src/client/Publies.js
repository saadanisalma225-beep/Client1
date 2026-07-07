// client/Publies.js
import React, { useState, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText,
  Tag,
  Gavel,
  Clock,
  User,
  Calendar,
  Eye,
  Heart,
  Share2,
  Grid3X3,
  Package,
  FolderOpen,
  Layers
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import './Publies.css';

const Publier = ({ onNavigate }) => {
  // État de l'étape actuelle
  const [etape, setEtape] = useState(1);
  
  // État des données du domaine
  const [donneesDomaine, setDonneesDomaine] = useState({
    nom: '',
    description: '',
    image: null,
    apercuImage: null,
    parcours: null,
    nomParcours: ''
  });
  
  // État des erreurs
  const [erreurs, setErreurs] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [domaines, setDomaines] = useState([]);
  const [client, setClient] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [parcoursFile, setParcoursFile] = useState(null);

  // Récupérer l'utilisateur et les domaines
  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!encryptedUser || !token) {
      onNavigate?.('auth');
      return;
    }

    const user = decryptData(encryptedUser);
    if (!user) {
      onNavigate?.('auth');
      return;
    }

    setClient(user);
    fetchDomaines(token);
  }, [onNavigate]);

  const fetchDomaines = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/domaines', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDomaines(data);
      }
    } catch (error) {
      console.error('Erreur chargement domaines:', error);
      // Données fictives
      setDomaines([
        { id: 1, nom: 'Art', description: 'Explorer un univers où la créativité prend vie.', categories: [] },
        { id: 2, nom: 'Collection', description: 'Proposer au cœur d\'une passion dévouée.', categories: [] },
        { id: 3, nom: 'Accessoires', description: 'La touche finale qui fait la différence.', categories: [] }
      ]);
    }
  };

  // Gestion des changements de champs
  const handleChangement = (e) => {
    const { name, value } = e.target;
    setDonneesDomaine(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur lors de la modification
    if (erreurs[name]) {
      setErreurs(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Gestion du téléchargement d'image
  const handleTelechargementImage = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      // Vérifier la taille (max 5MB)
      if (fichier.size > 5 * 1024 * 1024) {
        setErreurs(prev => ({
          ...prev,
          image: 'L\'image ne doit pas dépasser 5 Mo'
        }));
        return;
      }
      
      // Vérifier le type
      if (!fichier.type.startsWith('image/')) {
        setErreurs(prev => ({
          ...prev,
          image: 'Veuillez sélectionner une image valide'
        }));
        return;
      }

      setImageFile(fichier);
      const lecteur = new FileReader();
      lecteur.onloadend = () => {
        setDonneesDomaine(prev => ({
          ...prev,
          image: fichier,
          apercuImage: lecteur.result
        }));
      };
      lecteur.readAsDataURL(fichier);
    }
  };

  // Gestion du téléchargement du parcours (PDF)
  const handleTelechargementParcours = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      // Vérifier la taille (max 10MB)
      if (fichier.size > 10 * 1024 * 1024) {
        setErreurs(prev => ({
          ...prev,
          parcours: 'Le fichier ne doit pas dépasser 10 Mo'
        }));
        return;
      }
      
      // Vérifier le type
      if (fichier.type !== 'application/pdf') {
        setErreurs(prev => ({
          ...prev,
          parcours: 'Veuillez sélectionner un fichier PDF valide'
        }));
        return;
      }

      setParcoursFile(fichier);
      setDonneesDomaine(prev => ({
        ...prev,
        parcours: fichier,
        nomParcours: fichier.name
      }));
    }
  };

  // Supprimer l'image
  const handleSupprimerImage = () => {
    setDonneesDomaine(prev => ({
      ...prev,
      image: null,
      apercuImage: null
    }));
    setImageFile(null);
  };

  // Supprimer le parcours
  const handleSupprimerParcours = () => {
    setDonneesDomaine(prev => ({
      ...prev,
      parcours: null,
      nomParcours: ''
    }));
    setParcoursFile(null);
  };

  // Validation du formulaire
  const validerFormulaire = () => {
    const nouvellesErreurs = {};
    
    if (!donneesDomaine.nom.trim()) {
      nouvellesErreurs.nom = 'Le nom du domaine est requis';
    }
    
    if (!donneesDomaine.description.trim()) {
      nouvellesErreurs.description = 'La description est requise';
    }
    
    if (!donneesDomaine.image) {
      nouvellesErreurs.image = 'L\'image est requise';
    }
    
    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  // Passer à l'étape suivante
  const handleSuivant = () => {
    if (!validerFormulaire()) {
      // Faire défiler jusqu'au premier champ en erreur
      const premierErreur = document.querySelector('.erreur');
      if (premierErreur) {
        premierErreur.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setEtape(2);
  };

  // Revenir à l'étape précédente
  const handlePrecedent = () => {
    setEtape(1);
  };

  // Aperçu du domaine
  const handleApercu = () => {
    onNavigate?.('domaine-detail', {
      ...donneesDomaine,
      id: 'preview'
    });
  };

  // Ajouter le domaine
  const handleAjouterDomaine = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nom', donneesDomaine.nom);
      formData.append('description', donneesDomaine.description);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (parcoursFile) {
        formData.append('parcours', parcoursFile);
      }

      const response = await fetch('http://localhost:5000/api/domaines', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          // Réinitialiser le formulaire
          setDonneesDomaine({
            nom: '',
            description: '',
            image: null,
            apercuImage: null,
            parcours: null,
            nomParcours: ''
          });
          setImageFile(null);
          setParcoursFile(null);
          setEtape(1);
          setSuccess(false);
          // Rediriger vers la page des domaines
          onNavigate?.('domaines');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de l\'ajout du domaine');
      }
    } catch (erreur) {
      console.error('Erreur lors de l\'ajout du domaine:', erreur);
      setError('Impossible de contacter le serveur');
    } finally {
      setLoading(false);
    }
  };

  // Afficher l'indicateur d'étapes
  const renderIndicateurEtapes = () => (
    <div className="indicateur-etapes">
      <div className={`point-etape ${etape >= 1 ? 'actif' : ''}`}>
        <span>1</span>
        <span className="label-etape">Informations</span>
      </div>
      <div className={`ligne-etape ${etape >= 2 ? 'actif' : ''}`}></div>
      <div className={`point-etape ${etape >= 2 ? 'actif' : ''}`}>
        <span>2</span>
        <span className="label-etape">Aperçu</span>
      </div>
    </div>
  );

  // Première étape : Formulaire de saisie
  const renderEtape1 = () => (
    <div className="contenu-etape">
      <div className="formulaire-header">
        <h2>📁 Ajouter un Domaine</h2>
        <p className="formulaire-sous-titre">
          Remplissez les informations ci-dessous pour ajouter un nouveau domaine
        </p>
      </div>

      {error && (
        <div className="message-erreur-global">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="formulaire-grid">
        {/* Nom du domaine */}
        <div className="groupe-formulaire full-width">
          <label htmlFor="nom">
            <FolderOpen size={16} />
            Nom du domaine *
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={donneesDomaine.nom}
            onChange={handleChangement}
            placeholder="Ex: Art, Collection, Accessoires..."
            className={erreurs.nom ? 'erreur' : ''}
          />
          {erreurs.nom && <span className="message-erreur">{erreurs.nom}</span>}
        </div>

        {/* Description */}
        <div className="groupe-formulaire full-width">
          <label htmlFor="description">
            <FileText size={16} />
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={donneesDomaine.description}
            onChange={handleChangement}
            placeholder="Décrivez ce domaine de collection..."
            rows="5"
            className={erreurs.description ? 'erreur' : ''}
          />
          {erreurs.description && <span className="message-erreur">{erreurs.description}</span>}
          <span className="compteur-caracteres">
            {donneesDomaine.description.length} / 2000 caractères
          </span>
        </div>

        {/* Image */}
        <div className="groupe-formulaire full-width">
          <label htmlFor="image">
            <Camera size={16} />
            Image du domaine *
          </label>
          <div className={`telechargement-image ${erreurs.image ? 'erreur' : ''}`}>
            {donneesDomaine.apercuImage ? (
              <div className="apercu-image-container">
                <img 
                  src={donneesDomaine.apercuImage} 
                  alt="Aperçu du domaine" 
                  className="apercu-image"
                />
                <button 
                  type="button"
                  className="btn-supprimer-image"
                  onClick={handleSupprimerImage}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label htmlFor="image" className="zone-telechargement">
                <Upload size={32} strokeWidth={1.5} />
                <span>Cliquez pour télécharger une image</span>
                <small>PNG, JPG ou WEBP (max 5 Mo)</small>
              </label>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleTelechargementImage}
              className="input-file-cache"
            />
          </div>
          {erreurs.image && <span className="message-erreur">{erreurs.image}</span>}
        </div>

        {/* Parcours (PDF) */}
        <div className="groupe-formulaire full-width">
          <label htmlFor="parcours">
            <Layers size={16} />
            Parcours (PDF)
          </label>
          <div className={`telechargement-parcours ${erreurs.parcours ? 'erreur' : ''}`}>
            {donneesDomaine.nomParcours ? (
              <div className="apercu-parcours-container">
                <div className="info-parcours">
                  <FileText size={24} />
                  <span className="nom-parcours">{donneesDomaine.nomParcours}</span>
                </div>
                <button 
                  type="button"
                  className="btn-supprimer-parcours"
                  onClick={handleSupprimerParcours}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label htmlFor="parcours" className="zone-telechargement-parcours">
                <Upload size={28} strokeWidth={1.5} />
                <span>Aucun fichier sélectionné</span>
                <small>PDF uniquement (max 10 Mo)</small>
              </label>
            )}
            <input
              type="file"
              id="parcours"
              accept=".pdf,application/pdf"
              onChange={handleTelechargementParcours}
              className="input-file-cache"
            />
          </div>
          {erreurs.parcours && <span className="message-erreur">{erreurs.parcours}</span>}
        </div>
      </div>

      <div className="actions-etape">
        <button 
          type="button"
          className="btn-retour" 
          onClick={() => onNavigate?.('domaines')}
        >
          <ChevronLeft size={18} />
          Retour
        </button>
        <button 
          className="btn-suivant" 
          onClick={handleSuivant}
        >
          Suivant
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  // Deuxième étape : Aperçu du domaine
  const renderEtape2 = () => (
    <div className="contenu-etape">
      <div className="formulaire-header">
        <h2>👀 Aperçu du Domaine</h2>
        <p className="formulaire-sous-titre">
          Vérifiez les informations avant d'ajouter le domaine
        </p>
      </div>

      <div className="apercu-produit">
        <div className="apercu-image">
          {donneesDomaine.apercuImage ? (
            <img src={donneesDomaine.apercuImage} alt={donneesDomaine.nom} />
          ) : (
            <div className="image-placeholder">
              <ImageIcon size={48} />
            </div>
          )}
        </div>
        
        <div className="apercu-details">
          <div className="apercu-categorie domaine-badge">
            <FolderOpen size={16} />
            Nouveau Domaine
          </div>
          <h3>{donneesDomaine.nom || 'Nom du domaine'}</h3>

          <div className="apercu-description">
            <span className="description-label">Description</span>
            <p>{donneesDomaine.description || 'Aucune description'}</p>
          </div>

          <div className="apercu-metadata">
            <div className="meta-item">
              <User size={14} />
              <span>Créé par : {client?.prenom || 'Vous'}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>Ajouté le : {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            {donneesDomaine.nomParcours && (
              <div className="meta-item">
                <FileText size={14} />
                <span>Parcours : {donneesDomaine.nomParcours}</span>
              </div>
            )}
          </div>

          <div className="statut-apercu">
            <span className="badge-statut">📁 Nouveau domaine</span>
            <span className="badge-info">
              <Eye size={12} />
              En attente de validation
            </span>
          </div>
        </div>
      </div>

      <div className="apercu-actions">
        <div className="apercu-buttons">
          <button 
            className="btn-voir-produit" 
            onClick={handleApercu}
          >
            <Eye size={16} />
            Voir le domaine
          </button>
          <button 
            className="btn-partager" 
            onClick={() => alert('🔗 Lien de partage copié !')}
          >
            <Share2 size={16} />
            Partager
          </button>
        </div>
      </div>

      <div className="actions-etape">
        <button 
          className="btn-retour" 
          onClick={handlePrecedent}
        >
          <ChevronLeft size={18} />
          Modifier
        </button>
        <div className="groupe-boutons">
          <button 
            className="btn-publier" 
            onClick={handleAjouterDomaine}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Ajout en cours...
              </>
            ) : success ? (
              <>
                <CheckCircle size={18} />
                Ajouté !
              </>
            ) : (
              <>
                📁 Ajouter le domaine
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="message-erreur-global">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="conteneur-publier">
      <div className="assistant-wrapper">
        {renderIndicateurEtapes()}
        
        <div className="contenu-assistant">
          {etape === 1 && renderEtape1()}
          {etape === 2 && renderEtape2()}
        </div>
      </div>
    </div>
  );
};

export default Publier;