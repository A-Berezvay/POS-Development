import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './pages/dashboard';
import OrderPage from './components/order/OrderPage';
import Header from './components/layout/header';
import CartModal from './components/cart/CartModal';
import PaymentProcessingPage from './components/payment/PaymentProcessingPage';
import SplitPaymentModal from './components/payment/SplitPaymentModal';
import AllergenModal from './components/order/AllergenModal';

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
  const [isAllergenModalVisible, setIsAllergenModalVisible] = useState(false);
  const [currentAllergens, setCurrentAllergens] = useState([]);

  // State to manage split payment modal visibility and the current table being split
  const [isSplitModalVisible, setIsSplitModalVisible] = useState(false);
  const [currentTableForSplit, setCurrentTableForSplit] = useState(null);

  {/* LOGIN */}
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
  
  // Function to show allergens in a full-screen modal
  const handleShowAllergens = (allergens) => {
    setCurrentAllergens(allergens);
    setIsAllergenModalVisible(true);
  };

  const handleCloseAllergens = () => {
    setIsAllergenModalVisible(false);
    setCurrentAllergens([]);
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
      const tableCart = cart[tableId] || [];
      const updatedOrdersForTable = [...(prevOrders[tableId] || [])];
  
      tableCart.forEach((cartItem) => {
        const existingOrderIndex = updatedOrdersForTable.findIndex(
          (order) =>
            order.id === cartItem.id &&
            order.note === cartItem.note &&
            JSON.stringify(order.modifier) === JSON.stringify(cartItem.modifier)
        );
  
        if (existingOrderIndex !== -1) {
          // Update quantity of existing item in ordersReadyForPayment
          updatedOrdersForTable[existingOrderIndex] = {
            ...updatedOrdersForTable[existingOrderIndex],
            quantity: updatedOrdersForTable[existingOrderIndex].quantity + cartItem.quantity,
          };
        } else {
          // Add the item as a new entry
          updatedOrdersForTable.push(cartItem);
        }
      });
  
      return {
        ...prevOrders,
        [tableId]: updatedOrdersForTable,
      };
    });
  
    // Clear the cart for the table after sending the order
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[tableId];
      return updatedCart;
    });
  
    // Optionally hide the cart modal
    setIsCartModalVisible(false);
  };
  

  const onRemoveOrderItem = (tableId, itemId, reason) => {
    setOrdersReadyForPayment((prevOrders) => {
      const updatedOrdersForTable = (prevOrders[tableId] || []).filter(order => order.id !== itemId);
      return {
        ...prevOrders,
        [tableId]: updatedOrdersForTable,
      };
    });

    // Modify the cart if it should reflect void actions
    setCart((prevCart) => {
      const updatedCartForTable = (prevCart[tableId] || []).filter(item => item.id !== itemId);
      return {
        ...prevCart,
        [tableId]: updatedCartForTable,
      };
    });
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
            <Route 
              path="/table/:tableId/order" 
              element={<OrderPage setTables={setTables} 
              onAddToCart={addItemToCart} 
              ordersReadyForPayment={ordersReadyForPayment}
              onRemoveOrderItem={onRemoveOrderItem} />} />
            <Route 
              path="/payment" 
              element={
                <PaymentProcessingPage 
                  ordersReadyForPayment={ordersReadyForPayment} 
                  onPayment={handlePayment}
                  onSplitPayment={openSplitPaymentModal}
                  onRemoveOrderItem={onRemoveOrderItem}
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
        onShowAllergens={handleShowAllergens}
      />

      {isSplitModalVisible && currentTableForSplit !== null && (
        <SplitPaymentModal
          ordersReadyForPayment={ordersReadyForPayment[currentTableForSplit]}
          onClose={closeSplitPaymentModal}
          onPayment={() => handlePayment(currentTableForSplit)}
        />
      )}

      {isAllergenModalVisible && (
        <AllergenModal
          allergens={currentAllergens}
          isVisible={isAllergenModalVisible}
          onClose={handleCloseAllergens}
          selectedAllergens={[]}
          onConfirmAllergens={(allergens) => console.log("Confirmed Allergens:", allergens)}
        />
      )}
    </Router>
  );
}

export default App;

