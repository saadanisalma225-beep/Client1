import React, { useEffect, useState } from 'react';
import '../assets/css/client/EmailVerification.css';

const API_BASE_URL = 'http://localhost:5000/api';

const EmailVerification = ({ token, onNavigate }) => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!token) {
        if (isMounted) {
          setStatus('error');
          setMessage("Lien de vérification invalide ou incomplet.");
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/client/verify/${token}`);
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Votre email a été vérifié avec succès !');
          
          // Store verification status and redirect to home
          localStorage.setItem('emailVerified', 'true');
          
          // Auto-redirect to home after 2 seconds
          setTimeout(() => {
            onNavigate?.('home');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Ce lien de vérification est invalide ou a expiré.');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setMessage('Impossible de contacter le serveur. Veuillez réessayer plus tard.');
        }
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [token, onNavigate]);

  const goHome = () => {
    onNavigate?.('home');
  };

  const goLogin = () => {
    onNavigate?.('auth');
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        {status === 'loading' && (
          <>
            <div className="verify-spinner" />
            <h2>Vérification en cours...</h2>
            <p>Merci de patienter pendant que nous vérifions votre email.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verify-icon verify-icon--success">✓</div>
            <h2>Email vérifié !</h2>
            <p>{message}</p>
            <p className="redirect-text">Redirection vers l'accueil...</p>
            <button className="verify-btn" onClick={goHome}>
              Aller à l'accueil
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verify-icon verify-icon--error">✕</div>
            <h2>Échec de la vérification</h2>
            <p>{message}</p>
            <button className="verify-btn verify-btn--secondary" onClick={goHome}>
              Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;