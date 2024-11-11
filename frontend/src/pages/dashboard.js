import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/dashboard.css'; // Assuming there's some basic styling to differentiate the areas of the app
import MenuManagement from '../components/menu/MenuManagement'; // Import the MenuManagement component
import OrderPage from '../components/order/OrderPage';

const Dashboard = ({ onAddToCart, tables, onOpenTable }) => {
  const [currentView, setCurrentView] = useState('service');
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleOpenTable = (tableId) => {
    // Set the selected table and show the OrderPage
    setSelectedTable(tableId);
    setCurrentView('order');

    // Assign the waiter and update the table status to "occupied"
    onOpenTable(tableId, 'John Doe'); // Assign a waiter named "John Doe"

    // Navigate to the Order Page for the selected table
    navigate(`/table/${tableId}/order`);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to eMenu POS Dashboard</h2>

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
    </div>
  );
};

export default Dashboard;




