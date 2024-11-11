import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard';
import OrderPage from './components/order/OrderPage';
import Header from './components/layout/header';
import CartPage from './components/cart/CartPage';
import PaymentProcessingPage from './components/payment/PaymentProcessingPage';

function App() {
  
  // State to track if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState({});
  const [ordersReadyForPayment, setOrdersReadyForPayment] = useState({});

  // Add new state to track table statuses
  const [tables, setTables] = useState([
    { id: 1, status: 'free', waiter: null },
    { id: 2, status: 'free', waiter: null },
    { id: 3, status: 'free', waiter: null },
    // Add more tables as needed
  ]);

  // Function to handle mock login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Function to update table status and assign a waiter
  const handleOpenTable = (tableId, waiter = 'Current Waiter') => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, status: 'occupied', waiter } : table
      )
    );
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

  const removeItemFromCart = (tableId, itemId) => {
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];
      const updatedTableCart = tableCart.filter((item) => item.id !== itemId);
      
      const updatedCart = {
        ...prevCart,
        [tableId]: updatedTableCart,
      };
  
      // If the updated cart for this table is empty, delete it and update table status
      if (updatedTableCart.length === 0) {
        delete updatedCart[tableId];
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.id === tableId ? { ...table, status: 'free', waiter: null } : table
          )
        );
      }
  
      return updatedCart;
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

  // Update the table status to indicate the order is now in the kitchen
  setTables((prevTables) =>
    prevTables.map((table) =>
      table.id === tableId ? { ...table, status: 'in-kitchen' } : table
    )
  );
};

  return (
    <Router> 
      {/* Render Header only when user is authenticated */}
      {isAuthenticated && (
        <Header cart={cart} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path='/' element={<LoginPage onLogin={handleLogin}/>} />
        {isAuthenticated && (
          <>
            <Route 
              path="/dashboard" 
              element={<Dashboard tables={tables} onOpenTable={handleOpenTable} />} 
            />
            <Route
              path="/table/:tableId/order"
              element={
                <OrderPage
                  tables={tables}
                  cart={cart}
                  onAddToCart={addItemToCart}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage 
                  cart={cart} 
                  onRemoveItem={removeItemFromCart} 
                  onSendToKitchen={sendOrderToKitchen}
                />
              }
            />
            <Route
              path="/payment"
              element={<PaymentProcessingPage ordersReadyForPayment={ordersReadyForPayment} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;






