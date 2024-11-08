import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard'
import Header from './components/layout/header';
import CartPage from './components/cart/CartPage';
import PaymentProcessingPage from './components/payment/PaymentProcessingPage';

function App() {
    // State to track if the user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cart, setCart] = useState({});
    const [ordersReadyForPayment, setOrdersReadyForPayment] = useState({});

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

    // Send an order to the kitchen
    const sendOrderToKitchen = (tableId) => {
      // Move the order from cart to orders ready for payment
      setOrdersReadyForPayment((prevOrders) => ({
        ...prevOrders,
        [tableId]: cart[tableId],
      }));
      setCart((prevCart) => {
        const updatedCart = { ...prevCart };
        delete updatedCart[tableId];
        return updatedCart;
      });
    };

    // Handle payment for a specific table
    const handlePayment = (tableId) => {
      setOrdersReadyForPayment((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        delete updatedOrders[tableId];
        return updatedOrders;
      });
    };

    // Function to update the quantity of an item in the cart for a specific table
  const onUpdateQuantity = (tableId, itemId, delta) => {
    setCart((prevCart) => {
      const updatedTable = prevCart[tableId].map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(item.quantity + delta, 1) };
        }
        return item;
      });
      return {
        ...prevCart,
        [tableId]: updatedTable,
      };
    });
  };

  // Function to update the note for an item in the cart for a specific table
  const onUpdateNote = (tableId, itemId, newNote) => {
    setCart((prevCart) => {
      const updatedTable = prevCart[tableId].map((item) => {
        if (item.id === itemId) {
          return { ...item, note: newNote };
        }
        return item;
      });
      return {
        ...prevCart,
        [tableId]: updatedTable,
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
              element={
                <CartPage 
                  cart={cart} 
                  onRemoveItem={removeItemFromCart} 
                  onSendToKitchen={sendOrderToKitchen}
                  onUpdateQuantity={onUpdateQuantity}
                  onUpdateNote={onUpdateNote} />}
            />
            <Route
              path="/payment"
              element={<PaymentProcessingPage ordersReadyForPayment={ordersReadyForPayment} onPayment={handlePayment} />}
            />
          </>
          )}
      </Routes>
    </Router>
  );
}

export default App;

