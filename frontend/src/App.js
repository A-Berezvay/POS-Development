import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard';
import OrderPage from './components/order/OrderPage';
import Header from './components/layout/header';
import CartModal from './components/cart/CartModal';
import PaymentProcessingPage from './components/payment/PaymentProcessingPage';
import SplitPaymentModal from './components/payment/SplitPaymentModal'; // Import SplitPaymentModal

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState({});
  const [ordersReadyForPayment, setOrdersReadyForPayment] = useState({});
  const [tables, setTables] = useState([
    { id: 1, status: 'free', waiter: null },
    { id: 2, status: 'free', waiter: null },
    { id: 3, status: 'free', waiter: null },
    // Add more tables as needed
  ]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);

  // State to manage split payment modal visibility and the current table being split
  const [isSplitModalVisible, setIsSplitModalVisible] = useState(false);
  const [currentTableForSplit, setCurrentTableForSplit] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const addItemToCart = (tableId, item) => {
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];

      const existingItemIndex = tableCart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
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
        return {
          ...prevCart,
          [tableId]: [...tableCart, item],
        };
      }
    });

    // Update table status to occupied and assign a waiter
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === Number(tableId) ? { ...table, status: 'occupied', waiter: 'John Doe' } : table
      )
    );

    // Automatically make the cart modal visible when an item is added
    setIsCartModalVisible(true);
  };

  const removeItemFromCart = (tableId, itemId) => {
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];
      const updatedTableCart = tableCart.filter((item) => item.id !== itemId);

      const updatedCart = {
        ...prevCart,
        [tableId]: updatedTableCart,
      };

      if (updatedTableCart.length === 0) {
        delete updatedCart[tableId];
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.id === Number(tableId) ? { ...table, status: 'free', waiter: null } : table
          )
        );

        // Hide cart modal if the cart is empty
        setIsCartModalVisible(false);
      }

      return updatedCart;
    });
  };

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

  const sendOrderToKitchen = (tableId) => {
    setOrdersReadyForPayment((prevOrders) => {
      const existingOrdersForTable = prevOrders[tableId] || [];
      const newOrdersForTable = cart[tableId] || [];
  
      // Combine existing orders with new orders, summing quantities of identical items
      const combinedOrders = [...existingOrdersForTable];
  
      newOrdersForTable.forEach((newItem) => {
        const existingItemIndex = combinedOrders.findIndex(item => item.id === newItem.id);
        if (existingItemIndex !== -1) {
          combinedOrders[existingItemIndex].quantity += newItem.quantity;
        } else {
          combinedOrders.push({...newItem});
        }
      });
  
      return {
        ...prevOrders,
        [tableId]: combinedOrders,
      };
    });
  
    // Clear the cart for that table after sending orders to the kitchen
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      delete updatedCart[tableId];
      return updatedCart;
    });
  
    // Hide the cart modal
    setIsCartModalVisible(false);
  };
  

  // Function to handle payment for a table
  const handlePayment = (tableId) => {
    setOrdersReadyForPayment((prevOrders) => {
      const updatedOrders = { ...prevOrders };
      delete updatedOrders[tableId];
      return updatedOrders;
    });

    // Update the table status to 'free' after payment is made
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === Number(tableId) ? { ...table, status: 'free', waiter: null } : table
      )
    );
  };

  // Function to open the split payment modal
  const openSplitPaymentModal = (tableId) => {
    setCurrentTableForSplit(tableId);
    setIsSplitModalVisible(true);
  };

  // Function to close the split payment modal
  const closeSplitPaymentModal = () => {
    setIsSplitModalVisible(false);
    setCurrentTableForSplit(null);
  };

  return (
    <Router>
      {isAuthenticated && (
        <Header cart={cart} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path='/' element={<LoginPage onLogin={handleLogin} />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<Dashboard tables={tables} onAddToCart={addItemToCart} />} />
            <Route path="/table/:tableId/order" element={<OrderPage onAddToCart={addItemToCart} ordersReadyForPayment={ordersReadyForPayment} />} />
            <Route 
              path="/payment" 
              element={
                <PaymentProcessingPage 
                  ordersReadyForPayment={ordersReadyForPayment} 
                  onPayment={handlePayment}
                  onSplitPayment={openSplitPaymentModal} // Pass function to open split payment modal
                />
              } 
            />
          </>
        )}
      </Routes>

      <CartModal
        isVisible={isCartModalVisible}
        cart={cart}
        onClose={() => setIsCartModalVisible(false)}
        onRemoveItem={removeItemFromCart}
        onUpdateQuantity={updateItemQuantity}
        onSendToKitchen={sendOrderToKitchen}
      />

      {isSplitModalVisible && currentTableForSplit !== null && (
        <SplitPaymentModal
          ordersReadyForPayment={ordersReadyForPayment[currentTableForSplit]}
          onClose={closeSplitPaymentModal}
          onPayment={() => handlePayment(currentTableForSplit)}
        />
      )}
    </Router>
  );
}

export default App;
