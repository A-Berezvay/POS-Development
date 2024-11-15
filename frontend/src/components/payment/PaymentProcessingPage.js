import React, { useState } from 'react';
import '../../styles/PaymentProcessingPage.css';
import SplitPaymentModal from './SplitPaymentModal'; // Import the new split payment modal component

const PaymentProcessingPage = ({ ordersReadyForPayment, onPayment }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleSplitBill = () => {
    setShowSplitModal(true);
  };

  const closeSplitModal = () => {
    setShowSplitModal(false);
  };

  return (
    <div className="payment-processing-container">
      <h2>Payment Processing</h2>
      {Object.keys(ordersReadyForPayment).length === 0 ? (
        <p>No tables are ready for payment.</p>
      ) : (
        Object.keys(ordersReadyForPayment).map((tableId) => {
          // Calculate total amount for the table
          const totalAmount = ordersReadyForPayment[tableId].reduce((total, item) => {
            const itemPrice = parseFloat(item.price); 
            const itemQuantity = item.quantity || 1;

            return total + (itemPrice * itemQuantity);
          }, 0);

          return (
            <div key={tableId} className="payment-table">
              <h3>Table {tableId}</h3>
              {ordersReadyForPayment[tableId].map((item) => {
                const itemPrice = parseFloat(item.price);
                return (
                  <div key={item.id} className="payment-item">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>£{itemPrice.toFixed(2)} each</span>
                    <span>Total: £{(itemPrice * item.quantity).toFixed(2)}</span>
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

              <button onClick={handleSplitBill} className="split-bill-button">
                Split Bill
              </button>
            </div>
          );
        })
      )}

      {showSplitModal && (
        <SplitPaymentModal
          ordersReadyForPayment={ordersReadyForPayment}
          onClose={closeSplitModal}
          onPayment={onPayment}
        />
      )}
    </div>
  );
};

export default PaymentProcessingPage;





