import React, { useState } from 'react';
import axios from 'axios';
import AccountFinalization from './AccountFinalization';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    pays: '',
    ville: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Liste des pays
  const paysList = [
    'Maroc',
    'Algérie',
    'Tunisie',
    'France',
    'Espagne',
    'Italie',
    'Allemagne',
    'Royaume-Uni',
    'Belgique',
    'Suisse',
    'Canada',
    'Sénégal',
    "Côte d'Ivoire",
    'Mali',
    'Niger'
  ];

  // ✅ Liste des villes
  const villesList = {
    'Maroc': ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kenitra', 'Tétouan'],
    'Algérie': ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif'],
    'Tunisie': ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg'],
    'Espagne': ['Madrid', 'Barcelone', 'Valence', 'Séville', 'Bilbao'],
    'Italie': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    'Allemagne': ['Berlin', 'Munich', 'Hambourg', 'Cologne', 'Francfort'],
    'Royaume-Uni': ['Londres', 'Manchester', 'Birmingham', 'Liverpool'],
    'Belgique': ['Bruxelles', 'Anvers', 'Liège', 'Gand'],
    'Suisse': ['Genève', 'Zurich', 'Berne', 'Lausanne'],
    'Canada': ['Montréal', 'Toronto', 'Vancouver', 'Québec'],
    'Sénégal': ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor'],
    "Côte d'Ivoire": ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Daloa'],
    'Mali': ['Bamako', 'Ségou', 'Mopti', 'Koutiala'],
    'Niger': ['Niamey', 'Zinder', 'Maradi', 'Tahoua']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'pays') {
      setFormData(prev => ({
        ...prev,
        pays: value,
        ville: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // ✅ Validation des champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.email || !formData.pays || !formData.ville) {
      setError('❌ Tous les champs sont obligatoires');
      setLoading(false);
      return;
    }

    try {
      // ✅ Appel API vers le backend
      const response = await axios.post('http://localhost:5000/api/auth/register/client', {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone || '',
        pays: formData.pays,
        ville: formData.ville,
        role: 'client'
      });

      if (response.data.success) {
        // ✅ Stocker le token si présent
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        setUserData({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone || 'Non renseigné',
          pays: formData.pays,
          ville: formData.ville
        });
        setIsRegistered(true);
        setSuccess('✅ Inscription réussie !');
      } else {
        setError(response.data.message || 'Erreur lors de l\'inscription');
      }
      
    } catch (err) {
      console.error('Erreur inscription:', err);
      setError(err.response?.data?.message || '❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Page de finalisation du compte
  if (isRegistered) {
    return <AccountFinalization userData={userData} />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Informations personnelles</h2>
        <p className="subtitle">Remplissez vos informations de base</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              placeholder="+212 6 22 54 56 78"
              value={formData.telephone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pays</label>
              <select
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Sélectionnez votre pays</option>
                {paysList.map((pays) => (
                  <option key={pays} value={pays}>
                    {pays}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ville</label>
              <select
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                required
                className="form-select"
                disabled={!formData.pays}
              >
                <option value="">
                  {formData.pays ? 'Sélectionnez votre ville' : 'Choisissez un pays d\'abord'}
                </option>
                {formData.pays && villesList[formData.pays]?.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions-row">
            <button 
              type="button" 
              className="btn-back"
              onClick={() => window.location.href = '/'}
            >
              Retour
            </button>
            <button 
              type="submit" 
              className="btn-continue"
              disabled={loading}
            >
              {loading ? '⏳ Chargement...' : 'Continuer'}
            </button>
          </div>
        </form>

        <p className="login-link">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;