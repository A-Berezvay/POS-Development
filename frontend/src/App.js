import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PINEntryForm from './components/pages/auth/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PINEntryForm />} />
      </Routes>
    </Router>
  );
}

export default App;

