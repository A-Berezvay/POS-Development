import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../styles/SplitPaymentModal.css";

const SplitPaymentModal = ({ totalAmount, onClose, onConfirmSplitPayment, tableId }) => {
  const [numberOfGuests, setNumberOfGuests] = useState(2); // Default to splitting between 2
  const [splitAmounts, setSplitAmounts] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(totalAmount); // Remaining balance
  const [customAmount, setCustomAmount] = useState(""); // Input for custom amounts
  const [customGuests, setCustomGuests] = useState(""); // Input for custom guests
  const [showNumberPad, setShowNumberPad] = useState(false); // Number pad modal visibility
  const [showSplitBy, setShowSplitBy] = useState(false); // Display equal split amounts
  const [paidAmounts, setPaidAmounts] = useState([]); // Track paid amounts

  // Calculate equal splits whenever the number of guests changes
  useEffect(() => {
    if (numberOfGuests > 0) {
      const split = remainingAmount / numberOfGuests;
      setSplitAmounts(Array(numberOfGuests).fill(parseFloat(split.toFixed(2))));
    }
  }, [numberOfGuests, remainingAmount]);

  // Handle number pad input for guests
  const handleNumberPadInput = (value) => {
    if (value === "OK") {
      const guests = parseInt(customGuests, 10);
      if (guests > 0) {
        setNumberOfGuests(guests);
        setShowNumberPad(false);
        setShowSplitBy(true);
        setCustomGuests("");
      } else {
        alert("Please enter a valid number of guests.");
      }
    } else if (value === "DEL") {
      setCustomGuests((prev) => prev.slice(0, -1));
    } else {
      setCustomGuests((prev) => (prev + value).replace(/^0+/, ""));
    }
  };

  // Handle custom amount input
  const handleAmountPadInput = (value) => {
    if (value === "OK") {
      const amount = parseFloat(customAmount);
      if (amount > 0 && amount <= remainingAmount) {
        setRemainingAmount((prev) => parseFloat((prev - amount).toFixed(2)));
        setPaidAmounts((prev) => [...prev, amount]);
        setCustomAmount("");

        if (parseFloat((remainingAmount - amount).toFixed(2)) === 0) {
          onConfirmSplitPayment(tableId); // Reset table and free it
          onClose(); // Close modal
        }
      } else {
        alert("Invalid amount. Ensure it's positive and less than or equal to the remaining amount.");
      }
    } else if (value === "DEL") {
      setCustomAmount((prev) => prev.slice(0, -1));
    } else {
      setCustomAmount((prev) => (prev + value).replace(/^0+/, ""));
    }
  };

  return (
    <div className="split-payment-modal">
      <div className="split-payment-container">
        <div className="split-payment-header">
          <h2>Split Payment</h2>
          <FontAwesomeIcon icon={faXmark} className="split-payment-close" onClick={onClose} />
        </div>
        <div className="split-payment-body">
          <p className="split-total-amount">Total Amount £<b>{remainingAmount.toFixed(2)}</b></p>

          {/* Buttons for predefined splits */}
          <div className="split-buttons">
            <p>Split between</p>
            <div>
              {[2, 3, 4].map((num) => (
                <button key={num} onClick={() => {
                  setNumberOfGuests(num);
                  setShowSplitBy(true);
                }}>
                  {num}
                </button>
              ))}
              <button onClick={() => setShowNumberPad(true)}>Other</button>
            </div>
          </div>

          {/* Number Pad for Custom Guests */}
          {showNumberPad && (
            <div className="number-pad-modal">
              <div className="split-number-pad">
                <h3>Enter Number of Guests</h3>
                <p className="number-display">{customGuests || "0"}</p>
                <div className="number-buttons">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "DEL", "0", "OK"].map((num) => (
                    <button key={num} onClick={() => handleNumberPadInput(num)}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Display equal split summary */}
          {showSplitBy && numberOfGuests > 0 && (
            <div className="split-summary">
              <h3>Split Equally</h3>
              <p>£{(remainingAmount / numberOfGuests).toFixed(2)} each</p>
            </div>
          )}

          {/* Paid Amounts Section */}
          {paidAmounts.length > 0 && (
            <div className="paid-amounts">
              <h3>Paid Amounts</h3>
              <ul>
                {paidAmounts.map((amount, index) => (
                  <li key={index}>£{amount.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Custom Amount Input */}
          <div className="amount-pad-modal">
            <h3>Enter Amount</h3>
            <p className="amount-display">£{customAmount || "0"}</p>
            <div className="amount-buttons">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "DEL", "OK"].map((key) => (
                <button key={key} onClick={() => handleAmountPadInput(key)}>
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentModal;

