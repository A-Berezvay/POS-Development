import React, { useState } from 'react';
import '../styles/GuestModal.css';

const GuestModal = ({isVisible, onClose, onConfirm }) => {
    const [numberOfGuest, setNumberOfGuest] = useState(null);

   const handleNumberOfGuest = (numberOfGuest) => {
    setNumberOfGuest(numberOfGuest);
   }

    const handleIncreaseGuest = () => {
        numberOfGuest((prev) => prev + 1);
    };

    const handleDecreaseGuest = () => {
        numberOfGuest((prev) => prev - 1);
    };

    const handleConfirmGuest = () => {
        onConfirm(numberOfGuest);
        onClose();
    };

    if (!isVisible) {
        return null;
    }

    return(
        <div>
            <div>
                <h2> Number Of Guest</h2>
                <button
                onClick={ handleIncreaseGuest }
                >
                    +
                </button>
                <p>{numberOfGuest}</p>
                <button
                onClick={ handleDecreaseGuest }
                >
                    -
                </button>

            </div>

                <button
                onClick={ handleConfirmGuest }
                >
                    Confirm
                </button>
        </div>
    )
}; 
export default GuestModal;