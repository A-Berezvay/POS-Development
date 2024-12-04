import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard';
import OrderPage from './components/order/OrderPage';
import Header from './components/layout/header';
import CartModal from './components/cart/CartModal';
import PaymentProcessingPage from './components/payment/PaymentProcessingPage';
import SplitPaymentModal from './components/payment/SplitPaymentModal';

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState({});
  const [ordersReadyForPayment, setOrdersReadyForPayment] = useState({});
  const [tables, setTables] = useState([
    { id: 1, status: 'free', waiter: null, numberOfGuests: null },
    { id: 2, status: 'free', waiter: null, numberOfGuests: null },
    { id: 3, status: 'free', waiter: null, numberOfGuests: null },
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

  const addItemToCart = (tableId, newItem) => {
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];
  
      // Unique key for each item including modifiers and notes
      const existingItemIndex = tableCart.findIndex(
        (cartItem) => 
          cartItem.id === newItem.id &&
          cartItem.note === newItem.note &&
          JSON.stringify(cartItem.modifier) === JSON.stringify(newItem.modifier)
      );
  
      if (existingItemIndex !== -1) {
        // Update quantity of existing item with same modifier
        const updatedTableCart = [...tableCart];
        updatedTableCart[existingItemIndex] = {
          ...updatedTableCart[existingItemIndex],
          quantity: updatedTableCart[existingItemIndex].quantity + newItem.quantity,
        };
        return {
          ...prevCart,
          [tableId]: updatedTableCart,
        };
      } else {
        // If it's a new item (or different modifier), add it separately
        return {
          ...prevCart,
          [tableId]: [...tableCart, newItem],
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
            table.id === Number(tableId) ? { ...table, status: 'free', waiter: null, numberOfGuests: null } : table
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
  
      // Create a copy of the existing orders to update
      let combinedOrders = [...existingOrdersForTable];
  
      newOrdersForTable.forEach((newItem) => {
        const existingItemIndex = combinedOrders.findIndex(
          (existingItem) =>
            existingItem.id === newItem.id &&
            existingItem.note === newItem.note &&
            JSON.stringify(existingItem.modifier) === JSON.stringify(newItem.modifier)
        );
  
        if (existingItemIndex !== -1) {
          // If an identical item exists, increment its quantity
          combinedOrders[existingItemIndex].quantity += newItem.quantity;
        } else {
          // If no identical item exists, add it to the combined orders
          combinedOrders.push({ ...newItem });
        }
      });
  
      return {
        ...prevOrders,
        [tableId]: combinedOrders,
      };
    });
  
    // Clear the cart for that table after sending orders to the kitchen
    setCart((prevCart) => {
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
        table.id === Number(tableId) ? { ...table, status: 'free', waiter: null, numberOfGuests: null } : table
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
            <Route path="/dashboard" element={<Dashboard tables={tables} setTables={setTables} onAddToCart={addItemToCart} />} />
            <Route path="/table/:tableId/order" element={<OrderPage setTables={setTables} onAddToCart={addItemToCart} ordersReadyForPayment={ordersReadyForPayment} />} />
            <Route 
              path="/payment" 
              element={
                <PaymentProcessingPage 
                  ordersReadyForPayment={ordersReadyForPayment} 
                  onPayment={handlePayment}
                  onSplitPayment={openSplitPaymentModal}
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

