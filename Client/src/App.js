import React, { useState } from 'react';
import Admin from './admin/admin';
import Dashboard from './admin/Dashboard';
import DomainesPage from './admin/DomainesPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Admin onLogin={handleLogin} />}
    </div>
  );
}

export default App;