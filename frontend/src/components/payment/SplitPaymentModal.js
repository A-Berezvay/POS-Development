import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../styles/SplitPaymentModal.css";

const SplitPaymentModal = ({ totalAmount, onClose, onConfirmSplitPayment, tableId }) => {
  const [numberOfGuests, setNumberOfGuests] = useState(2); // Default to splitting between 2
  const [splitAmounts, setSplitAmounts] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(totalAmount); // Remaining balance
  const [showNumberPad, setShowNumberPad] = useState(false); // To show custom number pad modal
  const [showAmountPad, setShowAmountPad] = useState(false); // To show custom amount pad modal
  const [showSplitBy, setShowSplitBy] = useState(false);
  const [customAmount, setCustomAmount] = useState(""); // Input for custom amounts
  const [customGuests, setCustomGuests] = useState("");

  // Calculate equal splits whenever the number of guests changes
  useEffect(() => {
    const split = remainingAmount / numberOfGuests;
    setSplitAmounts(Array(numberOfGuests).fill(parseFloat(split.toFixed(2))));
  }, [numberOfGuests, remainingAmount]);

const handleNumberPadInput = (value) => {
  if (value === "OK") {
    const amount = parseInt(customGuests);
    if (customGuests > 0) {
      setNumberOfGuests(customGuests);
      setRemainingAmount(totalAmount); // Reset remaining amount after division
      setSplitAmounts(Array(customGuests).fill(parseFloat((totalAmount / customGuests).toFixed(2)))); // Divide totalAmount by number of guests
      setCustomGuests("");
      setShowNumberPad(false);
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
        setSplitAmounts((prev) => [...prev, amount]); // Add the custom split amount
        setRemainingAmount((prev) => parseFloat((prev - amount).toFixed(2))); // Deduct amount
        setCustomAmount(""); // Clear the input field
        setShowAmountPad(false); // Close the keypad
      } else {
        alert("Invalid amount. Ensure it's positive and less than or equal to the remaining amount.");
      }
    } else if (value === "DEL") {
      setCustomAmount((prev) => prev.slice(0, -1)); // Remove the last digit
    } else {
      setCustomAmount((prev) => (prev + value).replace(/^0+/, "")); // Add new input digit
    }
  };

  // Confirm payment and close modal
  const handleConfirm = () => {
    console.log("Splits confirmed:", splitAmounts); // Debugging/logging purposes
    onConfirmSplitPayment(tableId, splitAmounts);
    onClose();
  };

  return (
    <div className="split-payment-modal">
      <div className="split-payment-container">
        <div className="split-payment-header">
          <h2>Split Payment</h2>
          <FontAwesomeIcon icon={faXmark} className="split-payment-close" onClick={onClose} />
        </div>
        <div className="split-payment-body">
          <p className="split-total-amount">Total Amount: £{remainingAmount.toFixed(2)}</p>

          {/* Buttons for predefined splits */}
          <div className="split-buttons">
            {[2, 3, 4].map((num) => (
              <button onClick={() => { 
                setNumberOfGuests(num);
                setShowSplitBy(true);
              }}
              >
                {num}
              </button>
            ))}
            <button onClick={() => {
              setShowNumberPad(true);
              setShowSplitBy(true);
            }}
            >
              Other
            </button>
          </div>

          {/* Split by Amount button */}
          <div className="split-by-amount-section">
            <button onClick={() => setShowAmountPad(true)} className="split-by-amount-button">
              Enter Amount
            </button>
          </div>

          {/* Display split results conditionally */}
          {showSplitBy && (
            <div className="split-summary">
              <p>Split by: {numberOfGuests}</p>
              <p>£{(remainingAmount / numberOfGuests).toFixed(2)}</p>
              <p> per person</p>
            </div>
          )}
          <button onClick={handleConfirm} className="confirm-split-button">
            Confirm Split Payment
          </button>
        </div>
        {/* Number pad modal for custom splits */}
        {showNumberPad && (
          <div className="number-pad-modal">
            <div className="split-number-pad">
              <div>
              <h3>Split by</h3> <p className="number-display">{customGuests || "0"}</p>
              </div>
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
        {/* Amount pad modal for custom amounts */}
        {showAmountPad && (
          <div className="amount-pad-modal">
            <div className="amount-pad">
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
        )}
      </div>
    </div>
  );
};

export default SplitPaymentModal;