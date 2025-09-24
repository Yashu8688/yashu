import React from 'react';
import './EmailPage.css';
import { Link, useNavigate } from 'react-router-dom';

const EmailPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add validation or API call to check email
    navigate('/password');
  };

  return (
    <div className="email-container">
      <div className="email-box">
        <div className="email-header">
          <Link to="/" className="back-link">← Back</Link>
          <span className="sign-in-step">Sign In • Step 1 of 2</span>
        </div>
        <h2>Enter your email</h2>
        <p className="email-subtext">We'll check if you have an account</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address *</label>
          <input type="email" id="email" name="email" placeholder="Enter your email address" required />
          <button type="submit" className="submit-button">Next</button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default EmailPage;
