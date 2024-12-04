import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AllergenModal from './AllergenModal';
import '../../styles/OrderPage.css';
import Modifiers from './Modifiers';
import menuItems from './MenuItems';

const mainCategories = ['Food', 'Drinks'];
const foodSubCategories = ['Starters', 'Mains', 'Sides', 'Desserts'];
const drinksSubCategories = ['Wines', 'Beers', 'Spirits', 'Soft Drinks', 'Hot Drinks'];
const wineTypes = ['Red', 'White', 'Rose', 'Sparkling'];
const wineSizes = ['125ml', '175ml', '250ml', 'bottle'];

const OrderPage = ({ onAddToCart, ordersReadyForPayment }) => {
  const { tableId } = useParams();
  const location = useLocation();
  const numberOfGuests = location.state?.numberOfGuests || 1;

  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedWineType, setSelectedWineType] = useState(null);
  const [selectedWineSize, setSelectedWineSize] = useState(null);
  const [itemState, setItemState] = useState({});
  const [isAllergenModalVisible, setIsAllergenModalVisible] = useState(false);
  const [currentAllergens, setCurrentAllergens] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);

  // Fetch existing orders for the table
  const existingOrders = ordersReadyForPayment[tableId] || [];

  const handleModifierSelect = (itemId, modifierType, value) => {
    setItemState((prevState) => {
      const updatedModifier = {
        ...prevState[itemId]?.modifier,
        [modifierType]: value,
      };

      // Update note string based on selected modifiers
      let note = '';
      if (updatedModifier.cooking) note += `${updatedModifier.cooking}, `;
      if (updatedModifier.sauce) note += `${updatedModifier.sauce}, `;

      // Remove trailing comma and space
      note = note.trim().replace(/,$/, '');

      return {
        ...prevState,
        [itemId]: {
          ...prevState[itemId],
          modifier: updatedModifier,
          note: note,
        },
      };
    });
  };

  const handleAddToCart = (item) => {
    const { modifier, note } = itemState[item.id] || {};

    // Ensure that the cooking method is selected before adding to cart
    if (item.id === 13 && (!modifier || !modifier.cooking)) {
      alert("Please select a cooking method for the Steak Fillet before adding to the cart.");
      return;
    }

    let price;
    if (typeof item.price === 'object' && selectedWineSize) {
      price = parseFloat(item.price[selectedWineSize]) || 0;
    } else if (typeof item.price === 'number') {
      price = item.price;
    } else {
      price = 0;
    }

    // Create a new item object to add to the cart
    const newItem = {
      ...item,
      size: selectedWineSize || '',
      quantity: itemState[item.id]?.quantity || 1,
      note: note || '',
      modifier: modifier || {}, // Add modifier if applicable
      price: parseFloat(price).toFixed(2),
    };

    // Add the new item to the cart
    onAddToCart(tableId, newItem);

    // Reset item state
    setItemState((prevState) => ({
      ...prevState,
      [item.id]: {
        quantity: 1,
        note: '',
        modifier: {},
      },
    }));
  };

  // Other functions remain unchanged
  const handleIncreaseQuantity = (itemId) => {
    setItemState((prevState) => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        quantity: (prevState[itemId]?.quantity || 1) + 1,
      },
    }));
  };

  const handleDecreaseQuantity = (itemId) => {
    setItemState((prevState) => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        quantity: Math.max((prevState[itemId]?.quantity || 1) - 1, 1),
      },
    }));
  };

  const handleNotesChange = (itemId, event) => {
    setItemState((prevState) => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        note: event.target.value,
      },
    }));
  };

  // Show and close allergen modal
  const handleShowAllergens = (allergens, itemId) => {
    setIsAllergenModalVisible(true);
    setCurrentItemId(itemId);
  };

  const handleCloseAllergens = () => {
    setIsAllergenModalVisible(false);
    setCurrentItemId(null);
  };

  const handleConfirmAllergens = (selectedAllergens) => {
    setItemState((prevState) => {
      const currentItem = prevState[currentItemId] || {};
      const existingNote = currentItem.note || '';

      // Update note to include allergens
      let updatedNote = existingNote;
      selectedAllergens.forEach((allergen) => {
        if (!updatedNote.includes(allergen)) {
          updatedNote += `${allergen}, `;
        }
      });

      // Remove trailing comma and space
      updatedNote = updatedNote.trim().replace(/,$/, '');

      return {
        ...prevState,
        [currentItemId]: {
          ...currentItem,
          allergens: selectedAllergens,
          note: updatedNote,
        },
      };
    });
  };

  // Handle main category click
  const handleMainCategoryClick = (category) => {
    setSelectedMainCategory(category.toLowerCase());
    setSelectedSubCategory(null);
  };

  // Handle subcategory click
  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory.toLowerCase());
  };

  // Handle wine type and size click
  const handleWineTypeClick = (type) => {
    setSelectedWineType(type.toLowerCase());
  };

  const handleWineSizeClick = (size) => {
    setSelectedWineSize(size);
  };

  return (
    <div className="order-page-container">
      <div className="ordered-items-heading">
        <div>
          <h2>Table</h2>
          <span>{tableId}</span>
        </div>
        <div>
          <h2>Number of Guests</h2>
          <span>{numberOfGuests}</span>
        </div>
      </div>

      {/* Display existing orders */}
      {existingOrders.map((orderItem, index) => (
        <div key={`${orderItem.id}-${index}-${orderItem.note}-${JSON.stringify(orderItem.modifier)}`} className="existing-order-item">
          <div className="order-items">
            <span>{orderItem.quantity}x</span>
            <span>{orderItem.name}</span>
            <span>£{orderItem.price}</span>
          </div>
          <div className="item-note">
            {orderItem.note && <span>Note: {orderItem.note}</span>}
          </div>
        </div>
      ))}



      {/* Main Category Buttons */}
      <div className="category-buttons-container">
        {mainCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleMainCategoryClick(category)}
            className={`category-button ${selectedMainCategory === category.toLowerCase() ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food Subcategory Buttons */}
      {selectedMainCategory === 'food' && (
        <div className="sub-category-buttons-container">
          {foodSubCategories.map((subCategory) => (
            <button
              key={subCategory}
              onClick={() => handleSubCategoryClick(subCategory)}
              className={`sub-category-button ${selectedSubCategory === subCategory.toLowerCase() ? 'active' : ''}`}
            >
              {subCategory}
            </button>
          ))}
        </div>
      )}

      {/* Drinks Subcategory Buttons */}
      {selectedMainCategory === 'drinks' && (
        <div className="sub-category-buttons-container">
          {drinksSubCategories.map((subCategory) => (
            <button
              key={subCategory}
              onClick={() => handleSubCategoryClick(subCategory)}
              className={`sub-category-button ${selectedSubCategory === subCategory.toLowerCase() ? 'active' : ''}`}
            >
              {subCategory}
            </button>
          ))}
        </div>
      )}

      {/* Wine Type Buttons */}
      {selectedSubCategory === 'wines' && (
        <div className="wine-type-buttons-container">
          {wineTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleWineTypeClick(type)}
              className={`wine-type-button ${selectedWineType === type.toLowerCase() ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Wine Size Buttons */}
      {selectedWineType && ['red', 'white', 'rose'].includes(selectedWineType) && (
        <div className="wine-size-buttons-container">
          {wineSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleWineSizeClick(size)}
              className={`wine-size-button ${selectedWineSize === size ? 'active' : ''}`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items */}
      {(selectedMainCategory && (selectedSubCategory || selectedWineType)) && (
        <div className="menu-items-container">
          <h3>
            {selectedSubCategory
              ? selectedSubCategory.charAt(0).toUpperCase() + selectedSubCategory.slice(1)
              : selectedWineType
              ? selectedWineType.charAt(0).toUpperCase() + selectedWineType.slice(1)
              : 'Items'}
          </h3>
          {menuItems
            .filter((item) => {
              if (selectedSubCategory && selectedMainCategory === 'food') {
                return item.category === selectedSubCategory.toLowerCase();
              } else if (selectedWineType && selectedMainCategory === 'drinks') {
                return item.category === selectedWineType.toLowerCase();
              } else if (selectedSubCategory && selectedMainCategory === 'drinks') {
                return item.category === selectedSubCategory.toLowerCase();
              }
              return false;
            })
            .map((item) => (
              <div key={item.id} className="menu-item-card">
                <h4>{item.name}</h4>
                <p>
                  Price: £
                  {typeof item.price === 'object'
                    ? selectedWineSize
                      ? item.price[selectedWineSize]
                      : 'Select a size'
                    : item.price}
                </p>
                {/* Steak Fillet Modifier Options */}
                {item.id === 13 && (
                  <>
                    <div className="modifier-section">
                      <h5>Cooking Method</h5>
                      <div className="modifier-buttons">
                        {Modifiers.cookingMethods.map((method) => (
                          <button
                            key={method}
                            onClick={() => handleModifierSelect(item.id, 'cooking', method)}
                            className={`modifier-button ${
                              itemState[item.id]?.modifier?.cooking === method ? 'selected' : ''
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="modifier-section">
                      <h5>Sauce</h5>
                      <div className="modifier-buttons">
                        {Modifiers.sauces.map((sauce) => (
                          <button
                            key={sauce}
                            onClick={() => handleModifierSelect(item.id, 'sauce', sauce)}
                            className={`modifier-button ${
                              itemState[item.id]?.modifier?.sauce === sauce ? 'selected' : ''
                            }`}
                          >
                            {sauce}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="quantity-control">
                  <button onClick={() => handleDecreaseQuantity(item.id)} className="quantity-button">
                    -
                  </button>
                  <span className="quantity-display">{itemState[item.id]?.quantity || 1}</span>
                  <button onClick={() => handleIncreaseQuantity(item.id)} className="quantity-button">
                    +
                  </button>
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
                <button onClick={() => handleShowAllergens(item.allergens)} className="allergen-button">
                  View Allergens
                </button>
              </div>
            ))}
        </div>
      )}

      {isAllergenModalVisible && (
        <AllergenModal
          allergens={currentAllergens}
          isVisible={isAllergenModalVisible}
          onClose={handleCloseAllergens}
          onConfirmAllergens={handleConfirmAllergens}
          selectedAllergens={itemState[currentItemId]?.allergens || []}
        />
      )}
    </div>
  );
};

export default OrderPage;

