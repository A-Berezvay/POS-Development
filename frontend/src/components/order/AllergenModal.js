import React, { useState } from 'react';
import '../../styles/AllergenModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const allergensList = [
  'Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts', 'Soybeans',
  'Milk', 'Nuts', 'Celery', 'Mustard', 'Sesame seeds', 'Sulphur dioxide',
  'Lupin', 'Molluscs'
];

const AllergenModal = ({ isVisible, onClose, onConfirmAllergens, selectedAllergens }) => {
  const [selected, setSelected] = useState(selectedAllergens || []);

  if (!isVisible) {
    return null;
  }

  const handleAllergenClick = (allergen) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(allergen)) {
        return prevSelected.filter((item) => item !== allergen);
      } else {
        return [...prevSelected, allergen];
      }
    });
  };

  const handleConfirmClick = () => {
    onConfirmAllergens(selected);
  };

  return (
    <div className="allergen-modal">
      <div className="allergen-modal-content">
        <FontAwesomeIcon icon={faXmark} className="close-button" onClick={onClose} />
        <h2>Allergen Information</h2>
        <div className="allergen-buttons-container">
          {allergensList.map((allergen) => (
            <button
              key={allergen}
              onClick={() => handleAllergenClick(allergen)}
              className={`allergen-button ${selected.includes(allergen) ? 'selected' : ''}`}
            >
              {allergen}
            </button>
          ))}
        </div>
        <div className="modal-buttons-container">
          <button className="confirm-button" onClick={handleConfirmClick}>Confirm</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AllergenModal;
