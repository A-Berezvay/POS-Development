import React, { useState } from 'react';
import '../styles/dashboard.css'; // Assuming there's some basic styling to differentiate the areas of the app
import MenuManagement from '../components/menu/MenuManagement'; // Import the MenuManagement component
import OrderPage from '../components/order/OrderPage';

const Dashboard = ({ onAddToCart }) => {
  // Sample state representing tables, whether they are open or occupied, and which waiter opened it
  const [tables, setTables] = useState([
    { id: 1, status: 'free', waiter: null },
    { id: 2, status: 'occupied', waiter: 'John' },
    { id: 3, status: 'free', waiter: null },
    { id: 4, status: 'occupied', waiter: 'Sarah' },
  ]);

  // State to manage the current view (service or menu management)
  const [currentView, setCurrentView] = useState('service');
  const [selectedTable, setSelectedTable] = useState(null);

  const handleOpenTable = (tableId, waiter) => {
    // Set the selected table and show the OrderPage
    setSelectedTable(tableId);
    setCurrentView('order');
  };

  const handleBackToDashboard = () => {
    // Return to the dashboard
    setSelectedTable(null);
    setCurrentView('service');
  };

  const handlePickUpTable = (tableId) => {
    // Handling pickup of an already opened table (e.g., continue serving an existing table)
    alert(`Table ${tableId} picked up.`);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to eMenu POS Dashboard</h2>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-button ${currentView === 'service' ? 'active' : ''}`}
          onClick={() => setCurrentView('service')}
        >
          Service
        </button>
        <button
          className={`tab-button ${currentView === 'menu' ? 'active' : ''}`}
          onClick={() => setCurrentView('menu')}
        >
          Menu Management
        </button>
      </div>

      {/* Conditional rendering based on the current view */}
      {currentView === 'menu' && <MenuManagement />}

      {currentView === 'service' && !selectedTable && (
        <div className="tables-container">
          {tables.map((table) => (
            <div key={table.id} className={`table ${table.status}`}>
              <h3>Table {table.id}</h3>
              {table.status === 'free' ? (
                <button onClick={() => handleOpenTable(table.id)}>Open Table</button>
              ) : (
                <button onClick={() => handlePickUpTable(table.id)}>Pick Up Table</button>
              )}
              {table.status === 'occupied' && <p>Waiter: {table.waiter}</p>}
            </div>
          ))}
        </div>
      )}

      {currentView === 'order' && selectedTable && (
        <OrderPage 
          selectedTable={selectedTable} 
          onBack={handleBackToDashboard}
          onAddToCart={onAddToCart} 
        />
      )}
    </div>
  );
};

export default Dashboard;

// In this updated version:
// - Added tabs for "Service" and "Menu Management".
// - Clicking on "Service" displays the table view, while clicking on "Menu Management" shows the menu management component.
// - State (`currentView`) is used to control which view is displayed.


// In this sample code:
// - `tables` represents the current state of the tables.
// - A waiter can "open" a table, which changes the state to occupied and assigns the table to the waiter.
// - An "occupied" table can be picked up by clicking the Pick Up Table button, which allows the user to continue serving the same table.

// Make sure to add CSS to make the interface user-friendly. Each table should be visually distinct based on its state (e.g., different colors for occupied vs. free).
