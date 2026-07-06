// client/Wallet.js
import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CreditCard,
  Clock,
  Calendar,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Shield,
  Lock,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Eye,
  History
} from 'lucide-react';
import { decryptData } from '../utils/crypto';
import StripePayment from './StripePayment'; // ✅ AJOUT
import './Wallet.css';

const WalletPage = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [quickAmounts] = useState([30, 100, 200, 500]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  
  // ✅ AJOUT - États pour le paiement Stripe
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!encryptedUser || !token) {
      onNavigate?.('auth');
      return;
    }

    const user = decryptData(encryptedUser);
    if (!user) {
      onNavigate?.('auth');
      return;
    }

    fetchWalletData(token);
  }, [onNavigate]);

  // ✅ Fonction corrigée - renommée sans "use" au début
  const getFallbackData = () => {
    return {
      solde: 500,
      solde_bloque: 200,
      solde_disponible: 300,
      devise: 'MAD',
      transactions: [
        {
          id: 1,
          type: 'debit',
          montant: 100,
          description: 'Paiement pour démarrage enchère - Produit: tf',
          date: '2025-12-24T12:13:00',
          solde_avant: 500,
          solde_apres: 400,
          reference: '8C091046',
          statut: 'completed',
          categorie: 'achat'
        },
        {
          id: 2,
          type: 'credit',
          montant: 100,
          description: 'Recharge du portefeuille',
          date: '2025-12-24T00:05:00',
          solde_avant: 500,
          solde_apres: 600,
          reference: 'F8B58166',
          statut: 'completed',
          categorie: 'recharge'
        },
        {
          id: 3,
          type: 'credit',
          montant: 100,
          description: 'Recharge Stripe - pi_35gCAX9gqbnHXW1EUp2Ecv',
          date: '2025-12-19T23:25:00',
          solde_avant: 500,
          solde_apres: 600,
          reference: '35gCAJ8gqbnHXW1EUp2Ecv',
          statut: 'completed',
          categorie: 'recharge'
        },
        {
          id: 4,
          type: 'debit',
          montant: 250,
          description: 'Paiement expertise - Produit: Tapis Berbère',
          date: '2025-12-18T14:30:00',
          solde_avant: 600,
          solde_apres: 350,
          reference: 'EXP-2025-004',
          statut: 'completed',
          categorie: 'expertise'
        },
        {
          id: 5,
          type: 'credit',
          montant: 450,
          description: 'Vente remportée - Collier Berbère',
          date: '2025-12-15T10:20:00',
          solde_avant: 350,
          solde_apres: 800,
          reference: 'VEN-2025-012',
          statut: 'completed',
          categorie: 'vente'
        },
        {
          id: 6,
          type: 'debit',
          montant: 75,
          description: 'Commission plateforme - Vente Tapis',
          date: '2025-12-14T16:45:00',
          solde_avant: 800,
          solde_apres: 725,
          reference: 'COM-2025-008',
          statut: 'completed',
          categorie: 'commission'
        }
      ]
    };
  };

  const fetchWalletData = async (token) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/wallet/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setWalletData(data.wallet);
        setTransactions(data.transactions || []);
        setFilteredTransactions(data.transactions || []);
      } else {
        setError(data.message || 'Erreur de chargement');
        // ✅ Utilisation de la fonction corrigée
        const fallbackData = getFallbackData();
        setWalletData(fallbackData);
        setTransactions(fallbackData.transactions);
        setFilteredTransactions(fallbackData.transactions);
      }
    } catch (error) {
      console.error('Erreur chargement wallet:', error);
      setError('Impossible de contacter le serveur');
      // ✅ Utilisation de la fonction corrigée
      const fallbackData = getFallbackData();
      setWalletData(fallbackData);
      setTransactions(fallbackData.transactions);
      setFilteredTransactions(fallbackData.transactions);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MODIFICATION - handleRecharge redirige vers StripePayment
  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }
    setPaymentAmount(amount);
    setShowPayment(true);
    setShowRechargeModal(false);
  };

  // ✅ Nouvelle fonction pour gérer le succès du paiement
  const handlePaymentSuccess = async (amount) => {
    setSuccess(`Recharge de ${formatPrice(amount)} effectuée avec succès !`);
    setShowPayment(false);
    // Recharger les données du wallet
    const token = localStorage.getItem('token');
    await fetchWalletData(token);
    setTimeout(() => setSuccess(''), 5000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    if (type === 'credit') {
      return <TrendingUp size={18} className="icon-credit" />;
    } else {
      return <TrendingDown size={18} className="icon-debit" />;
    }
  };

  const getTransactionTypeLabel = (type) => {
    return type === 'credit' ? 'RECHARGEMENT' : 'DÉBIT';
  };

  const getTransactionCategorieLabel = (categorie) => {
    const categories = {
      'achat': 'Achat',
      'recharge': 'Recharge',
      'expertise': 'Expertise',
      'vente': 'Vente',
      'commission': 'Commission'
    };
    return categories[categorie] || categorie;
  };

  const getTransactionStatusBadge = (statut) => {
    if (statut === 'completed') {
      return <span className="status-badge completed">Terminé</span>;
    } else if (statut === 'pending') {
      return <span className="status-badge pending">En cours</span>;
    } else {
      return <span className="status-badge failed">Échoué</span>;
    }
  };

  const applyFilters = () => {
    let filtered = transactions;
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType, transactions]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleQuickAmount = (amount) => {
    setRechargeAmount(amount.toString());
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (loading) {
    return (
      <div className="wallet-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement de votre portefeuille...</p>
        </div>
      </div>
    );
  }

  if (!walletData) return null;

  return (
    <div className="wallet-page">
      {/* Header */}
      <section className="wallet-header">
        <div className="header-content">
          <div className="header-icon">
            <Wallet size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1>Portefeuille Électronique</h1>
            <p className="header-subtitle">Gérez vos finances avec sécurité et transparence</p>
          </div>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div className="message-banner error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}
      {success && (
        <div className="message-banner success">
          <CheckCircle size={18} />
          <span>{success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* Solde */}
      <section className="balance-section">
        <div className="balance-card">
          <div className="balance-header">
            <span className="balance-label">Solde Actuel</span>
            <div className="balance-actions">
              <button className="btn-toggle-balance" onClick={toggleBalanceVisibility}>
                <Eye size={16} />
              </button>
              <Shield size={16} className="shield-icon" />
            </div>
          </div>
          <div className="balance-amount">
            {showBalance ? formatPrice(walletData.solde) : '••••••'}
          </div>
          <div className="balance-details">
            <div className="balance-detail">
              <Lock size={14} />
              <span>Bloqué : {showBalance ? formatPrice(walletData.solde_bloque || 0) : '••••••'}</span>
            </div>
            <div className="balance-detail">
              <DollarSign size={14} />
              <span>Disponible : {showBalance ? formatPrice(walletData.solde_disponible || walletData.solde) : '••••••'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="actions-section">
        <button 
          className="btn-recharge"
          onClick={() => setShowRechargeModal(true)}
        >
          <CreditCard size={18} />
          Recharger le Portefeuille
        </button>
        <button 
          className="btn-history"
          onClick={() => document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <History size={18} />
          Voir l'historique
        </button>
      </section>

      {/* Historique */}
      <section className="history-section" id="history-section">
        <div className="history-header">
          <h2>Historique des Opérations</h2>
          <button className="btn-refresh" onClick={() => fetchWalletData(localStorage.getItem('token'))}>
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="history-filters">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une opération..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Toutes les opérations</option>
            <option value="credit">Crédits</option>
            <option value="debit">Débits</option>
          </select>
        </div>

        <div className="transactions-list">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div 
                className="transaction-item" 
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="transaction-icon">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="transaction-info">
                  <div className="transaction-header">
                    <span className={`transaction-type ${transaction.type}`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatPrice(transaction.montant)}
                    </span>
                  </div>
                  <p className="transaction-description">{transaction.description}</p>
                  <div className="transaction-meta">
                    <span className="transaction-date">
                      <Calendar size={12} />
                      {formatDate(transaction.date)}
                    </span>
                    <span className="transaction-reference">
                      <FileText size={12} />
                      REF: {transaction.reference}
                    </span>
                    {transaction.statut && getTransactionStatusBadge(transaction.statut)}
                  </div>
                </div>
                <ChevronRight size={16} className="transaction-arrow" />
              </div>
            ))
          ) : (
            <div className="empty-transactions">
              <Search size={48} className="empty-icon" />
              <h3>Aucune opération trouvée</h3>
              <p>Aucune transaction ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>

        <div className="history-footer">
          <span className="history-count">
            {filteredTransactions.length} opération{filteredTransactions.length > 1 ? 's' : ''}
            {searchTerm && ` (${transactions.length} au total)`}
          </span>
        </div>
      </section>

      {/* Modal Recharge */}
      {showRechargeModal && (
        <div className="modal-overlay" onClick={() => setShowRechargeModal(false)}>
          <div className="modal-content recharge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <CreditCard size={20} />
                Recharger le Portefeuille
              </h2>
              <button className="modal-close" onClick={() => setShowRechargeModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="recharge-form">
                <label>Montant à recharger (MAD)</label>
                <input
                  type="number"
                  className="recharge-input"
                  placeholder="0"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  min="1"
                  step="1"
                />
                
                <div className="quick-amounts">
                  <span className="quick-label">Montants rapides :</span>
                  <div className="quick-buttons">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        className={`quick-btn ${parseFloat(rechargeAmount) === amount ? 'active' : ''}`}
                        onClick={() => handleQuickAmount(amount)}
                      >
                        {formatPrice(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="recharge-summary">
                  <span>Vous allez recharger</span>
                  <strong>{rechargeAmount ? formatPrice(parseFloat(rechargeAmount)) : formatPrice(0)}</strong>
                </div>

                <div className="recharge-info">
                  <Lock size={14} />
                  <span>Paiement sécurisé via Stripe</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowRechargeModal(false)}>Annuler</button>
              <button 
                className="btn-confirm" 
                onClick={handleRecharge}
                disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
              >
                Recharger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ AJOUT - Page de paiement Stripe */}
      {showPayment && (
        <StripePayment
          onNavigate={onNavigate}
          amount={paymentAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPayment(false);
            setRechargeAmount('');
          }}
        />
      )}

      {/* Modal Détails Transaction */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-content transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de l'opération</h2>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Type</span>
                <span className={`detail-value type-${selectedTransaction.type}`}>
                  {getTransactionTypeLabel(selectedTransaction.type)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Montant</span>
                <span className="detail-value amount">
                  {selectedTransaction.type === 'credit' ? '+' : '-'}
                  {formatPrice(selectedTransaction.montant)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description</span>
                <span className="detail-value">{selectedTransaction.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formatDate(selectedTransaction.date)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Référence</span>
                <span className="detail-value reference">{selectedTransaction.reference}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Statut</span>
                <span className="detail-value">{getTransactionStatusBadge(selectedTransaction.statut)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Solde avant</span>
                <span className="detail-value">{formatPrice(selectedTransaction.solde_avant)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Solde après</span>
                <span className="detail-value">{formatPrice(selectedTransaction.solde_apres)}</span>
              </div>
              {selectedTransaction.categorie && (
                <div className="detail-row">
                  <span className="detail-label">Catégorie</span>
                  <span className="detail-value">
                    {getTransactionCategorieLabel(selectedTransaction.categorie)}
                  </span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-download" onClick={() => alert('Téléchargement de la facture')}>
                <Download size={16} />
                Télécharger la facture
              </button>
              <button className="btn-close" onClick={() => setSelectedTransaction(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;