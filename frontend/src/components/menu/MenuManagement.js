import React, { useState } from 'react';
import MenuItemCard from './MenuItemCard';
import CategoryTabs from './CategoryTabs';
import AddMenuItemForm from './AddMenuItemForm';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Coke', category: 'Drinks', price: 2, description: 'Chilled beverage' },
    { id: 2, name: 'Chicken Wings', category: 'Appetizers', price: 5, description: 'Spicy and crispy wings' },
    { id: 3, name: 'Steak', category: 'Entrees', price: 15, description: 'Grilled to perfection' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddMenuItem = (newItem) => {
    setMenuItems([...menuItems, { id: Date.now(), ...newItem }]);
  };

  const handleEditMenuItem = (updatedItem) => {
    setMenuItems(menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleRemoveMenuItem = (itemId) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };

  return (
    <div className="menu-management-container">
      <h2>Menu Management</h2>
      <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
      <button onClick={() => setShowAddForm(true)} className="add-item-button">Add New Menu Item</button>
      {showAddForm && (
        <AddMenuItemForm
          onAddItem={(newItem) => {
            handleAddMenuItem(newItem);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <div className="menu-items-container">
        {menuItems
          .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
          .map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEditMenuItem}
              onRemove={handleRemoveMenuItem}
            />
          ))}
      </div>
    </div>
  );
};

export default MenuManagement;
