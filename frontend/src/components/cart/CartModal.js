import React, { useState } from 'react';
import AllergenModal from '../order/AllergenModal';
import '../../styles/CartModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CartModal = ({ isVisible, cart, onClose, onRemoveItem, onUpdateQuantity, onSendToKitchen }) => {
  const [isAllergenModalVisible, setIsAllergenModalVisible] = useState(false);
  const [currentAllergens, setCurrentAllergens] = useState([]);

  const handleShowAllergens = (allergens) => {
    setCurrentAllergens(allergens);
    setIsAllergenModalVisible(true);
  };

  const handleCloseAllergens = () => {
    setIsAllergenModalVisible(false);
    setCurrentAllergens([]);
  };

  if (!isVisible) {
    return null; // Don't render anything if the modal is not visible
  }

  return (
    <div className="cart-modal">
      <div className="cart-modal-content">
      <FontAwesomeIcon icon={faXmark} className='close-button' />
        <h2>Cart Summary</h2>
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
                    <button
                      onClick={() => handleShowAllergens(item.allergens)}
                      className="allergen-button"
                    >
                      View Allergens
                    </button>
                    {item.note && <div className="item-note"><strong>Note:</strong> {item.note}</div>}
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => onUpdateQuantity(tableId, item.id, -1)} className="quantity-button">-</button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(tableId, item.id, 1)} className="quantity-button">+</button>
                  </div>
                  <button onClick={() => onRemoveItem(tableId, item.id)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={() => onSendToKitchen(tableId)} className="send-to-kitchen-button">
                Send Order to Kitchen
              </button>
            </div>
          ))
        )}
      </div>
      {isAllergenModalVisible && (
        <AllergenModal
          allergens={currentAllergens}
          isVisible={isAllergenModalVisible}
          onClose={handleCloseAllergens}
        />
      )}

    </div>
  );
};

export default CartModal;
