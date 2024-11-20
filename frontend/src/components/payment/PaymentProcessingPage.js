import React, { useState } from 'react';
import '../../styles/PaymentProcessingPage.css';
import SplitPaymentModal from './SplitPaymentModal'; // Import the new split payment modal component

const PaymentProcessingPage = ({ ordersReadyForPayment, onPayment }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(false);

  // This function handles the calculation of total amount for a given table
  const getTotalAmount = (tableId) => {
    const ordersForTable = ordersReadyForPayment[tableId] || [];
    return ordersForTable.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // Function to open the Split Payment modal and pass totalAmount
  const handleSplitBill = (tableId) => {
    const totalAmount = getTotalAmount(tableId);  // Get total amount for this table
    if (totalAmount > 0) {
      setShowSplitModal(true);
    } else {
      console.error("Total amount is zero or invalid.");
    }
  };

  // Close the Split Payment modal
  const closeSplitModal = () => {
    setShowSplitModal(false);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmSplitPayment = (splitAmounts) => {
    console.log("Split amounts confirmed:", splitAmounts)
  };

  return (
    <div className="payment-processing-container">
      <h2>Payment Processing</h2>
      {Object.keys(ordersReadyForPayment).length === 0 ? (
        <p>No tables are ready for payment.</p>
      ) : (
        Object.keys(ordersReadyForPayment).map((tableId) => {
          // Calculate total amount for the table
          const totalAmount = getTotalAmount(tableId);
          return (
            <div key={tableId} className="payment-table">
              <h3>Table {tableId}</h3>
              <div className="payment-header">
                <span>Qty</span>
                <span>Name</span>
                <span>Item Price</span>
                <span>Total</span>
              </div>
              {ordersReadyForPayment[tableId].map((item) => {
                const itemPrice = parseFloat(item.price);
                return (
                  <div key={item.id} className="payment-item">
                    <span>{item.quantity}x</span>
                    <span>{item.name}</span>
                    <span>£{itemPrice.toFixed(2)}</span>
                    <span>£{(itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <h4>Total Amount: £{totalAmount.toFixed(2)}</h4>

              <div className="payment-method-section">
                <h5>Select Payment Method:</h5>
                <button onClick={() => handlePaymentMethodSelect('card')}>Card</button>
                <button onClick={() => handlePaymentMethodSelect('contactless')}>Contactless</button>
                <button onClick={() => handlePaymentMethodSelect('mobile_wallet')}>Mobile Wallet</button>
              </div>

              {selectedPaymentMethod && (
                <button
                  onClick={() => onPayment(tableId)}
                  className="make-payment-button"
                >
                  Pay with {selectedPaymentMethod.replace('_', ' ')}
                </button>
              )}

              {/* Button to trigger the Split Bill modal */}
              <button onClick={() => handleSplitBill(tableId)} className="split-bill-button">
                Split Bill
              </button>
            </div>
          );
        })
      )}

      {/* Conditionally render the SplitPaymentModal and pass totalAmount */}
      {showSplitModal && (
        <SplitPaymentModal
          totalAmount={getTotalAmount(Object.keys(ordersReadyForPayment)[0])} // Pass totalAmount to the modal
          onClose={closeSplitModal}
          onPayment={onPayment}
          onConfirmSplitPayment={handleConfirmSplitPayment}
        />
      )}
    </div>
  );
};

export default PaymentProcessingPage;
