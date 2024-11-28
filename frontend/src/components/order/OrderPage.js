import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AllergenModal from './AllergenModal';
import '../../styles/OrderPage.css';

const menuItems = [

  // Starters
  { id: 1, name: 'Spelt Cavatelli', category: 'starters', price: 7, allergens: { contains: ['Gluten'], mayContain: ['Nuts'], removable: ['Cheese']}},
  { id: 2, name: 'Potato and Tarragon Veloute', category: 'starters', price: 6 },
  { id: 3, name: 'Smoked River Trout', category: 'starters', price: 8 },
  { id: 4, name: 'Roasted Pork Neck', category: 'starters', price: 10 },
  { id: 5, name: 'Soup of The Day', category: 'starters', price: 5 },
  { id: 6, name: 'Charred Leek, Onion Puree', category: 'starters', price: 9 },
  
  // Mains
  { id: 7, name: 'Roast Cornish Hake', category: 'mains', price: 15 },
  { id: 8, name: 'Fish & Chips', category: 'mains', price: 15 },
  { id: 9, name: 'Baked Megrim Sole', category: 'mains', price: 15 },
  { id: 10, name: 'Chew Valley Pork', category: 'mains', price: 15 },
  { id: 11, name: 'Potato Dumplings', category: 'mains', price: 15 },
  { id: 12, name: 'Beef Burger', category: 'mains', price: 15 },
  { id: 13, name: 'Steak Fillet', category: 'mains', price: 15 },
  { id: 14, name: 'Club Sandwich', category: 'mains', price: 15 },
  
  // Sides 
  { id: 15, name: 'Triple Cooked Schips', category: 'sides', price: 4 },
  { id: 16, name: 'Skin On Fries', category: 'sides', price: 3.5 },
  { id: 17, name: 'Charred Hispi Cabbage', category: 'sides', price: 4.5 },
  
  // Desserts
  { id: 18, name: 'Sticky Toffee Pudding', category: 'desserts', price: 6.5 },
  { id: 19, name: 'Brown Butter Fraingipane', category: 'desserts', price: 7.5 },
  { id: 20, name: 'Dark Chocolate Mousse', category: 'desserts', price: 8 },
  { id: 21, name: 'Artisan Cheeses', category: 'desserts', price: 9.5 },
  { id: 22, name: 'Vanilla Ice Cream', category: 'desserts', price: 6 },

  //Wines: Red, White, Rose
  { id: 23, name: 'Sancerre Sauvignon Blanc', category: 'white', price: { '125ml': 6, '175ml': 8, '250ml': 10, 'bottle': 35 } },
  { id: 24, name: 'Catena Malbec', category: 'red', price: { '125ml': 7, '175ml': 9, '250ml': 12, 'bottle': 40 } },
  { id: 25, name: 'Whispering Angel', category: 'rose', price: { '125ml': 8, '175ml': 10, '250ml': 13, 'bottle': 45 } },
];

const mainCategories = ['Food', 'Drinks'];
const foodSubCategories = ['Starters', 'Mains', 'Sides', 'Desserts'];
const drinksSubCategories = ['Wines', 'Beers', 'Spirits', 'Soft Drinks', 'Hot Drinks'];
const wineTypes = ['Red', 'White', 'Rose', 'Sparkling'];
const wineSizes = ['125ml', '175ml', '250ml', 'bottle'];

