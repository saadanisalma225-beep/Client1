// AuthPage.js - Page de connexion/inscription avec gestion d'erreur
import React, { useState } from 'react';
import './AuthPage.css';

const AuthPage = ({ onNavigate, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    pays: '',
    ville: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Liste des pays
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

  // Liste des villes par pays
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
    // Réinitialiser l'erreur quand l'utilisateur tape
    if (error) setError('');
    
    if (name === 'pays') {
      setFormData(prev => ({
        ...prev,
        pays: value,
        ville: ''
      }));
    }
  };

  // Validation des champs
  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs');
        return false;
      }
      if (!formData.email.includes('@')) {
        setError('Veuillez entrer un email valide');
        return false;
      }
      return true;
    } else {
      // Inscription
      if (!formData.nom || !formData.prenom || !formData.email || 
          !formData.password || !formData.pays || !formData.ville) {
        setError('Veuillez remplir tous les champs obligatoires (*)');
        return false;
      }
      if (!formData.email.includes('@')) {
        setError('Veuillez entrer un email valide');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return false;
      }
      if (formData.telephone && !formData.telephone.match(/^[0-9+\s-]{8,}$/)) {
        setError('Veuillez entrer un numéro de téléphone valide');
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation côté client
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if (isLogin) {
      // ─── CONNEXION ───
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onLogin?.();
          onNavigate?.('home');
        } else {
          setError(data.message || 'Email ou mot de passe incorrect');
        }
      } catch (err) {
        console.error('Erreur de connexion:', err);
        if (err.message === 'Failed to fetch' || err.code === 'ERR_NETWORK') {
          setError('❌ Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré sur http://localhost:5000');
        } else {
          setError('❌ Erreur de connexion au serveur');
        }
      } finally {
        setLoading(false);
      }
    } else {
      // ─── INSCRIPTION ───
      try {
        const response = await fetch('http://localhost:5000/api/auth/register/client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            telephone: formData.telephone || '',
            pays: formData.pays,
            ville: formData.ville,
            password: formData.password,
            role: 'client'
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Inscription réussie - Rediriger vers la finalisation
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          // Passer les données utilisateur à la page de finalisation
          onNavigate?.('account-finalization', data.user || formData);
        } else {
          setError(data.message || 'Erreur lors de l\'inscription');
        }
      } catch (err) {
        console.error('Erreur inscription:', err);
        if (err.message === 'Failed to fetch' || err.code === 'ERR_NETWORK') {
          setError('❌ Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré sur http://localhost:5000');
        } else {
          setError('❌ Erreur de connexion au serveur');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte client'}
          </p>

          {error && (
            <div className="auth-error">
              <span className="error-icon">❌</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
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
              </>
            )}

            <div className="form-group">
              <label>E-mail</label>
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
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder={isLogin ? "Votre mot de passe" : "Minimum 6 caractères"}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-actions-row">
              <button 
                type="button" 
                className="btn-back"
                onClick={() => onNavigate?.('home')}
              >
                Retour
              </button>
              <button 
                type="submit" 
                className="btn-continue"
                disabled={loading}
              >
                {loading ? '⏳ Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
              </button>
            </div>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    nom: '',
                    prenom: '',
                    telephone: '',
                    pays: '',
                    ville: ''
                  });
                }}
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;