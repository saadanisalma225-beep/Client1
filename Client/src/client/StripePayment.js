// client/StripePayment.js
import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Wallet,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import './StripePayment.css';

const StripePayment = ({ onNavigate, amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    country: 'Maroc'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatage de la carte bancaire
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    // Formatage de la date d'expiration
    if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(.{2})/, '$1/')
        .slice(0, 5);
    }

    // CVC - uniquement des chiffres
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation simple
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 16) {
      setError('Numéro de carte invalide (16 chiffres requis)');
      return;
    }
    if (cardData.expiry.length < 5) {
      setError('Date d\'expiration invalide (MM/AA)');
      return;
    }
    if (cardData.cvc.length < 3) {
      setError('Code CVC invalide (3 chiffres requis)');
      return;
    }

    setLoading(true);

    try {
      // ===== INTÉGRATION STRIPE =====
      // Dans un vrai projet, vous appelleriez votre API backend
      // qui utilise Stripe pour créer un PaymentIntent
      
      const token = localStorage.getItem('token');
      
      // 1. Créer un PaymentIntent côté serveur
      const response = await fetch('http://localhost:5000/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'MAD',
          description: `Recharge de portefeuille - ${formatPrice(amount)}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de paiement');
      }

      // 2. Simuler le paiement (dans un vrai projet, vous utiliseriez Stripe.js)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Confirmer le paiement
      const confirmResponse = await fetch('http://localhost:5000/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntentId,
          amount: amount
        })
      });

      const confirmData = await confirmResponse.json();

      if (confirmResponse.ok && confirmData.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.(amount);
          onNavigate?.('wallet');
        }, 2000);
      } else {
        throw new Error(confirmData.message || 'Échec de la confirmation du paiement');
      }

    } catch (err) {
      console.error('Erreur paiement:', err);
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Simuler la sélection du pays
  const countries = ['Maroc', 'France', 'Belgique', 'Canada', 'Suisse', 'Espagne', 'Allemagne', 'Italie'];

  if (success) {
    return (
      <div className="stripe-payment-page">
        <div className="payment-success">
          <div className="success-icon">
            <CheckCircle size={48} />
          </div>
          <h2>Paiement réussi !</h2>
          <p>Votre portefeuille a été rechargé de {formatPrice(amount)}</p>
          <p className="success-sub">Redirection vers le portefeuille...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stripe-payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button className="btn-back-payment" onClick={onCancel}>
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="payment-header-title">
            <CreditCard size={24} />
            <h1>Paiement Sécurisé</h1>
          </div>
        </div>

        {/* Montant */}
        <div className="payment-amount">
          <span className="amount-label">Montant à payer</span>
          <span className="amount-value">{formatPrice(amount)}</span>
        </div>

        {/* Formulaire */}
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <Shield size={18} />
            <span>Paiement rapide et sécurisé avec Link</span>
          </div>

          {error && (
            <div className="payment-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Numéro de carte */}
          <div className="form-group">
            <label htmlFor="cardNumber">Numéro de carte</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 1234 1234 1234"
                value={cardData.cardNumber}
                onChange={handleChange}
                maxLength="19"
                className="card-input"
              />
              <CreditCard size={18} className="input-icon" />
            </div>
          </div>

          {/* Expiration et CVC */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiry">Date d'expiration</label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM / AA"
                value={cardData.expiry}
                onChange={handleChange}
                maxLength="5"
                className="card-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvc">Code de sécurité</label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                placeholder="CVC"
                value={cardData.cvc}
                onChange={handleChange}
                maxLength="3"
                className="card-input"
              />
            </div>
          </div>

          {/* Pays */}
          <div className="form-group">
            <label htmlFor="country">Pays</label>
            <div className="input-wrapper">
              <select
                id="country"
                name="country"
                value={cardData.country}
                onChange={handleChange}
                className="card-input"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <MapPin size={18} className="input-icon" />
            </div>
          </div>

          {/* Boutons */}
          <div className="payment-actions">
            <button
              type="submit"
              className="btn-pay"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Payer {formatPrice(amount)}
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-cancel-payment"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          </div>

          {/* Sécurisé par Stripe */}
          <div className="payment-footer">
            <Lock size={14} />
            <span>Paiement sécurisé par Stripe</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StripePayment;