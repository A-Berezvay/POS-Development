import React from 'react';
import '../../styles/PaymentProcessingPage.css';

const PaymentProcessingPage = ({ ordersReadyForPayment, onPayment }) => {
  return (
    <div className="payment-processing-container">
      <h2>Payment Processing</h2>
      {Object.keys(ordersReadyForPayment).length === 0 ? (
        <p>No tables are ready for payment.</p>
      ) : (
        Object.keys(ordersReadyForPayment).map((tableId) => {
          // Calculate total amount for the table
          const totalAmount = ordersReadyForPayment[tableId].reduce((total, item) => {
            const itemPrice = parseFloat(item.price); // Ensure price is always a valid number
            const itemQuantity = item.quantity || 1;

            return total + (itemPrice * itemQuantity);
          }, 0);

          return (
            <div key={tableId} className="payment-table">
              <h3>Table {tableId}</h3>
              {ordersReadyForPayment[tableId].map((item) => {
                const itemPrice = parseFloat(item.price); // Ensure it's always a valid number
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
              <button
                onClick={() => onPayment(tableId)}
                className="make-payment-button"
              >
                Make Payment
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PaymentProcessingPage;




