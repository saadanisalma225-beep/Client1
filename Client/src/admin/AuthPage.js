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
    ville: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

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
      if (!formData.nom || !formData.prenom || !formData.email || 
          !formData.password || !formData.ville) {
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

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    if (isLogin) {
      // ─── CONNEXION ───
      try {
        const response = await fetch('http://localhost:5000/api/auth/client/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            mot_de_passe: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.client));
          onLogin?.();
          onNavigate?.('home');
        } else {
          setError(data.message || 'Email ou mot de passe incorrect');
        }
      } catch (err) {
        console.error('Erreur de connexion:', err);
        setError('❌ Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    } else {
      // ─── INSCRIPTION ───
      try {
        const response = await fetch('http://localhost:5000/api/auth/client/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            mot_de_passe: formData.password,
            confirm_mot_de_passe: formData.password,
            telephone: formData.telephone || '',
            ville: formData.ville,
            role: 'client'
          })
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.client));
          }
          onNavigate?.('account-finalization', data.client || formData);
        } else {
          setError(data.message || 'Erreur lors de l\'inscription');
        }
      } catch (err) {
        console.error('Erreur inscription:', err);
        setError('❌ Erreur de connexion au serveur');
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

                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    name="ville"
                    placeholder="Votre ville"
                    value={formData.ville}
                    onChange={handleChange}
                    required
                  />
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