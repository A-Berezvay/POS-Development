import React from 'react';
import '../../styles/CartPage.css';

const CartPage = ({ cart, onRemoveItem, onSendToKitchen, onUpdateQuantity, onUpdateNote }) => {
  return (
    <div className="cart-page-container">
      <h2>Order Processing - Cart Summary</h2>
      {Object.keys(cart).length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        Object.keys(cart).map((tableId) => (
          <div key={tableId} className="table-cart">
            <h3>Table {tableId}</h3>
            {cart[tableId].map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <span>{item.name}</span>
                </div>
                <div className="quantity-control">
                    <button onClick={() => onUpdateQuantity(tableId, item.id, -1)} className="quantity-button">-</button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(tableId, item.id, 1)} className="quantity-button">+</button>
                </div>
                <div className="notes-control">
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(event) => onUpdateNote(tableId, item.id, event.target.value)}
                      placeholder="Add notes (e.g., no ice)"
                      className="notes-input"
                    />
                </div>
                <button onClick={() => onRemoveItem(tableId, item.id)} className="remove-button">
                  Remove
                </button>
              </div>
            ))}
            {/* Add "Send Order to Kitchen" button */}
            <button onClick={() => onSendToKitchen(tableId)} className="send-to-kitchen-button">
              Send Order to Kitchen
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;

