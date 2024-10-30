import React from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // Function to handle tab clicks, navigating to specific routes
  const handleTabClick = (route) => {
    navigate(route);
  };

  return (
    <div className="header-container">
      <button onClick={() => handleTabClick('/dashboard')} className="header-button">Dashboard</button>
      <button onClick={() => handleTabClick('/search')} className="header-button">Search</button>
      <button onClick={() => handleTabClick('/customer')} className="header-button">Customer</button>
      <button onClick={() => handleTabClick('/cart')} className="header-button">Basket/Cart</button>
      <button onClick={() => handleTabClick('/payment')} className="header-button">Payment</button>
    </div>
  );
};

export default Header;