import React, { useState } from 'react';
import './PasswordPage.css';
import { Link } from 'react-router-dom';

const PasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const email = "yashuyashwanth9346@gmail.com"; // This should ideally come from state or context

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-container">
      <div className="password-box">
        <div className="password-header">
          <Link to="/email" className="back-link">← Back</Link>
          <span className="sign-in-step">Sign In • Step 2 of 2</span>
        </div>
        <h2>Enter your password</h2>
        <p className="welcome-back">Welcome back! Please enter your password for <br />{email}</p>
        <form onSubmit={(e) => {
          e.preventDefault();
          // Navigate to landing page on sign in
          window.location.href = '/landing';
        }}>
          <label htmlFor="password">Password *</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit" className="submit-button">Sign In</button>
        </form>
        <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default PasswordPage;
