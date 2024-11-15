import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/SplitPaymentModal.css';

const SplitPaymentModal = ({ ordersReadyForPayment, currentTableId, onClose, onConfirmSplitPayment }) => {
  // Retrieve the orders for the specified table
  const ordersForTable = ordersReadyForPayment[currentTableId] || [];

  // Calculate the total amount for the table
  const totalAmount = ordersForTable.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
  }, 0);

  // State to track split amounts, number of guests, and split type
  const [splitAmounts, setSplitAmounts] = useState([0]);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [splitType, setSplitType] = useState('amount'); // 'amount', 'evenly', 'items'

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

  // Handle splitting by items
  const handleSplitByItems = () => {
    setSplitType('items');
  };

  // Add more guests for splitting the bill
  const addGuest = () => {
    setNumberOfGuests((prev) => prev + 1);
    setSplitAmounts((prev) => [...prev, 0]);
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
            <button onClick={handleSplitByItems} className="split-by-items-button">
              Split by Items
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
                    className="split-amount-input"
                  />
                </div>
              ))}
            </div>
          )}

          {splitType === 'items' && (
            <div className="split-items">
              {ordersForTable.map((item, index) => (
                <div key={index} className="split-item">
                  <label>{item.name}:</label>
                  <span>£{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {splitType === 'evenly' && (
            <div className="split-evenly">
              {splitAmounts.map((amount, index) => (
                <div key={index} className="split-amount-item">
                  <label>Guest {index + 1}:</label>
                  <span>£{amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="split-payment-footer">
          <button
            className="confirm-payment-button"
            onClick={() => onConfirmSplitPayment(splitAmounts)}
          >
            Confirm Split Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentModal;



