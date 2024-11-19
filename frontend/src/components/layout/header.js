import React, { useState } from 'react';
import '../../styles/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faCartShopping, faSterlingSign, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = ({ cart, onLogout, waiterName = 'John Doe' }) => {
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Function to handle tab clicks, navigating to specific routes
  const handleTabClick = (route) => {
    navigate(route);
  };

  const totalCartItems = Object.values(cart).reduce((total, tableItems) => total + tableItems.length, 0);

  const handleUserIconClick = () => {
    setShowLogoutMenu((prev) => !prev);
  };

  const handleLogout = () => {
    setShowLogoutMenu(false);
    onLogout();
    navigate('/');
  };

  return (
    <div>
      {/* User Icon and Waiter Name */}
      <div className="user-info-container">
        <button onClick={handleUserIconClick} className="user-button">
          <FontAwesomeIcon icon={faUser} />
          <span className="waiter-name">{waiterName}</span>
        </button>
        {showLogoutMenu && (
          <div className="logout-menu">
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="header-container">
        <button onClick={() => handleTabClick('/dashboard')} className="header-button">
          <FontAwesomeIcon icon={faHouse} />
        </button>
        <button onClick={() => handleTabClick('/search')} className="header-button">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button onClick={() => handleTabClick('/payment')} className="header-button">
          <FontAwesomeIcon icon={faSterlingSign} />
        </button>
      </div>
    </div>
  );
};

export default Header;
