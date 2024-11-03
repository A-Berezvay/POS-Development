import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard'
import Header from './components/layout/header';

function App() {
    // State to track if the user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to handle mock login
    const handleLogin = () => {
      setIsAuthenticated(true);
    };
  
    // Function to handle logout
    const handleLogout = () => {
      setIsAuthenticated(false);
    };

  return (
    <Router> 
      {/* Render Header only when user is authenticated */}
      {isAuthenticated && <Header />}

      <Routes>
        <Route path='/' element={<LoginPage onLogin={handleLogin}/>} />
        {isAuthenticated && (
            <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
          )}
      </Routes>
    </Router>
  );
}

export default App;

