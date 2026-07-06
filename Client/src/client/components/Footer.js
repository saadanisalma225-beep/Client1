import React from 'react';
import './Footer.css'; import
 {
  Hammer,
  Globe,
  Camera,
  MessageCircle,
  Play,
  Home,
  Gavel,
  Grid3X3,
  Tag,
  HelpCircle,
  Mail,
  FileText,
  Shield,
  MapPin,
  Phone
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon">
              <Hammer size={22} strokeWidth={2} />
            </div>
            <h2>Bazart.</h2>
          </div>
          <p>La première plateforme d'enchères dédiée à l'artisanat marocain authentique.</p>
          <div className="social-links">
            <a href="#facebook" className="social-link" aria-label="Facebook">
              <Globe size={18} strokeWidth={2} />
            </a>
            <a href="#instagram" className="social-link" aria-label="Instagram">
              <Camera size={18} strokeWidth={2} />
            </a>
            <a href="#twitter" className="social-link" aria-label="Twitter">
              <MessageCircle size={18} strokeWidth={2} />
            </a>
            <a href="#youtube" className="social-link" aria-label="YouTube">
              <Play size={18} strokeWidth={2} />
            </a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Navigation</h4>
          <a href="#home">
            <Home size={14} strokeWidth={2} />
            Accueil
          </a>
          <a href="#auctions">
            <Gavel size={14} strokeWidth={2} />
            Enchères
          </a>
          <a href="#categories">
            <Grid3X3 size={14} strokeWidth={2} />
            Catégories
          </a>
          <a href="#sell">
            <Tag size={14} strokeWidth={2} />
            Vendre
          </a>
        </div>
        <div className="footer-links">
          <h4>Support</h4>
          <a href="#faq">
            <HelpCircle size={14} strokeWidth={2} />
            FAQ
          </a>
          <a href="#contact">
            <Mail size={14} strokeWidth={2} />
            Contact
          </a>
          <a href="#terms">
            <FileText size={14} strokeWidth={2} />
            Conditions d'utilisation
          </a>
          <a href="#privacy">
            <Shield size={14} strokeWidth={2} />
            Politique de confidentialité
          </a>
        </div>
        <div className="footer-links">
          <h4>Contact</h4>
          <p>
            <MapPin size={14} strokeWidth={2} />
            Casablanca, Maroc
          </p>
          <p>
            <Phone size={14} strokeWidth={2} />
            +212 5XX-XXXXXX
          </p>
          <p>
            <Mail size={14} strokeWidth={2} />
            contact@bazart.ma
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Bazart. Tous droits réservés. | PFE ENSET Mohammedia</p>
      </div>
    </footer>
  );
};

export default Footer; 