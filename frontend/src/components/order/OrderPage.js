import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/OrderPage.css'

const menuItems = [
  { id: 1, name: 'Coke', category: 'drinks', price: 2 },
  { id: 2, name: 'Pepsi', category: 'drinks', price: 2 },
  { id: 3, name: 'Chicken Wings', category: 'appetizers', price: 5 },
  { id: 4, name: 'Mozzarella Sticks', category: 'appetizers', price: 4 },
  { id: 5, name: 'Grilled Steak', category: 'entrees', price: 15 },
  { id: 6, name: 'Pasta Carbonara', category: 'entrees', price: 10 },
  { id: 7, name: 'Cheesecake', category: 'desserts', price: 5 },
  { id: 8, name: 'Ice Cream', category: 'desserts', price: 4 },
];

const categories = ['Drinks', 'Appetizers', 'Entrees', 'Desserts'];

const OrderPage = ({ selectedTable, onAddToCart }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]); // State to manage items added to the cart
  const [itemState, setItemState] = useState({}); // State to handle quantity and notes for each item individually

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleAddToCart = (item) => {
    const newItem = {
      ...item,
      quantity: itemState[item.id]?.quantity || 1,
      note: itemState[item.id]?.note || '',
    };

    // Add to the local cart state
    setCart((prevCart) => [...prevCart, newItem]);

    // Pass the item to the global cart state
    onAddToCart(selectedTable, newItem);

    // Reset item state for the next add
    setItemState((prevState) => ({
      ...prevState,
      [item.id]: {
        quantity: 1,
        note: '',
      },
    }));
  };

  // Function to handle increasing the quantity for an item
  const handleIncreaseQuantity = (itemId) => {
    setItemState((prevState) => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        quantity: (prevState[itemId]?.quantity || 1) + 1,
      },
    }));
  };

  // Function to handle decreasing the quantity for an item
  const handleDecreaseQuantity = (itemId) => {
    setItemState((prevState) => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        quantity: Math.max((prevState[itemId]?.quantity || 1) - 1, 1),
      },
    }));
  };

  // Function to handle changing notes for an item
  const handleNotesChange = (itemId, event) => {
    setItemState((prevState) => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        note: event.target.value,
      },
    }));
  };

  return (
    <div className="order-page-container">
      <h2>Table {selectedTable} - Select a Category</h2>
      <div className="category-buttons-container">
        {categories.map((category) => (
          <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`category-button ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
        >
          {category}
        </button>
        ))}
      </div>
      {selectedCategory && (
        <div className="menu-items-container">
          <h3>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items</h3>
          {menuItems
            .filter((item) => item.category === selectedCategory)
            .map((item) => (
              <div key={item.id} className="menu-item-card">
                <h4>{item.name}</h4>
                <p>Price: £{item.price}</p>
                <div className="quantity-control">
                  <button onClick={() => handleDecreaseQuantity(item.id)} className="quantity-button">-</button>
                  <span className="quantity-display">{itemState[item.id]?.quantity || 1}</span>
                  <button onClick={() => handleIncreaseQuantity(item.id)} className="quantity-button">+</button>
                </div>
                <label htmlFor={`notes-${item.id}`}>Notes: </label>
                <input
                  id={`notes-${item.id}`}
                  type="text"
                  value={itemState[item.id]?.note || ''}
                  onChange={(event) => handleNotesChange(item.id, event)}
                  placeholder="Add notes (e.g., no ice)"
                />
                <button onClick={() => handleAddToCart(item)} className="add-to-cart-button">
                  Add to Cart
                </button>
              </div>
            ))}
        </div>
      )}
      {/* Display Cart */}
      {cart.length > 0 && (
        <div className="cart-container">
          <h3>Current Order</h3>
          {cart.map((cartItem, index) => (
            <div key={index} className="cart-item">
              <span>{cartItem.name}</span> - <span>{cartItem.price} DKK</span> - <span>Qty: {cartItem.quantity}</span>
              {cartItem.note && <span> (Note: {cartItem.note})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
