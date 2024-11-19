import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/dashboard.css'; // Assuming there's some basic styling to differentiate the areas of the app
import OrderPage from '../components/order/OrderPage';

const Dashboard = ({ onAddToCart, tables, onOpenTable }) => {
  const [currentView, setCurrentView] = useState('service');
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleOpenTable = (tableId) => {
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
                <button onClick={() => handleOpenTable(table.id)}>Add Items</button>
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




