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

  // Function to add item to cart for a specific table
  const addItemToCart = (tableId, item) => {
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];

      // Check if the item already exists in the cart
      const existingItemIndex = tableCart.findIndex((cartItem) => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update its quantity
        const updatedTableCart = [...tableCart];
        updatedTableCart[existingItemIndex] = {
          ...updatedTableCart[existingItemIndex],
          quantity: updatedTableCart[existingItemIndex].quantity + item.quantity,
        };
        return {
          ...prevCart,
          [tableId]: updatedTableCart,
        };
      } else {
        // Item doesn't exist, add it to the cart
        return {
          ...prevCart,
          [tableId]: [...tableCart, item],
        };
      }
    });

    // Update the table status and assign a waiter once an item is added to the cart
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === Number(tableId) ? { ...table, status: 'occupied', waiter: 'John Doe' } : table
      )
    );
  };

  // Function to remove item from cart for a specific table
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
            table.id === Number(tableId) ? { ...table, status: 'free', waiter: null } : table
          )
        );
      }

      return updatedCart;
    });
  };

  // Function to update item quantity in cart
  const updateItemQuantity = (tableId, itemId, quantityChange) => {
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];
      const updatedTableCart = tableCart.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + quantityChange) }
          : item
      );

      return {
        ...prevCart,
        [tableId]: updatedTableCart,
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

    // Update the table status to indicate the order is now waiting for payment
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === Number(tableId) ? { ...table, status: 'waiting-for-payment' } : table
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
              element={<Dashboard tables={tables} onAddToCart={addItemToCart} />} 
            />
            <Route
              path="/table/:tableId/order"
              element={
                <OrderPage
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
                  onUpdateQuantity={updateItemQuantity} // Pass the function here
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



