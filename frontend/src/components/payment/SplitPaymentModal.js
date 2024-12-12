import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../styles/SplitPaymentModal.css";

const SplitPaymentModal = ({ totalAmount, onClose, onConfirmSplitPayment, tableId, updateRemainingTotal }) => {
  const [numberOfGuests, setNumberOfGuests] = useState(2); // Default to splitting between 2
  const [splitAmounts, setSplitAmounts] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(totalAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [customGuests, setCustomGuests] = useState("");
  const [showNumberPad, setShowNumberPad] = useState(false);
  const [showAmountPad, setShowAmountPad] = useState(false);

  // Calculate equal splits whenever the number of guests changes
  useEffect(() => {
    const split = remainingAmount / numberOfGuests;
    setSplitAmounts(Array(numberOfGuests).fill(parseFloat(split.toFixed(2))));
  }, [numberOfGuests, remainingAmount]);

  const handleCustomAmountPay = (amount) => {
    const deductedAmount = parseFloat(amount);
    if (deductedAmount > 0 && deductedAmount <= remainingAmount) {
      setRemainingAmount((prev) => prev - deductedAmount);
      updateRemainingTotal(deductedAmount); // Deduct from parent total
      setCustomAmount(""); // Reset custom amount
    } else {
      alert("Invalid amount.");
    }
  };

  const handleEqualPay = (index) => {
    const payAmount = splitAmounts[index];
    if (payAmount > 0 && payAmount <= remainingAmount) {
      setSplitAmounts((prev) =>
        prev.map((amount, i) => (i === index ? 0 : amount))
      ); // Set this guest's share to 0
      setRemainingAmount((prev) => prev - payAmount);
      updateRemainingTotal(payAmount); // Deduct from parent total
    } else {
      alert("Invalid payment.");
    }
  };

  useEffect(() => {
    // Automatically settle the check and close when remainingAmount reaches 0
    if (remainingAmount === 0) {
      onConfirmSplitPayment(tableId, []);
      onClose();
    }
  }, [remainingAmount, onClose, onConfirmSplitPayment, tableId]);

  return (
    <div className="split-payment-modal">
      <div className="split-payment-container">
        <div className="split-payment-header">
          <h2>Split Payment</h2>
          <FontAwesomeIcon icon={faXmark} className="split-payment-close" onClick={onClose} />
        </div>
        <div className="split-payment-body">
          <p className="split-total-amount">Remaining Amount: £{remainingAmount.toFixed(2)}</p>

          {/* Equal Split Section */}
          <div className="equal-split-section">
            <h3>Equal Split</h3>
            {splitAmounts.map((amount, index) => (
              <div key={index} className="split-item">
                <span>Guest {index + 1}: £{amount.toFixed(2)}</span>
                <button
                  onClick={() => handleEqualPay(index)}
                  className="pay-button"
                  disabled={amount === 0}
                >
                  Pay
                </button>
              </div>
            ))}
          </div>

          {/* Custom Amount Section */}
          <div className="custom-split-section">
            <h3>Custom Amount</h3>
            <div className="amount-entry">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <button onClick={() => handleCustomAmountPay(customAmount)}>
                Pay
              </button>
            </div>
          </div>

          <button onClick={onClose} className="close-split-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentModal;
