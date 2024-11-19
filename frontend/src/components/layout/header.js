import React from 'react';
import '../../styles/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faUser, faCartShopping, faSterlingSign } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Header = ({ cart }) => {
  const navigate = useNavigate();

  // Function to handle tab clicks, navigating to specific routes
  const handleTabClick = (route) => {
    navigate(route);
  };

  const totalCartItems = Object.values(cart).reduce((total, tableItems) => total + tableItems.length, 0);

  return (
    <div className="header-container">
      <button onClick={() => handleTabClick('/dashboard')} className="header-button">
        <FontAwesomeIcon icon={faHouse} />
      </button>
      <button onClick={() => handleTabClick('/search')} className="header-button">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      <button onClick={() => handleTabClick('/customer')} className="header-button">
        <FontAwesomeIcon icon={faUser} />
      </button>
      <button onClick={() => handleTabClick('/cart')} className="header-button cart-button">
        <FontAwesomeIcon icon={faCartShopping} />
        {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
      </button>
      <button onClick={() => handleTabClick('/payment')} className="header-button">
        <FontAwesomeIcon icon={faSterlingSign} />
      </button>
    </div>
  );
};

export default Header;