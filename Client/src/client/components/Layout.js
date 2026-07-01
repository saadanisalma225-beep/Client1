import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onNavigate, isClientLoggedIn, onClientLogout }) => {
  return (
    <div className="page-layout">
      <Header 
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