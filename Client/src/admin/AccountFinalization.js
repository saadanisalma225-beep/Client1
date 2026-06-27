import React, { useState } from 'react';
import axios from 'axios';
import './AccountFinalization.css';

const AccountFinalization = ({ userData }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('❌ Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('❌ Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('password', password);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.post(
        'http://localhost:5000/api/auth/finalize',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('✅ Compte finalisé avec succès !');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la finalisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finalization-page">
      <div className="finalization-container">
        {/* En-tête */}
        <div className="finalization-header">
          <h1 className="finalization-title">Bazart</h1>
          <h2 className="finalization-subtitle">Rejoignez Bazart</h2>
          <p className="finalization-text">
            Créez votre compte pour accéder à des modules exclusifs 
            et découvrir des objets rares. Votre communauté vous attend !
          </p>
        </div>

     
     
         
     
  

        <div className="finalization-form-container">
          <h3 className="form-title">Finalisation du compte</h3>
          <p className="form-subtitle">
            Créez votre mot de passe et téléchargez votre photo de profil
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="finalization-form">
            {/* Image de profil */}
            <div className="form-group profile-image-group">
              <label>Photo de profil</label>
              <div className="image-upload-container">
                <div className="image-preview-wrapper">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Photo de profil" 
                      className="profile-image-preview"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span className="upload-icon">📷</span>
                      <span>Ajouter une photo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                  id="profile-image-input"
                />
                <label htmlFor="profile-image-input" className="image-upload-btn">
                  Choisir une image
                </label>
              </div>
            </div>

            {/* Sécurité du compte */}
            <div className="security-section">
              <h4 className="security-title">Sécurité du compte</h4>
              
              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="finalization-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => window.location.href = '/login'}
              >
                Fermer
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ En cours...' : 'Rejoindre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountFinalization;