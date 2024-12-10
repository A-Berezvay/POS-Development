import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard.css';
import GuestModal from './GuestModal';
import OrderPage from '../components/order/OrderPage';

const Dashboard = ({ onAddToCart, tables, setTables }) => {
  const [currentView, setCurrentView] = useState('service');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleOpenTable = (tableId) => {
    const table = tables.find((t) => t.id === tableId);

    // Only ask for number of guests if it's the first time the table is being opened
    if (table.status === 'free' && table.numberOfGuests === null) {
      setSelectedTable(tableId);
      setIsGuestModalVisible(true);
    } else {
      // Navigate to the order page if the table is already occupied
      navigate(`/table/${tableId}/order`, { state: { numberOfGuests: table.numberOfGuests } });
    }
  };

  const handleConfirmGuest = (numGuest) => {
    //Update the tables with the new number of guests
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === selectedTable
          ? { ...table, numberOfGuests: numGuest, status: 'occupied' }
          : table
      )
    );

    // Now navigate to the Order Page after confirming the number of guests
    navigate(`/table/${selectedTable}/order`, { state: { numberOfGuests: numGuest } });

    // Hide the guest modal
    setIsGuestModalVisible(false);
  };

  return (
    <div className="dashboard-container">
      {currentView === 'service' && (
        <div className="tables-container">
          {tables.map((table) => (
            <div key={table.id} className={`table ${table.status}`}>
              <h3>Table {table.id}</h3>
              {table.numberOfGuests !== null && (
                <div className="guest-count">
                  <FontAwesomeIcon icon={faUsers} />
                  <span> {table.numberOfGuests}</span>
                </div>

              )}
              {table.status === 'free' ? (
                <button onClick={() => handleOpenTable(table.id)}>Open Table</button>
              ) : (
                <button onClick={() => handleOpenTable(table.id)}>Pick Up Table</button>
              )}
              {table.status === 'occupied' && table.waiter && (
                <p>Waiter: {table.waiter}</p> // Displaying the assigned waiter's name
              )}
            </div>
          ))}
        </div>
      )}

      {currentView === 'order' && selectedTable && (
        <OrderPage 
          selectedTable={selectedTable} 
          onAddToCart={onAddToCart}
        />
      )}

      {isGuestModalVisible && (
        <GuestModal
          isVisible={isGuestModalVisible}
          onConfirm={handleConfirmGuest}
        />
      )}
    </div>
  );
};

export default Dashboard;





