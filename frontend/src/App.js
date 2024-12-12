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
    { id: 4, status: 'free', waiter: null, numberOfGuests: null },
    { id: 5, status: 'free', waiter: null, numberOfGuests: null },
    { id: 6, status: 'free', waiter: null, numberOfGuests: null },
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
  
      // Find an existing item in the cart that matches the same ID, note, modifiers, and allergens
      const existingItemIndex = tableCart.findIndex(
        (cartItem) =>
          cartItem.id === newItem.id &&
          cartItem.note === newItem.note &&
          JSON.stringify(cartItem.modifier) === JSON.stringify(newItem.modifier) &&
          JSON.stringify(cartItem.allergens) === JSON.stringify(newItem.allergens) // Check allergens match
      );
  
      if (existingItemIndex !== -1) {
        // Update quantity of existing item with the same modifiers and allergens
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
        // If it's a new item (or different allergens), add it separately
        return {
          ...prevCart,
          [tableId]: [...tableCart, newItem],
        };
      }
    });
  
    // Optionally update the table status to 'occupied'
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
        // Find existing order with exact match of id, note, modifiers, and allergens
        const existingOrderIndex = updatedOrdersForTable.findIndex(
          (order) =>
            order.id === cartItem.id &&
            order.note === cartItem.note &&
            JSON.stringify(order.modifier) === JSON.stringify(cartItem.modifier) &&
            JSON.stringify(order.allergens) === JSON.stringify(cartItem.allergens)
        );
  
        if (existingOrderIndex !== -1) {
          // Update quantity of existing order if found
          updatedOrdersForTable[existingOrderIndex] = {
            ...updatedOrdersForTable[existingOrderIndex],
            quantity: updatedOrdersForTable[existingOrderIndex].quantity + cartItem.quantity,
          };
        } else {
          // Add as a new order if no match is found
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
      const tableOrders = prevOrders[tableId] || [];
      const itemIndex = tableOrders.findIndex(order => order.id === itemId);
  
      if (itemIndex !== -1) {
        const item = tableOrders[itemIndex];
  
        if (item.quantity > 1) {
          // Prompt user for quantity to void
          const voidQuantity = parseInt(prompt(`This item has a quantity of ${item.quantity}. How many would you like to void?`, "1"), 10);
  
          if (!isNaN(voidQuantity) && voidQuantity > 0 && voidQuantity <= item.quantity) {
            const updatedOrders = [...tableOrders];
  
            if (voidQuantity === item.quantity) {
              // Remove the item if the entire quantity is voided
              updatedOrders.splice(itemIndex, 1);
            } else {
              // Update the item's quantity
              updatedOrders[itemIndex] = {
                ...item,
                quantity: item.quantity - voidQuantity,
              };
            }
            return {
              ...prevOrders,
              [tableId]: updatedOrders,
            };
          } else {
            console.error("Invalid void quantity entered.");
            return prevOrders;
          }
        } else {
          // Remove the item if quantity is 1
          const updatedOrders = tableOrders.filter(order => order.id !== itemId);
          console.log(`Voided ${item.quantity} of ${item.name} from table ${tableId}. Reason: ${reason}`);
          return {
            ...prevOrders,
            [tableId]: updatedOrders,
          };
        }
      }
      return prevOrders;
    });
  
    // Update the cart if necessary
    setCart((prevCart) => {
      const tableCart = prevCart[tableId] || [];
      const itemIndex = tableCart.findIndex(item => item.id === itemId);
  
      if (itemIndex !== -1) {
        const item = tableCart[itemIndex];
  
        if (item.quantity > 1) {
          const voidQuantity = parseInt(prompt(`This item has a quantity of ${item.quantity}. How many would you like to void?`, "1"), 10);
  
          if (!isNaN(voidQuantity) && voidQuantity > 0 && voidQuantity <= item.quantity) {
            const updatedCart = [...tableCart];
  
            if (voidQuantity === item.quantity) {
              updatedCart.splice(itemIndex, 1);
            } else {
              updatedCart[itemIndex] = {
                ...item,
                quantity: item.quantity - voidQuantity,
              };
            }
  
            return {
              ...prevCart,
              [tableId]: updatedCart,
            };
          } else {
            console.error("Invalid void quantity entered.");
            return prevCart;
          }
        } else {
          const updatedCart = tableCart.filter(item => item.id !== itemId);
          return {
            ...prevCart,
            [tableId]: updatedCart,
          };
        }
      }
      return prevCart;
    });
  };
  
  const onPayment = (tableId) => {
    setOrdersReadyForPayment((prevOrders) => {
      const updatedOrders = { ...prevOrders };
      delete updatedOrders[tableId]; // Remove orders for the table
      return updatedOrders;
    });
  
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === Number(tableId)
          ? { ...table, status: 'free', waiter: null, numberOfGuests: null } // Reset table status
          : table
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
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  tables={tables} 
                  setTables={setTables} 
                  onAddToCart={addItemToCart} 
                />
              } 
            />
            <Route 
              path="/table/:tableId/order" 
              element={
                <OrderPage 
                  tables={tables}
                  setTables={setTables} 
                  onAddToCart={addItemToCart} 
                  ordersReadyForPayment={ordersReadyForPayment}
                  onRemoveOrderItem={onRemoveOrderItem} 
                />
              } 
            />
            <Route 
              path="/payment" 
              element={
                <PaymentProcessingPage 
                  ordersReadyForPayment={ordersReadyForPayment} 
                  onPayment={onPayment}
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
          onPayment={() => onPayment(currentTableForSplit)}
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

