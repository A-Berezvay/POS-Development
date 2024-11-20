import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/SplitPaymentModal.css';

const SplitPaymentModal = ({ totalAmount, onClose, onConfirmSplitPayment, tableId }) => {
  if (!totalAmount) {
    console.error("Total amount is undefined or invalid.");
  }

  // State declarations - these are all initialized unconditionally
  const [splitAmounts, setSplitAmounts] = useState([0]);  // Amounts for each guest
  const [numberOfGuests, setNumberOfGuests] = useState(1); // Number of guests
  const [splitType, setSplitType] = useState('evenly'); // Type of split: 'evenly', 'amount', etc.

  useEffect(() => {
    // Whenever numberOfGuests or splitType changes, update the splitAmounts if needed
    if (splitType === 'evenly') {
      const evenlySplitAmount = totalAmount / numberOfGuests;
      setSplitAmounts(Array(numberOfGuests).fill(parseFloat(evenlySplitAmount.toFixed(2))));
    }
  }, [numberOfGuests, splitType, totalAmount]);

  // Handle evenly splitting the bill
  const handleSplitEvenly = () => {
    const amountPerGuest = totalAmount / numberOfGuests;
    setSplitAmounts(Array(numberOfGuests).fill(parseFloat(amountPerGuest.toFixed(2))));
    setSplitType('evenly');
  };

  // Handle amount input change for custom split
  const handleAmountChange = (index, value) => {
    const updatedAmounts = [...splitAmounts];
    updatedAmounts[index] = parseFloat(value) || 0;
    setSplitAmounts(updatedAmounts);
    setSplitType('amount');
  };

  // Add more guests for splitting the bill
  const addGuest = () => {
    setNumberOfGuests((prev) => prev + 1);
    setSplitAmounts((prev) => [...prev, 0]);
  };

  // Handle confirming the split payment
  const handleConfirmSplitPayment = () => {
    onConfirmSplitPayment(tableId);
    onClose();  // Close the modal
  };

  return (
    <div className="split-payment-modal">
      <div className="split-payment-container">
        <div className="split-payment-header">
          <h2>Split Payment</h2>
          <FontAwesomeIcon icon={faXmark} className="split-payment-close" onClick={onClose} />
        </div>
        <div className="split-payment-body">
          <p>Total Amount: £{totalAmount.toFixed(2)}</p>

          <div className="split-options">
            <button onClick={handleSplitEvenly} className="split-evenly-button">
              Split Evenly
            </button>
            <button onClick={addGuest} className="add-guest-button">
              Add Guest
            </button>
            <button onClick={() => setSplitType('amount')} className="split-by-amount-button">
              Split by Amount
            </button>
          </div>

          {splitType === 'amount' && (
            <div className="split-amounts">
              {splitAmounts.map((amount, index) => (
                <div key={index} className="split-amount-item">
                  <label>Guest {index + 1}:</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {splitType === 'evenly' && (
            <div className="split-evenly">
              <p>Each guest will pay: £{(totalAmount / numberOfGuests).toFixed(2)}</p>
            </div>
          )}

          <button 
            onClick={handleConfirmSplitPayment} 
            className="confirm-split-button"
          >
            Confirm Split Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentModal;
