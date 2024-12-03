import React, { useState } from 'react';
import AllergenModal from '../order/AllergenModal';
import Modifiers from '../order/Modifiers';
import '../../styles/CartModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CartModal = ({ isVisible, cart, onClose, onRemoveItem, onUpdateQuantity, onSendToKitchen }) => {
  const [isAllergenModalVisible, setIsAllergenModalVisible] = useState(false);
  const [currentAllergens, setCurrentAllergens] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleShowAllergens = (allergens) => {
    setCurrentAllergens(allergens);
    setIsAllergenModalVisible(true);
  };

  const handleCloseAllergens = () => {
    setIsAllergenModalVisible(false);
    setCurrentAllergens([]);
  };

  const handleOptionChange = (itemId, optionType, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [itemId]: {
        ...prevOptions[itemId],
        [optionType]: value,
      },
    }));
  };

  const handleSendToKitchen = (tableId) => {
    const updatedCart = {...cart };

    updatedCart[tableId] = updatedCart[tableId].map((item) => {
      if (selectedOptions[item.id]) {
        return {
          ...item,
          modifiers: selectedOptions[item.id],
        };
      }
      return item;
    });

    onSendToKitchen(tableId, updatedCart[tableId]); 
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

                    {/* Display cooking method and sauce options for "Steak Fillet" (id 13) */}
                    {item.id === 13 && (
                      <>
                        <div className="option-group">
                          <strong>Cooking Method:</strong>
                          <div className="option-buttons">
                            {Modifiers.cookingMethods.map((method) => (
                              <button
                                key={method}
                                className={`option-button ${
                                  selectedOptions[item.id]?.cooking === method ? 'selected' : ''
                                }`}
                                onClick={() => handleOptionChange(item.id, 'cooking', method)}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="option-group">
                          <strong>Sauce:</strong>
                          <div className="option-buttons">
                            {Modifiers.sauces.map((sauce) => (
                              <button
                                key={sauce}
                                className={`option-button ${
                                  selectedOptions[item.id]?.sauce === sauce ? 'selected' : ''
                                }`}
                                onClick={() => handleOptionChange(item.id, 'sauce', sauce)}
                              >
                                {sauce}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      onClick={() => handleShowAllergens(item.allergens)}
                      className="allergen-button"
                    >
                      View Allergens
                    </button>
                    {item.note && <div className="item-note"><strong>Note:</strong> {item.note}</div>}

                    {/* Display selected cooking method and sauce under the item */}
                    {selectedOptions[item.id]?.cooking && (
                      <div className="item-note">
                        <strong>Cooking Method:</strong> {selectedOptions[item.id].cooking}
                      </div>
                    )}
                    {selectedOptions[item.id]?.sauce && (
                      <div className="item-note">
                        <strong>Sauce:</strong> {selectedOptions[item.id].sauce}
                      </div>
                    )}
                
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
