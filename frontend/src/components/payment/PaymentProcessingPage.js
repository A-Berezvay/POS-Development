import React, { useState } from 'react';
import '../../styles/PaymentProcessingPage.css';
import SplitPaymentModal from './SplitPaymentModal'; // Import the new split payment modal component
import { useNavigate } from 'react-router-dom';

const PaymentProcessingPage = ({ ordersReadyForPayment, onPayment }) => {
  const [showSplitModal, setShowSplitModal] = useState(false);
  const navigate = useNavigate();

  // This function handles the calculation of the total amount for a given table
  const getTotalAmount = (tableId) => {
    const ordersForTable = ordersReadyForPayment[tableId] || [];
    return ordersForTable.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // Function to handle the "Pay in Full" button
  const handlePayInFull = (tableId) => {
    const totalAmount = getTotalAmount(tableId);
    if (totalAmount > 0) {
      // Redirect to a new page for selecting the payment method
      navigate('/payment-method', { state: { totalAmount, tableId } });
    } else {
      console.error("Total amount is zero or invalid.");
    }
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
              <div className="bill-header">
                <div className="bill-header-sections">
                  <h3>Table</h3>
                  <span>{tableId}</span>
                </div>
                <div className="bill-header-sections">
                  <h3>Total</h3>
                  <span>£{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {ordersReadyForPayment[tableId].map((item) => {
                const itemPrice = parseFloat(item.price);
                return (
                  <div key={item.id} className="payment-item">
                    <span>{item.quantity}x</span>
                    <span>{item.name}</span>
                    <span>£{(itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              <h4>Total Amount: £{totalAmount.toFixed(2)}</h4>

              <div className="payment-method-section">
                <button onClick={() => handlePayInFull(tableId)} className="pay-in-full-button">
                  Pay in Full
                </button>
                <button onClick={() => handleSplitBill(tableId)} className="split-bill-button">
                  Split Bill
                </button>
              </div>
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
        />
      )}
    </div>
  );
};

export default PaymentProcessingPage;

