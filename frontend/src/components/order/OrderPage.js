// OrderPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/OrderPage.css'

const categories = ['Drinks', 'Appetizers', 'Entrees', 'Desserts'];

const OrderPage = ({ selectedTable, onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="order-page-container">
      <h2>Table {selectedTable} - Select a Category</h2>
      <div className="category-buttons-container">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => navigate(`/order/${category.toLowerCase()}`)}
            className="category-button"
          >
            {category}
          </button>
        ))}
      </div>
      <button onClick={onBack} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
};

export default OrderPage;
