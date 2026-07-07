// client/PubliesSimple.js - Version ultra-simplifiée
import React, { useState } from 'react';
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
  Eye,
  Share2,
  Grid3X3,
  Package
} from 'lucide-react';
import './Publies.css';

const PubliesSimple = ({ onNavigate }) => {
  const [etape, setEtape] = useState(1);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [apercuImage, setApercuImage] = useState(null);
  const [categorie, setCategorie] = useState('');
  const [prixDepart, setPrixDepart] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 1, nom: 'Tapis & Textiles' },
    { id: 2, nom: 'Céramique & Poterie' },
    { id: 3, nom: 'Bijoux' },
    { id: 4, nom: 'Décoration' },
    { id: 5, nom: 'Art & Peinture' },
    { id: 6, nom: 'Accessoires' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5 Mo');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setApercuImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSupprimerImage = () => {
    setImage(null);
    setApercuImage(null);
  };

  const handleSuivant = () => {
    if (!nom.trim()) {
      setError('Le nom du produit est requis');
      return;
    }
    if (!description.trim()) {
      setError('La description est requise');
      return;
    }
    if (!image) {
      setError('L\'image est requise');
      return;
    }
    if (!categorie) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }
    if (!prixDepart || parseFloat(prixDepart) <= 0) {
      setError('Le prix de départ doit être supérieur à 0');
      return;
    }
    if (!dateFin) {
      setError('La date de fin est requise');
      return;
    }
    const dateFinObj = new Date(dateFin);
    if (dateFinObj <= new Date()) {
      setError('La date de fin doit être dans le futur');
      return;
    }
    setError('');
    setEtape(2);
  };

  const handlePrecedent = () => setEtape(1);

  const handlePublier = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté');
        onNavigate?.('auth');
        return;
      }

      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('description', description);
      formData.append('categorie_id', categorie);
      formData.append('prix_depart', prixDepart);
      formData.append('date_fin', dateFin);
      formData.append('quantite', quantite || 1);
      formData.append('statut', 'en_attente');
      if (image) formData.append('image', image);

      const response = await fetch('http://localhost:5000/api/produits', {
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
          setNom('');
          setDescription('');
          setImage(null);
          setApercuImage(null);
          setCategorie('');
          setPrixDepart('');
          setDateFin('');
          setQuantite(1);
          setEtape(1);
          setSuccess(false);
          setError('');
          onNavigate?.('encheres');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la publication');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'Non défini';
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency', currency: 'MAD', minimumFractionDigits: 0
    }).format(price);
  };

  // Étape 1 : Formulaire
  const renderEtape1 = () => (
    <div className="contenu-etape">
      <div className="formulaire-header">
        <h2>📝 Ajouter un nouveau produit</h2>
        <p className="formulaire-sous-titre">Remplissez les informations ci-dessous pour publier votre produit</p>
      </div>

      {error && (
        <div className="message-erreur-global">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="formulaire-grid">
        {/* Nom du produit */}
        <div className="groupe-formulaire">
          <label>
            <Tag size={16} />
            Nom du produit *
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Tapis Berbère Azilal"
          />
        </div>

        {/* Catégorie */}
        <div className="groupe-formulaire">
          <label>
            <Grid3X3 size={16} />
            Catégorie *
          </label>
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            <option value="">Sélectionner une catégorie</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="groupe-formulaire full-width">
          <label>
            <FileText size={16} />
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre produit en détail..."
            rows="4"
          />
        </div>

        {/* Prix de départ */}
        <div className="groupe-formulaire">
          <label>
            <Gavel size={16} />
            Prix de départ (MAD) *
          </label>
          <input
            type="number"
            value={prixDepart}
            onChange={(e) => setPrixDepart(e.target.value)}
            placeholder="0"
            min="1"
            step="1"
          />
        </div>

        {/* Date de fin */}
        <div className="groupe-formulaire">
          <label>
            <Clock size={16} />
            Date de fin d'enchère *
          </label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
          />
        </div>

        {/* Quantité */}
        <div className="groupe-formulaire">
          <label>
            <Package size={16} />
            Quantité
          </label>
          <input
            type="number"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            min="1"
            step="1"
          />
        </div>

        {/* Image */}
        <div className="groupe-formulaire full-width">
          <label>
            <Camera size={16} />
            Image du produit *
          </label>
          <div className="telechargement-image">
            {apercuImage ? (
              <div className="apercu-image-container">
                <img src={apercuImage} alt="Aperçu" className="apercu-image" />
                <button
                  type="button"
                  className="btn-supprimer-image"
                  onClick={handleSupprimerImage}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="zone-telechargement" style={{ cursor: 'pointer', width: '100%', padding: '20px' }}>
                <Upload size={32} strokeWidth={1.5} />
                <span>Cliquez pour télécharger une image</span>
                <small>PNG, JPG ou WEBP (max 5 Mo)</small>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="actions-etape">
        <button className="btn-retour" onClick={() => onNavigate?.('encheres')}>
          <ChevronLeft size={18} />
          Retour
        </button>
        <button className="btn-suivant" onClick={handleSuivant}>
          Suivant
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  // Étape 2 : Aperçu
  const renderEtape2 = () => (
    <div className="contenu-etape">
      <div className="formulaire-header">
        <h2>👀 Aperçu du produit</h2>
        <p className="formulaire-sous-titre">Vérifiez les informations avant de publier</p>
      </div>

      {error && (
        <div className="message-erreur-global">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="apercu-produit">
        <div className="apercu-image">
          {apercuImage ? (
            <img src={apercuImage} alt={nom} />
          ) : (
            <div className="image-placeholder">
              <ImageIcon size={48} />
            </div>
          )}
        </div>

        <div className="apercu-details">
          <div className="apercu-categorie">
            {categories.find(c => c.id === parseInt(categorie))?.nom || 'Non catégorisé'}
          </div>
          <h3>{nom || 'Nom du produit'}</h3>

          <div className="apercu-prix">
            <span className="prix-label">Prix de départ</span>
            <span className="prix-valeur">{formatPrice(prixDepart)}</span>
          </div>

          <div className="apercu-description">
            <span className="description-label">Description</span>
            <p>{description || 'Aucune description'}</p>
          </div>

          <div className="apercu-metadata">
            <div className="meta-item">
              <Clock size={14} />
              <span>Fin : {formatDate(dateFin)}</span>
            </div>
            <div className="meta-item">
              <Package size={14} />
              <span>Quantité : {quantite || 1}</span>
            </div>
            <div className="meta-item">
              <User size={14} />
              <span>Vendeur : Vous</span>
            </div>
          </div>

          <div className="statut-apercu">
            <span className="badge-statut">⏳ en_attente</span>
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
            onClick={() => alert('👀 Aperçu du produit:\n\n' + 
              `Nom: ${nom}\n` +
              `Description: ${description}\n` +
              `Prix: ${formatPrice(prixDepart)}\n` +
              `Catégorie: ${categories.find(c => c.id === parseInt(categorie))?.nom || 'Non catégorisé'}`
            )}
          >
            <Eye size={16} />
            Voir le produit
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
        <button className="btn-retour" onClick={handlePrecedent}>
          <ChevronLeft size={18} />
          Modifier
        </button>
        <button 
          className="btn-publier" 
          onClick={handlePublier}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" />
              Publication en cours...
            </>
          ) : success ? (
            <>
              <CheckCircle size={18} />
              Publié !
            </>
          ) : (
            '📤 Publier le produit'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="conteneur-publier">
      <div className="assistant-wrapper">
        {/* Indicateur d'étapes */}
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

        <div className="contenu-assistant">
          {etape === 1 && renderEtape1()}
          {etape === 2 && renderEtape2()}
        </div>
      </div>
    </div>
  );
};

export default PubliesSimple;