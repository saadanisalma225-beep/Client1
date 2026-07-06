// client/ContactPage.js
import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './ContactPage.css';

const ContactPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulation d'envoi - À remplacer par votre API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ nom: '', email: '', sujet: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <MapPin size={20} />, label: 'Adresse', value: 'Casablanca, Maroc' },
    { icon: <Phone size={20} />, label: 'Téléphone', value: '+212 5XX-XXXXXX' },
    { icon: <Mail size={20} />, label: 'Email', value: 'contact@bazart.ma' },
    { icon: <Clock size={20} />, label: 'Horaires', value: 'Lun-Ven: 9h - 18h' },
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>Contactez-nous</h1>
          <p>Une question ? Une suggestion ? N'hésitez pas à nous contacter !</p>
        </div>

        <div className="contact-grid">
          {/* Informations de contact */}
          <div className="contact-info">
            <h2>Nos coordonnées</h2>
            <div className="info-list">
              {contactInfo.map((item, index) => (
                <div className="info-item" key={index}>
                  <div className="info-icon">{item.icon}</div>
                  <div>
                    <span className="info-label">{item.label}</span>
                    <span className="info-value">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-hours">
              <h3>Disponibilité</h3>
              <p>Notre équipe est disponible pour vous répondre du lundi au vendredi, de 9h à 18h.</p>
              <div className="hours-badge">
                <span className="status-dot"></span>
                Actuellement en ligne
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="contact-form">
            <h2>Envoyez-nous un message</h2>
            
            {success && (
              <div className="form-success">
                <CheckCircle size={20} />
                <span>Votre message a été envoyé avec succès !</span>
              </div>
            )}
            
            {error && (
              <div className="form-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nom">
                  <User size={16} />
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sujet">
                  <MessageSquare size={16} />
                  Sujet *
                </label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  placeholder="Sujet de votre message"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Décrivez votre demande..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;