import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PINEntryForm from './components/pages/auth/LoginPage';
import Dashboard from './components/pages/dashboard/dashboard';
import Header from './components/common/header/header';

function App() {

  return (
    <Router> 
      <Routes>
        <Route path='/' element={<PINEntryForm/>} />
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;