const OrderPage = ({ onAddToCart, ordersReadyForPayment }) => {
  const { tableId } = useParams();
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedWineType, setSelectedWineType] = useState(null);
  const [selectedWineSize, setSelectedWineSize] = useState(null);
  const [cart] = useState([]);
  const [itemState, setItemState] = useState({});
  const [isAllergenModalVisible, setIsAllergenModalVisible] = useState(false);
  const [currentAllergens, setCurrentAllergens] = useState([]);

  //Fetch existing orders for the table
  const existingOrders = ordersReadyForPayment[tableId] || [];

  //Calculate the total amount for the table
  const getTotalAmount = (tableId) => {
    const ordersForTable = ordersReadyForPayment[tableId] || [];
    return ordersForTable.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const handleMainCategoryClick = (category) => {
    setSelectedMainCategory(category.toLowerCase());
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory.toLowerCase());
  };

  const handleWineTypeClick = (type) => {
    setSelectedWineType (type.toLowerCase());
  };

  const handleWineSizeClick = (size) => {
    setSelectedWineSize (size);
  };  

  const handleShowAllergens = (allergens) => {
    setCurrentAllergens(allergens);
    setIsAllergenModalVisible(true);
  };

  const handleCloseAllergens = () => {
    setIsAllergenModalVisible(false);
    setCurrentAllergens([]);
  };

  const handleAddToCart = (item) => {
    let price;
  
    // Determine the correct price if it's a wine with different sizes
    if (typeof item.price === 'object' && selectedWineSize) {
      price = parseFloat(item.price[selectedWineSize]) || 0; // Parse wine price based on selected size
    } 
    // Handle food items with fixed price
    else if (typeof item.price === 'number') {
      price = item.price; // Use the item's numeric price directly
    } else {
      price = 0; // Fallback (should rarely be hit)
    }
  
    // Create a new item object to add to the cart
    const newItem = {
      ...item,
      size: selectedWineSize || '', // Add size if applicable
      quantity: itemState[item.id]?.quantity || 1, // Set quantity
      note: itemState[item.id]?.note || '', // Add note if applicable
      price: parseFloat(price).toFixed(2), // Set price explicitly as a number
    };
  
    // Add the new item to the cart
    onAddToCart(tableId, newItem);
  
    // Reset item state
    setItemState((prevState) => ({
      ...prevState,
      [item.id]: {
        quantity: 1,
        note: '',
      },
    }));
  };
  
  

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

  return (
    <div className="order-page-container">
      <div className="ordered-items-heading">
        <div>
          <h2>Table</h2>
          <span>{tableId}</span>
        </div>
        <div>
          <h2>Number of Guests</h2>
          <span>N/A</span>
        </div>
      </div>


      {/* Display existing orders at the Top */}
      {existingOrders.length > 0 && (
        <div className="existing-orders-section">
          <h3>Existing Orders</h3>
          <div className="existing-orders-list">
            {existingOrders.map((orderItem) => (
              <div key={orderItem.id} className="existing-order-item">
                <span>{orderItem.quantity}x</span>
                <span>{orderItem.name}</span>
                <span>£{orderItem.price}</span>
                {orderItem.note && <span>Note: {orderItem.note}</span>}
              </div>
            ))}
            <span className="total-amount">£{getTotalAmount(tableId).toFixed(2)}</span>
          </div>
        </div>
      )}
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

      {selectedWineType && (selectedWineType === 'red' || selectedWineType === 'white' || selectedWineType === 'rose') && (
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

      {(selectedMainCategory && (selectedSubCategory || selectedWineType)) && (
        <div className="menu-items-container">
          <h3>
            {selectedSubCategory
              ? selectedSubCategory.charAt(0).toUpperCase() + selectedSubCategory.slice(1)
              : selectedWineType ? selectedWineType.charAt(0).toUpperCase() + selectedWineType.slice(1)
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
                  Price: £{typeof item.price === 'object'
                    ? selectedWineSize
                      ? item.price[selectedWineSize]
                      : 'Select a size'
                    : item.price}
                </p>
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
                <button
                  onClick={() => handleAddToCart(item)}
                  className="add-to-cart-button"
                >
                  Add to Cart
                </button>
                
                <button
                  onClick={() => handleShowAllergens(item.allergens)}
                  className="allergen-button"
                >
                  View Allergens
                </button>

              </div>
            ))}

        </div>
      )}

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
      <AllergenModal
        allergens={currentAllergens}
        isVisible={isAllergenModalVisible}
        onClose={handleCloseAllergens}
      />
    </div>
  );
};

export default OrderPage;
