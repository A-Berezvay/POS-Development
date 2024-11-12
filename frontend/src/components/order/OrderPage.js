import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/OrderPage.css';

const menuItems = [

  // Starters
  { id: 1, name: 'Spelt Cavatelli, Baked Potato Skin Broth', category: 'starters', price: 7 },
  { id: 2, name: 'Potato and Tarragon Veloute, House Cured', category: 'starters', price: 6 },
  { id: 3, name: 'Hot Smoked Devonshire River Trout', category: 'starters', price: 8 },
  { id: 4, name: 'Roasted Pork Neck', category: 'starters', price: 10 },
  { id: 5, name: 'Soup of The Day', category: 'starters', price: 5 },
  { id: 6, name: 'Charred Leek, Onion Puree, Ewe\'s Curd, Walnuts', category: 'starters', price: 9 },
  
  // Mains
  { id: 7, name: 'Roast Cornish Hake', category: 'mains', price: 15 },
  { id: 8, name: 'Fish & Chips', category: 'mains', price: 15 },
  { id: 9, name: 'Baked Megrim Sole', category: 'mains', price: 15 },
  { id: 10, name: 'Chew Valley Pork', category: 'mains', price: 15 },
  { id: 11, name: 'Potato Dumplings, Squash, Vintage Rachel', category: 'mains', price: 15 },
  { id: 12, name: 'Beef Burger', category: 'mains', price: 15 },
  { id: 13, name: 'Steak Fillet', category: 'mains', price: 15 },
  { id: 14, name: 'Club Sandwich', category: 'mains', price: 15 },
  
  // Sides 
  { id: 15, name: 'Triple Cooked Schips', category: 'sides', price: 4 },
  { id: 16, name: 'Skin On Fries', category: 'sides', price: 3.5 },
  { id: 17, name: 'Charred Hispi Cabbage, Dill, Buttermilk', category: 'sides', price: 4.5 },
  
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

const OrderPage = ({ onAddToCart }) => {
  const { tableId } = useParams();
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedWineType, setSelectedWineType] = useState(null);
  const [selectedWineSize, setSelectedWineSize] = useState(null);
  const [cart, setCart] = useState([]);
  const [itemState, setItemState] = useState({});

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

  const handleAddToCart = (item) => {
    const newItem = {
      ...item,
      size: selectedWineSize || '',
      quantity: itemState[item.id]?.quantity || 1,
      note: itemState[item.id]?.note || '',
    };

    onAddToCart(tableId, newItem);

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
      <h2>Table {tableId} - Order</h2>
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
                  onClick={() => handleAddToCart({ ...item, price: item.price[selectedWineSize] })}
                  className="add-to-cart-button"
                  disabled={typeof item.price === 'object' && !selectedWineSize}
                >
                  Add to Cart
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
    </div>
  );
};

export default OrderPage;
