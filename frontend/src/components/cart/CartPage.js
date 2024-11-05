import React from 'react';
import '../../styles/CartPage.css';

const CartPage = ({ cart, onRemoveItem }) => {
  return (
    <div className="cart-page-container">
      <h2>Cart Summary</h2>
      {Object.keys(cart).length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        Object.keys(cart).map((tableId) => (
          <div key={tableId} className="table-cart">
            <h3>Table {tableId}</h3>
            {cart[tableId].map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.name} - {item.price} DKK</span>
                <button onClick={() => onRemoveItem(tableId, item.id)} className="remove-button">
                  Remove
                </button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
