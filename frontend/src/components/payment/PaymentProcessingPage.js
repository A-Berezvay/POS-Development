import React, { useState } from "react";
import "../../styles/PaymentProcessingPage.css";
import SplitPaymentModal from "./SplitPaymentModal"; // Import the new split payment modal component
import { useNavigate } from "react-router-dom";

const voidReasons = ["Customer Changed Mind", "Wrong Order", "Kitchen Error", "Other"];

const PaymentProcessingPage = ({ ordersReadyForPayment, onPayment, onRemoveOrderItem }) => {
  const navigate = useNavigate();

  // Function to calculate subtotal, service charge, and total amount
  const getAmountDetails = (tableId) => {
    const ordersForTable = ordersReadyForPayment[tableId] || [];
    const subtotal = ordersForTable.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);

    const serviceCharge = subtotal * 0.125; // 12.5% service charge
    const totalAmount = subtotal + serviceCharge;

    return { subtotal, serviceCharge, totalAmount };
  };

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [isVoidModalVisible, setIsVoidModalVisible] = useState(false);
  const [itemToVoid, setItemToVoid] = useState(null);
  const [tableIdForVoid, setTableIdForVoid] = useState(null);
  const [currentTableForSplit, setCurrentTableForSplit] = useState(null);
  const [remainingTotalByTable, setRemainingTotalByTable] = useState(
    Object.keys(ordersReadyForPayment).reduce((acc, tableId) => {
      const { totalAmount } = getAmountDetails(tableId);
      acc[tableId] = totalAmount;
      return acc;
    }, {})
  );

  // Function to handle the "Pay in Full" button
  const handlePayInFull = (tableId) => {
    const remainingTotal = remainingTotalByTable[tableId];
    if (remainingTotal > 0) {
      onPayment(tableId); // Clear orders and free the table
      navigate("/payment-method", { state: { totalAmount: remainingTotal, tableId } });
    } else {
      console.error("Total amount is zero or invalid.");
    }
  };

  // Function to open the Split Payment modal
  const handleSplitBill = (tableId) => {
    setCurrentTableForSplit(tableId);
    setShowSplitModal(true);
  };

  // Function to close the Split Payment modal
  const closeSplitModal = () => {
    setShowSplitModal(false);
    setCurrentTableForSplit(null);
  };

  // Update remaining total in both modal and page
  const updateRemainingTotal = (amount) => {
    if (currentTableForSplit) {
      setRemainingTotalByTable((prev) => ({
        ...prev,
        [currentTableForSplit]: parseFloat((prev[currentTableForSplit] - amount).toFixed(2)),
      }));
    }
  };

  // Handle void item initiation
  const handleVoidItemClick = (tableId, item) => {
    setIsVoidModalVisible(true);
    setItemToVoid(item);
    setTableIdForVoid(tableId);
  };

  // Handle void reason selection
  const handleVoidReasonSelect = (reason) => {
    if (itemToVoid && tableIdForVoid) {
      onRemoveOrderItem(tableIdForVoid, itemToVoid.id, reason);
      setItemToVoid(null);
      setTableIdForVoid(null);
    }
    setIsVoidModalVisible(false);
  };

  return (
    <div className="payment-processing-container">
      <h2>Payment Processing</h2>
      {Object.keys(ordersReadyForPayment).length === 0 ? (
        <p>No tables are ready for payment.</p>
      ) : (
        Object.keys(ordersReadyForPayment).map((tableId) => {
          const { subtotal, serviceCharge, totalAmount } = getAmountDetails(tableId);
          const remainingTotal = remainingTotalByTable[tableId];

          return (
            <div key={tableId} className="payment-table">
              <div className="bill-header">
                <div className="bill-header-sections">
                  <h3>Table</h3>
                  <span>{tableId}</span>
                </div>
                <div className="bill-header-sections">
                  <h3>Total</h3>
                  <span>£{remainingTotal.toFixed(2)}</span>
                </div>
              </div>

              {ordersReadyForPayment[tableId].map((item) => {
                const itemPrice = parseFloat(item.price);
                return (
                  <div key={item.id} className="payment-item">
                    <div className="payment-item-details">
                      <span>{item.quantity}x</span>
                      <span>{item.name}</span>
                      <span>£{itemPrice.toFixed(2)}</span>
                      <button
                        onClick={() => handleVoidItemClick(tableId, item)}
                        className="void-item-button"
                      >
                        x
                      </button>
                    </div>
                    {isVoidModalVisible && itemToVoid?.id === item.id && tableIdForVoid === tableId && (
                      <div className="void-modal">
                        <div className="void-modal-content">
                          <h4>Void Item: {item.name}</h4>
                          <p>Select a reason for voiding this item:</p>
                          <div className="void-reason-buttons">
                            {voidReasons.map((reason) => (
                              <button key={reason} onClick={() => handleVoidReasonSelect(reason)}>
                                {reason}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setIsVoidModalVisible(false)}
                            className="close-void-modal"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Display Subtotal, Service Charge, and Remaining Total */}
              <div className="amount-details">
                <div>
                  <h4>Subtotal</h4> 
                  <h4>£{subtotal.toFixed(2)}</h4>
                </div>
                <div>
                  <h4>Service Charge (12.5%):</h4> 
                  <h4>£{serviceCharge.toFixed(2)}</h4>
                </div>
                <div>
                <h4>Total:</h4>
                <h4>£{remainingTotal.toFixed(2)}</h4>
                </div>


              </div>

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

      {/* Conditionally render the SplitPaymentModal */}
      {showSplitModal && currentTableForSplit && (
        <SplitPaymentModal
          totalAmount={remainingTotalByTable[currentTableForSplit]}
          onClose={closeSplitModal}
          onConfirmSplitPayment={onPayment}
          tableId={currentTableForSplit}
          updateRemainingTotal={updateRemainingTotal}
        />
      )}
    </div>
  );
};

export default PaymentProcessingPage;

