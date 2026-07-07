// client/components/Layout.js
import React from 'react';
import BarreNavigation from './BarreNavigation';
import Footer from './Footer';

const Layout = ({ children, onNavigate, isClientLoggedIn, onClientLogout }) => {
  return (
    <div className="page-layout">
      <BarreNavigation 
        key="main-navigation" // ✅ AJOUTE CETTE LIGNE
        onNavigate={onNavigate} 
        isClientLoggedIn={isClientLoggedIn} 
        onClientLogout={onClientLogout} 
      />
      <main className="page-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;