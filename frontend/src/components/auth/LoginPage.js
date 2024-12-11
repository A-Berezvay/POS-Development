import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginPage.css';  // Optional, for styling

function LoginPage({ onLogin }) {
  // State to manage the entered PIN
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to handle when a number is clicked
  const handleNumberClick = (number) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  // Function to handle clearing the entered PIN
  const handleClear = () => {
    setPin('');
    setError(''); // Clear error message when clearing PIN
  };

  // Function to handle submitting the PIN for verification
  const handleSubmit = () => {
    const mockCorrectPin = "1234"; // Hardcoded PIN for mock verification

    if (pin.length === 4) {
      if (pin === mockCorrectPin) {
        onLogin(); // Call the parent onLogin function to set authentication state
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setError('Invalid PIN, please try again');
      }
    } else {
      setError('Please enter all 4 digits of the PIN');
    }
  };

  return (
    <div className="pin-login-page">
      <h2>Enter Your 4-Digit PIN</h2>
      <div className="pin-display">
        {/* Displaying the entered PIN in the input field */}
        <input
          type="password"
          value={pin}
          readOnly // Making it read-only so it can only be updated via number pad
          maxLength="4"
          style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '10px'}}
        />
      </div>
      {/* Number Pad for entering the PIN */}
      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            className="number-button"
          >
            {number}
          </button>
        ))}
      </div>
      {/* Clear and Submit Buttons */}
      <div className="controls">
        <button onClick={() => handleNumberClick(0)} className="number-button">0</button>
        <button onClick={handleClear} className="clear-button">Clear</button>
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
      {/* Error message if there is any */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;


