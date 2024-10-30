// Assuming you are using functional React components and Hooks to build this dashboard:

import React, { useState } from 'react';
import './dashboard.css'; // Assuming there's some basic styling to differentiate the areas of the app

const Dashboard = () => {
  // Sample state representing tables, whether they are open or occupied, and which waiter opened it
  const [tables, setTables] = useState([
    { id: 1, status: 'free', waiter: null },
    { id: 2, status: 'occupied', waiter: 'John' },
    { id: 3, status: 'free', waiter: null },
    { id: 4, status: 'occupied', waiter: 'Sarah' },
  ]);

  const handleOpenTable = (tableId, waiter) => {
    // Opening a new table and assigning it to the waiter
    const updatedTables = tables.map((table) =>
      table.id === tableId ? { ...table, status: 'occupied', waiter: waiter } : table
    );
    setTables(updatedTables);
  };

  const handlePickUpTable = (tableId) => {
    // Handling pickup of an already opened table (e.g., continue serving an existing table)
    alert(`Table ${tableId} picked up.`);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to eMenu POS Dashboard</h2>
      <div className="tables-container">
        {tables.map((table) => (
          <div key={table.id} className={`table ${table.status}`}>
            <h3>Table {table.id}</h3>
            {table.status === 'free' ? (
              <button onClick={() => handleOpenTable(table.id, 'CurrentWaiter')}>Open Table</button>
            ) : (
              <button onClick={() => handlePickUpTable(table.id)}>Pick Up Table</button>
            )}
            {table.status === 'occupied' && <p>Waiter: {table.waiter}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// In this sample code:
// - `tables` represents the current state of the tables.
// - A waiter can "open" a table, which changes the state to occupied and assigns the table to the waiter.
// - An "occupied" table can be picked up by clicking the Pick Up Table button, which allows the user to continue serving the same table.

// Make sure to add CSS to make the interface user-friendly. Each table should be visually distinct based on its state (e.g., different colors for occupied vs. free).
