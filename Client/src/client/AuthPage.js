import React, { useState } from 'react';
import {
  Lock,
  Headphones,
  CheckCircle,
  AlertTriangle,
  Camera,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { encryptData } from '././../utils/crypto';
import logoBazart from '././../assets/images/logo-bazart.png';
import '../assets/css/client/AuthPage.css';

const AuthPage = ({ onNavigate, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    ville: '',
    adresse: '',
    photo_profil: null
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo_profil: file }));
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const validateStep1 = () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.ville) {
      setError('Veuillez remplir tous les champs obligatoires (*)');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Veuillez entrer un email valide');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs de sécurité');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    setError('');
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateStep2()) return;
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('prenom', formData.prenom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mot_de_passe', formData.password);
      formDataToSend.append('confirm_mot_de_passe', formData.confirmPassword);
      formDataToSend.append('telephone', formData.telephone);
      formDataToSend.append('ville', formData.ville);
      formDataToSend.append('adresse', formData.adresse || '');
      formDataToSend.append('role', 'acheteur');
      if (formData.photo_profil) {
        formDataToSend.append('photo_profil', formData.photo_profil);
      }

      const response = await fetch('http://localhost:5000/api/auth/client/register', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', encryptData(result.client));
        }
        alert('Inscription réussie ! Vérifiez votre email (et vos spams) pour activer votre compte.');
        onNavigate?.('auth');
      } else {
        setError(result.message || result.errors?.[0] || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error('Erreur inscription:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          mot_de_passe: formData.password
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', encryptData(result.client));
        onLogin?.();
        onNavigate?.('home');
      } else {
        setError(result.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const sidebarContent = (
    <div className="auth-sidebar">
      <div className="sidebar-logo">
        <img src={logoBazart} alt="Bazart" />
      </div>
      <h1>Rejoignez Bazart</h1>
      <p>Créez votre compte pour accéder à des enchères exclusives et découvrir des objets rares. Notre communauté vous attend !</p>
      <div className="sidebar-features">
        <div className="feature-item">
          <Lock size={18} strokeWidth={2} />
          <span>Transactions sécurisées</span>
        </div>
        <div className="feature-item">
          <Headphones size={18} strokeWidth={2} />
          <span>Support expert 24/7</span>
        </div>
        <div className="feature-item">
          <CheckCircle size={18} strokeWidth={2} />
          <span>Garantie d'authenticité</span>
        </div>
      </div>
    </div>
  );

  if (isLogin) {
    return (
      <div className="auth-page">
        <div className="auth-container two-column">
          {sidebarContent}
          <div className="auth-form-section">
            <div className="auth-card">
              <h2>Connexion</h2>
              <p className="auth-subtitle">Connectez-vous à votre compte</p>

              {error && (
                <div className="auth-error">
                  <AlertTriangle size={18} strokeWidth={2} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>E-mail *</label>
                  <input type="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Mot de passe *</label>
                  <input type="password" name="password" placeholder="Votre mot de passe" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="auth-actions-row">
                  <button type="button" className="btn-back" onClick={() => onNavigate?.('home')}>
                    <ArrowLeft size={16} strokeWidth={2} />
                    Retour
                  </button>
                  <button type="submit" className="btn-continue" disabled={loading}>
                    {loading ? <Loader2 size={18} strokeWidth={2} className="spin" /> : 'Se connecter'}
                  </button>
                </div>
              </form>

              <div className="auth-toggle">
                <p>Pas encore de compte ? <button type="button" onClick={() => { setIsLogin(false); setStep(1); setError(''); }}>S'inscrire</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container two-column">
        {sidebarContent}
        <div className="auth-form-section">
          <div className="step-indicator">
            <div className={`step ${step === 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Informations</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Finaliser</span>
            </div>
          </div>

          <div className="auth-card">
            {step === 1 ? (
              <>
                <h2>Informations personnelles</h2>
                <p className="auth-subtitle">Remplissez vos informations de base</p>

                {error && (
                  <div className="auth-error">
                    <AlertTriangle size={18} strokeWidth={2} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Prénom *</label>
                      <input type="text" name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Nom *</label>
                      <input type="text" name="nom" placeholder="Votre nom" value={formData.nom} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input type="tel" name="telephone" placeholder="+212 6 12 34 56 78" value={formData.telephone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Ville *</label>
                    <input type="text" name="ville" placeholder="Votre ville" value={formData.ville} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Adresse</label>
                    <input type="text" name="adresse" placeholder="Votre adresse" value={formData.adresse} onChange={handleChange} />
                  </div>

                  <div className="auth-actions-row">
                    <button type="button" className="btn-back" onClick={() => onNavigate?.('home')}>
                      <ArrowLeft size={16} strokeWidth={2} />
                      Retour
                    </button>
                    <button type="submit" className="btn-continue">
                      Continuer
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Finalisation du compte</h2>
                <p className="auth-subtitle">Créez votre mot de passe et téléchargez votre photo de profil</p>

                {error && (
                  <div className="auth-error">
                    <AlertTriangle size={18} strokeWidth={2} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-section-title">Sécurité du compte</div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Mot de passe *</label>
                      <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                      <small>Minimum 6 caractères</small>
                    </div>
                    <div className="form-group">
                      <label>Confirmer le mot de passe *</label>
                      <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-section-title">Photo de profil (optionnel)</div>

                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="photo_profil"
                      name="photo_profil"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileChange}
                      hidden
                    />
                    <label htmlFor="photo_profil" className="file-upload-label">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Preview" className="photo-preview" />
                      ) : (
                        <>
                          <Camera size={32} strokeWidth={1.5} />
                          <span>Choisir une photo</span>
                        </>
                      )}
                    </label>
                    <small>Formats supportés: JPG, PNG, GIF</small>
                  </div>

                  <div className="auth-actions-row">
                    <button type="button" className="btn-back" onClick={handleBack}>
                      <ArrowLeft size={16} strokeWidth={2} />
                      Retour
                    </button>
                    <button type="submit" className="btn-continue" disabled={loading}>
                      {loading ? <Loader2 size={18} strokeWidth={2} className="spin" /> : 'Créer mon compte'}
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="auth-toggle">
              <p>Déjà un compte ? <button type="button" onClick={() => { setIsLogin(true); setError(''); }}>Se connecter</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;