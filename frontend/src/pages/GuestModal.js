import React, { useState } from 'react';
import '../styles/GuestModal.css';

const GuestModal = ({isVisible, onClose, onConfirm }) => {
    const [numberOfGuest, setNumberOfGuest] = useState(1);

   const handleNumberOfGuest = (numberOfGuest) => {
    setNumberOfGuest(numberOfGuest);
   }

    const handleIncreaseGuest = () => {
        setNumberOfGuest((prev) => prev + 1);
    };

    const handleDecreaseGuest = () => {
        setNumberOfGuest((prev) => prev - 1);
    };

    const handleConfirmGuest = () => {
        onConfirm(numberOfGuest);
        if (onClose) {
            onClose();
        }
    };

    if (!isVisible) {
        return null;
    }

    return(
        <div className="guest-modal">
            <div className="guest-modal-content">
                <h2> Number Of Guest</h2>
                <div className="guest-control">
                    <button onClick={ handleDecreaseGuest } className="guest-button"> - </button>
                    <p className="guest-number">{numberOfGuest}</p>
                    <button onClick={ handleIncreaseGuest } className="guest-button"> + </button>
                </div>
            </div>
            <button onClick={ handleConfirmGuest } className="confirm-guest-button">
                Confirm
            </button>
        </div>
    )
}; 
export default GuestModal;