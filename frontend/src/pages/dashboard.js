import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/dashboard.css'; // Assuming there's some basic styling to differentiate the areas of the app
import GuestModal from './GuestModal';
import OrderPage from '../components/order/OrderPage';

const Dashboard = ({ onAddToCart, tables, }) => {
  const [currentView, setCurrentView] = useState('service');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const [numberOfGuest, setNumberOfGuest] = useState(1);
  const navigate = useNavigate(); // Initialize navigate

  const handleOpenTable = (tableId) => {
    // Enter the number of guest into the window
    setIsGuestModalVisible(true);
    setSelectedTable(tableId);
  };

  const handleConfirmGuest = (numGuest) => {
    setNumberOfGuest(numGuest)
    if (selectedTable) {
    // Navigate to the Order Page for the selected table
    navigate(`/table/${selectedTable}/order`);
    }
    
    setIsGuestModalVisible(false);
  };


  return (
    <div className="dashboard-container">
      {currentView === 'service' && !selectedTable && (
        <div className="tables-container">
          {tables.map((table) => (
            <div key={table.id} className={`table ${table.status}`}>
              <h3>Table {table.id}</h3>
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

      <GuestModal
        isVisible={isGuestModalVisible}
        onConfirm={handleConfirmGuest}
      />
    </div>
  );
};

export default Dashboard;




