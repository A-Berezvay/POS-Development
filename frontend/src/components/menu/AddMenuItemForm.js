import React, { useState } from 'react';


const AddMenuItemForm = ({ onAddItem, onCancel }) => {
  const [newItem, setNewItem] = useState({ name: '', category: 'Drinks', price: 0, description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem(newItem);
  };

  return (
    <form onSubmit={handleSubmit} className="add-menu-item-form">
      <input
        type="text"
        placeholder="Item Name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <select
        value={newItem.category}
        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
      >
        <option value="Drinks">Drinks</option>
        <option value="Appetizers">Appetizers</option>
        <option value="Entrees">Entrees</option>
      </select>
      <input
        type="number"
        placeholder="Price"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={newItem.description}
        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
      />
      <button type="submit">Add Item</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddMenuItemForm;
