// pages/AccountFinalization.js
import React, { useState } from 'react';
import './AccountFinalization.css';

const AccountFinalization = ({ userData, onNavigate }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    photo: null,
    photoPreview: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // Envoyer les données au backend
      const formDataToSend = new FormData();
      formDataToSend.append('email', userData?.email || '');
      formDataToSend.append('password', formData.password);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await fetch('http://localhost:5000/api/auth/client/finalize', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('✅ Compte finalisé avec succès !');
        setTimeout(() => {
          onNavigate?.('home');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la finalisation');
      }
    } catch (err) {
      setError('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finalization-page">
      <div className="finalization-container">
        <div className="finalization-card">
          {/* Logo */}
          <div className="finalization-logo">
            <h2>Bazart.</h2>
          </div>

          <h2>Finalisation du compte</h2>
          <p className="finalization-subtitle">
            Créez votre compte pour télécharger votre photo de profil.
          </p>

          {error && <div className="finalization-error">{error}</div>}
          {success && <div className="finalization-success">{success}</div>}

          {/* Informations utilisateur */}
          {userData && (
            <div className="user-info-card">
              <div className="user-info-row">
                <span className="user-info-label">👤 Nom complet</span>
                <span className="user-info-value">{userData.prenom} {userData.nom}</span>
              </div>
              <div className="user-info-row">
                <span className="user-info-label">📧 Email</span>
                <span className="user-info-value">{userData.email}</span>
              </div>
              {userData.pays && (
                <div className="user-info-row">
                  <span className="user-info-label">📍 Localisation</span>
                  <span className="user-info-value">{userData.ville}, {userData.pays}</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Sécurité du compte */}
            <div className="security-section">
              <h3>🔒 Sécurité du compte</h3>

              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 caractères"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Retapez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Photo de profil */}
            <div className="photo-section">
              <h3>📷 Photo de profil (optionnel)</h3>

              <div className="photo-upload">
                <div className="photo-preview-container">
                  {formData.photoPreview ? (
                    <img 
                      src={formData.photoPreview} 
                      alt="Photo de profil" 
                      className="photo-preview"
                    />
                  ) : (
                    <div className="photo-placeholder">
                      <span>👤</span>
                      <p>Cliquez pour ajouter une photo</p>
                    </div>
                  )}
                </div>

                <div className="photo-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="photo-input"
                    id="photo-input"
                  />
                  <label htmlFor="photo-input" className="photo-input-label">
                    Choisir une photo
                  </label>
                  {formData.photoPreview && (
                    <button
                      type="button"
                      className="photo-remove"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        photo: null,
                        photoPreview: null
                      }))}
                    >
                      ✕ Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Visitez notre site */}
            <div className="visit-section">
              <p className="visit-text">
                Visitez notre site de chaque utilisateur <span className="required-star">*</span>
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="finalization-actions">
              <button 
                type="button" 
                className="btn-back"
                onClick={() => onNavigate?.('auth')}
              >
                Retour
              </button>
              <button 
                type="submit" 
                className="btn-create"
                disabled={loading}
              >
                {loading ? '⏳ Chargement...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountFinalization;