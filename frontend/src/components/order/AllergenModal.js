import React from 'react';
import '../../styles/AllergenModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const AllergenModal = ({ allergens, isVisible, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="allergen-modal">
      <div className="allergen-modal-content">
        <FontAwesomeIcon icon={faXmark} className="close-button" onClick={onClose} />
        <h2>Allergen Information</h2>
        <div className="allergen-info">
          <h4>Contains:</h4>
          {allergens.contains.length > 0 ? (
            <ul>
              {allergens.contains.map((allergen, index) => (
                <li key={index}>{allergen} ✅</li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
          <h4>May Contain:</h4>
          {allergens.mayContain.length > 0 ? (
            <ul>
              {allergens.mayContain.map((allergen, index) => (
                <li key={index}>{allergen}</li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
          <h4>Removable:</h4>
          {allergens.removable.length > 0 ? (
            <ul>
              {allergens.removable.map((allergen, index) => (
                <li key={index}>{allergen}</li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllergenModal;