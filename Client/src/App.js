import React,{useState} from 'react';
import Admin from './admin/admin';
import TempPage from './admin/TempPage';

function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
       {isLoggedIn ? <TempPage /> : <Admin  onLogin={handleLogin} />}
    </div>
  );
}

export default App;