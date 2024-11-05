// OrderPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/OrderPage.css'

const menuItems = [
  { id: 1, name: 'Coke', category: 'drinks', price: 15 },
  { id: 2, name: 'Pepsi', category: 'drinks', price: 15 },
  { id: 3, name: 'Chicken Wings', category: 'appetizers', price: 45 },
  { id: 4, name: 'Mozzarella Sticks', category: 'appetizers', price: 40 },
  { id: 5, name: 'Grilled Steak', category: 'entrees', price: 120 },
  { id: 6, name: 'Pasta Carbonara', category: 'entrees', price: 95 },
  { id: 7, name: 'Cheesecake', category: 'desserts', price: 50 },
  { id: 8, name: 'Ice Cream', category: 'desserts', price: 30 },
];

const categories = ['Drinks', 'Appetizers', 'Entrees', 'Desserts'];

const OrderPage = ({ selectedTable, onBack, onAddToCart }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]); // State to manage items added to the cart

  // Function to handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category.toLowerCase());
  };

  const handleAddToCart = (item) => {
    onAddToCart(selectedTable, item);
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
                <p>Price: {item.price} DKK</p>
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
              <span>{cartItem.name}</span> - <span>{cartItem.price} DKK</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={onBack} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
};

export default OrderPage;
