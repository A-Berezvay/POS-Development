import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard'
import Header from './components/layout/header';
import CartPage from './components/cart/CartPage';

function App() {
    // State to track if the user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cart, setCart] = useState({});

    // Function to handle mock login
    const handleLogin = () => {
      setIsAuthenticated(true);
    };
  
    // Function to handle logout
    const handleLogout = () => {
      setIsAuthenticated(false);
    };

      // Function to add item to cart for a specific table
    const addItemToCart = (tableId, item) => {
      setCart((prevCart) => {
        const tableCart = prevCart[tableId] || [];
        return {
          ...prevCart,
          [tableId]: [...tableCart, item],
        };
      });
    };

      // Function to remove item from cart for a specific table
    const removeItemFromCart = (tableId, itemId) => {
      setCart((prevCart) => {
        const tableCart = prevCart[tableId] || [];
        return {
          ...prevCart,
          [tableId]: tableCart.filter((item) => item.id !== itemId),
        };
      });
    };

  return (
    <Router> 
      {/* Render Header only when user is authenticated */}
      {isAuthenticated && (
        <Header cart={cart} onLogout={handleLogout} onRemoveItem={removeItemFromCart} handleLogout={handleLogout}/>
        )}

      <Routes>
        <Route path='/' element={<LoginPage onLogin={handleLogin}/>} />
        {isAuthenticated && (
          <>
            <Route 
              path="/dashboard" 
              element={<Dashboard onAddToCart={addItemToCart} />} 
            />
            <Route
              path="/cart"
              element={<CartPage cart={cart} onRemoveItem={removeItemFromCart} />}
            />
          </>
          )}
      </Routes>
    </Router>
  );
}

export default App;

