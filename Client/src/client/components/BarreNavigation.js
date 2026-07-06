// client/components/BarreNavigation.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Heart,
  Bell,
  User,
  LogOut,
  Wallet,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Gavel,
  MessageCircle,
  Award,
  HelpCircle,
  Home,
  Grid3X3,
  Tag,
  Mail,
  Clock,
  Truck,
  AlertCircle,
  FileText
} from 'lucide-react';
import { decryptData, encryptData } from '../../utils/crypto';
import './BarreNavigation.css';

const BarreNavigation = ({ onNavigate, isClientLoggedIn, onClientLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [client, setClient] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Types de notifications avec leurs icônes et couleurs
  const notificationTypes = {
    admin: { icon: <FileText size={16} />, color: '#ed8936', label: 'Administration' },
    expertise: { icon: <Award size={16} />, color: '#805ad5', label: 'Expertise' },
    favorite: { icon: <Heart size={16} />, color: '#e53e3e', label: 'Favoris' },
    bid: { icon: <Gavel size={16} />, color: '#3182ce', label: 'Enchère' },
    payment: { icon: <Wallet size={16} />, color: '#38a169', label: 'Paiement' },
    delivery: { icon: <Truck size={16} />, color: '#d69e2e', label: 'Livraison' },
    message: { icon: <MessageCircle size={16} />, color: '#ed64a6', label: 'Message' },
    system: { icon: <AlertCircle size={16} />, color: '#718096', label: 'Système' }
  };

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (isClientLoggedIn && encryptedUser && token) {
      const user = decryptData(encryptedUser);
      if (user) {
        setClient(user);
        fetchUserData(token);
        fetchNotifications(token);
      } else {
        setClient(null);
      }
    } else {
      setClient(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClientLoggedIn]);

  // Récupérer les données utilisateur
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/client/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setClient(data.client);
        localStorage.setItem('user', encryptData(data.client));
      }
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error);
    }
  };

  // Données de secours pour les notifications
  const getFallbackNotifications = () => {
    return [
      {
        id: 1,
        type: 'admin',
        title: 'Décision administrative',
        message: 'Votre produit "Tapis Berbère" a été validé par l\'administrateur',
        time: 'Il y a 10 min',
        read: false,
        link: '/product/1',
        action: 'Voir le produit'
      },
      {
        id: 2,
        type: 'expertise',
        title: 'Expertise terminée',
        message: 'L\'expertise de votre "Vase Fassi" est terminée. Résultat disponible.',
        time: 'Il y a 25 min',
        read: false,
        link: '/expertise/2',
        action: 'Voir le rapport'
      },
      {
        id: 3,
        type: 'bid',
        title: 'Nouvelle enchère',
        message: 'Karim B. a placé une enchère de 10 000 MAD sur votre Tapis Berbère',
        time: 'Il y a 1h',
        read: false,
        link: '/auction/1',
        action: 'Voir l\'enchère'
      },
      {
        id: 4,
        type: 'favorite',
        title: 'Favori ajouté',
        message: 'Sophie L. a ajouté votre "Collier Berbère" à ses favoris',
        time: 'Il y a 2h',
        read: false,
        link: '/product/3',
        action: 'Voir le produit'
      },
      {
        id: 5,
        type: 'bid',
        title: 'Enchère dépassée',
        message: 'Vous avez été dépassé sur l\'enchère "Tapis Azilal Vintage"',
        time: 'Il y a 3h',
        read: true,
        link: '/auction/2',
        action: 'Re-enchérir'
      },
      {
        id: 6,
        type: 'payment',
        title: 'Paiement confirmé',
        message: 'Votre paiement de 1 200 MAD pour "Collier Berbère" a été confirmé',
        time: 'Il y a 4h',
        read: true,
        link: '/payment/123',
        action: 'Voir la facture'
      },
      {
        id: 7,
        type: 'delivery',
        title: 'Livraison en cours',
        message: 'Votre commande "Vase Fassi" est en cours de livraison',
        time: 'Il y a 5h',
        read: true,
        link: '/delivery/456',
        action: 'Suivre la livraison'
      },
      {
        id: 8,
        type: 'message',
        title: 'Nouveau message',
        message: 'Vous avez reçu un message de Nadia F. concernant votre produit',
        time: 'Il y a 6h',
        read: true,
        link: '/messages/789',
        action: 'Répondre'
      },
      {
        id: 9,
        type: 'system',
        title: 'Mise à jour système',
        message: 'La plateforme sera en maintenance cette nuit de 2h à 4h',
        time: 'Il y a 8h',
        read: true,
        link: null,
        action: null
      }
    ];
  };

  // ===== NOTIFICATIONS =====
  const fetchNotifications = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setNotifications(data.notifications || []);
        const unread = data.notifications?.filter(n => !n.read).length || 0;
        setUnreadCount(unread);
        setNotifCount(unread);
      } else {
        const fallbackNotifs = getFallbackNotifications();
        setNotifications(fallbackNotifs);
        const unread = fallbackNotifs.filter(n => !n.read).length;
        setUnreadCount(unread);
        setNotifCount(unread);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      const fallbackNotifs = getFallbackNotifications();
      setNotifications(fallbackNotifs);
      const unread = fallbackNotifs.filter(n => !n.read).length;
      setUnreadCount(unread);
      setNotifCount(unread);
    }
  };

  // Marquer une notification comme lue
  const handleNotificationClick = async (id, link, action) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const updated = notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      setNotifications(updated);
      const unread = updated.filter(n => !n.read).length;
      setUnreadCount(unread);
      setNotifCount(unread);
      
      // Rediriger si un lien est fourni
      if (link) {
        setNotifOpen(false);
        // Navigation vers la page concernée
        if (link.includes('/product/')) {
          const productId = link.split('/').pop();
          onNavigate?.('product-detail', parseInt(productId));
        } else if (link.includes('/auction/')) {
          const auctionId = link.split('/').pop();
          onNavigate?.('product-detail', parseInt(auctionId));
        } else if (link.includes('/expertise/')) {
          onNavigate?.('expertise');
        } else if (link.includes('/payment/')) {
          onNavigate?.('wallet');
        } else if (link.includes('/delivery/')) {
          onNavigate?.('orders');
        } else if (link.includes('/messages/')) {
          onNavigate?.('messages');
        }
      }
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const updated = notifications.map(notif => ({ ...notif, read: true }));
      setNotifications(updated);
      setUnreadCount(0);
      setNotifCount(0);
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
    }
  };

  // Filtrer les notifications par type
  const getFilteredNotifications = () => {
    if (notificationFilter === 'all') return notifications;
    return notifications.filter(n => n.type === notificationFilter);
  };

  const filteredNotifications = getFilteredNotifications();

  // ===== RECHERCHE =====
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(term)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults([
          { id: 1, title: 'Tapis Berbère Azilal', price: '10 000 MAD', category: 'Tapis & Textiles' },
          { id: 2, title: 'Vase Fassi Émaillé', price: '850 MAD', category: 'Céramique & Poterie' }
        ]);
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setClient(null);
    onClientLogout?.();
    onNavigate?.('home');
    setDropdownOpen(false);
  };

  const getNotificationIcon = (type) => {
    return notificationTypes[type]?.icon || <Bell size={16} />;
  };

  const getNotificationColor = (type) => {
    return notificationTypes[type]?.color || '#718096';
  };

  const getNotificationTypeLabel = (type) => {
    return notificationTypes[type]?.label || 'Notification';
  };

  // ===== MENU ITEMS MODIFIÉS - Suppression des éléments inutiles =====
  const menuItems = [
    { icon: <User size={16} />, label: 'Mon profil', page: 'profile' }
    // Tous les autres éléments ont été supprimés
  ];

  const navLinks = [
    { label: 'Accueil', page: 'home', icon: <Home size={16} /> },
    { label: 'Enchères', page: 'auctions', icon: <Gavel size={16} /> },
    { label: 'Catégories', page: 'categories', icon: <Grid3X3 size={16} /> },
    { label: 'Vendre', page: 'sell', icon: <Tag size={16} /> },
    { label: 'Mon portefeuille', page: 'wallet', icon: <Wallet size={16} /> },
    { label: 'Contact', page: 'contact', icon: <Mail size={16} /> }
  ];

  // Filtres de notifications
  const filterOptions = [
    { value: 'all', label: 'Toutes' },
    { value: 'admin', label: 'Admin' },
    { value: 'expertise', label: 'Expertise' },
    { value: 'bid', label: 'Enchères' },
    { value: 'payment', label: 'Paiements' },
    { value: 'delivery', label: 'Livraisons' },
    { value: 'message', label: 'Messages' }
  ];

  return (
    <header className={`barre-navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => onNavigate?.('home')}>
          <div className="logo-icon">🔨</div>
          <h2>Bazart.</h2>
        </div>

        {/* Navigation Desktop */}
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.page}
              href={`#${link.page}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.(link.page);
                setMobileMenuOpen(false);
              }}
              className="nav-link"
            >
              <span className="nav-link-icon">{link.icon}</span>
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {/* Recherche */}
          <div className="search-wrapper" ref={searchRef}>
            <button
              className={`btn-icon search-toggle ${searchOpen ? 'active' : ''}`}
              onClick={() => setSearchOpen(!searchOpen)}
              title="Rechercher"
            >
              <Search size={20} strokeWidth={2} />
            </button>
            {searchOpen && (
              <div className="search-dropdown">
                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon-inner" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="search-input-inner"
                    autoFocus
                  />
                  <button className="search-close" onClick={() => setSearchOpen(false)}>
                    <X size={16} />
                  </button>
                </div>
                {loading && (
                  <div className="search-loading">
                    <div className="spinner-small"></div>
                    <span>Recherche en cours...</span>
                  </div>
                )}
                {!loading && searchTerm && searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="search-result-item"
                        onClick={() => {
                          onNavigate?.('product-detail', item.id);
                          setSearchOpen(false);
                        }}
                      >
                        <div>
                          <span className="result-title">{item.title}</span>
                          <span className="result-category">{item.category}</span>
                        </div>
                        <span className="result-price">{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!loading && searchTerm && searchResults.length === 0 && (
                  <div className="search-empty">
                    <Search size={24} />
                    <p>Aucun résultat pour "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {isClientLoggedIn && client ? (
            <>
              {/* Favoris */}
              <button
                className="btn-icon btn-favoris"
                title="Favoris"
                onClick={() => onNavigate?.('favoris')}
              >
                <Heart size={20} strokeWidth={2} />
              </button>

              {/* Notifications */}
              <div className="notif-wrapper" ref={notifRef}>
                <button
                  className={`btn-icon notif-btn ${notifOpen ? 'active' : ''}`}
                  onClick={() => setNotifOpen(!notifOpen)}
                  title="Notifications"
                >
                  <Bell size={20} strokeWidth={2} />
                  {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-header">
                      <span className="notif-title">
                        <Bell size={16} />
                        Notifications
                      </span>
                      <div className="notif-header-actions">
                        {unreadCount > 0 && (
                          <button className="notif-mark-all" onClick={markAllAsRead}>
                            Tout marquer comme lu
                          </button>
                        )}
                        <button className="notif-settings" onClick={() => onNavigate?.('notifications-settings')}>
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Filtres */}
                    <div className="notif-filters">
                      {filterOptions.map((filter) => (
                        <button
                          key={filter.value}
                          className={`notif-filter-btn ${notificationFilter === filter.value ? 'active' : ''}`}
                          onClick={() => setNotificationFilter(filter.value)}
                        >
                          {filter.label}
                          {filter.value !== 'all' && (
                            <span className="filter-count">
                              {notifications.filter(n => n.type === filter.value && !n.read).length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="notif-list">
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notif.id, notif.link, notif.action)}
                          >
                            <div 
                              className="notif-icon-wrapper"
                              style={{ backgroundColor: `${getNotificationColor(notif.type)}20` }}
                            >
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="notif-content">
                              <div className="notif-title-text">
                                {notif.title}
                                <span className="notif-type-badge" style={{ color: getNotificationColor(notif.type) }}>
                                  {getNotificationTypeLabel(notif.type)}
                                </span>
                              </div>
                              <div className="notif-message">{notif.message}</div>
                              <div className="notif-meta">
                                <span className="notif-time">
                                  <Clock size={12} />
                                  {notif.time}
                                </span>
                                {notif.action && (
                                  <span className="notif-action">{notif.action}</span>
                                )}
                              </div>
                            </div>
                            {!notif.read && <span className="notif-dot"></span>}
                          </div>
                        ))
                      ) : (
                        <div className="notif-empty">
                          <Bell size={32} />
                          <p>Aucune notification</p>
                          <span className="notif-empty-sub">Les notifications apparaîtront ici</span>
                        </div>
                      )}
                    </div>
                    <div className="notif-footer">
                      <button className="notif-view-all" onClick={() => onNavigate?.('notifications')}>
                        Voir toutes les notifications
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profil */}
              <div className="profile-menu" ref={dropdownRef}>
                <div
                  className="profile-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={client?.photo_profil ? `http://localhost:5000${client.photo_profil}` : 'https://i.pravatar.cc/150?img=5'}
                    alt="Profil"
                    className="profile-avatar-small"
                  />
                  <ChevronDown size={16} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                </div>

                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-user-avatar">
                        <img
                          src={client?.photo_profil ? `http://localhost:5000${client.photo_profil}` : 'https://i.pravatar.cc/150?img=5'}
                          alt={client?.nom}
                        />
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">{client?.prenom} {client?.nom}</span>
                        <small className="dropdown-user-email">{client?.email}</small>
                        <div className="dropdown-user-stats">
                          <span>{client?.enchères_actives || 0} enchères</span>
                          <span>{client?.produits_publiés || 0} produits</span>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    {/* SEULEMENT "Mon profil" dans le menu */}
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onNavigate?.(item.page);
                          setDropdownOpen(false);
                        }}
                        className="dropdown-item"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}

                    <div className="dropdown-divider"></div>

                    {/* Déconnexion */}
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <LogOut size={16} strokeWidth={2} />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => onNavigate?.('admin')}>
                Administration
              </button>
              <button className="btn-primary-header" onClick={() => onNavigate?.('auth')}>
                <User size={18} strokeWidth={2} />
                <span>Connexion</span>
              </button>
            </>
          )}

          {/* Menu mobile */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default BarreNavigation;