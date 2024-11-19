import React, { useState } from 'react';


const MenuItemCard = ({ item, onEdit, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleSave = () => {
    onEdit(editedItem);
    setIsEditing(false);
  };

  return (
    <div className="menu-item-card">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
          />
          <input
            type="number"
            value={editedItem.price}
            onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
          />
          <textarea
            value={editedItem.description}
            onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{item.name}</h3>
          <p>Price: £{item.price}</p>
          <p>{item.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;