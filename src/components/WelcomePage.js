import React from 'react';
import './WelcomePage.css';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-left">
        <img src="/logoicons/Voyloo_Logo.png" alt="Voyloo Logo" className="logo" />
        <h1 className="brand-name">Voyloo</h1>
        <p className="tagline">Your story is your strength. Share it with the world.</p>
        <div className="app-store-buttons">
          <a href="#" className="app-store-button">
            <img src="/logoicons/apple.png" alt="App Store" />
            Download on the App Store
          </a>
          <a href="#" className="app-store-button">
            <img src="/logoicons/google-play.png" alt="Google Play" />
            Get it on Google Play
          </a>
        </div>
      </div>
      <div className="welcome-right">
        <div className="signin-box">
          <img src="/logoicons/Voyloo_Logo.png" alt="Voyloo Logo" className="signin-logo" />
          <h2>Welcome to Voyloo</h2>
          <h3>Sign In</h3>
          <button className="signin-button google">
            <img src="/logoicons/google-icon.png" alt="Google" />
            Sign in with Google
          </button>
          <button className="signin-button apple">
            <img src="/logoicons/apple-icon.png" alt="Apple" />
            Sign in with Apple ID
          </button>
          <button className="signin-button outlook">
            <img src="/logoicons/outlook-icon.png" alt="Outlook" />
            Sign in with Outlook
          </button>
          <div className="or-divider">or</div>
          <Link to="/email" className="continue-email-button">Continue with Email</Link>
          <Link to="/password" className="forgot-password-link">Forgot Password?</Link>
          <p className="signup-text">
            Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
          </p>
          <p className="terms-text">
            By signing in, you agree to Voyloo's <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> &amp; <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Use</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
