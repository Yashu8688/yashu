// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import "./Header.css";

function Header() {

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="header-logo-circle">V</div>
          <span className="header-logo-text">Voyloo Assistant</span>
        </div>
      </div>

      <div className="header-center">
        <div className="secure-indicator">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1L3 3.5V7.5C3 11 5.5 14 8 15C10.5 14 13 11 13 7.5V3.5L8 1Z"
              stroke="#6366F1"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <span>Secure</span>
          <span className="dot">•</span>
          <span className="not-legal">Not Legal Advice</span>
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn settings-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
              stroke="#64748B"
              strokeWidth="1.5"
            />
            <path
              d="M16.5 10C16.5 10.5 16.5 11 16.3 11.4L18 12.5L16.5 15L14.5 14.2C14 14.6 13.5 14.9 12.9 15.1L12.5 17H7.5L7.1 15.1C6.5 14.9 6 14.6 5.5 14.2L3.5 15L2 12.5L3.7 11.4C3.6 11 3.5 10.5 3.5 10C3.5 9.5 3.5 9 3.7 8.6L2 7.5L3.5 5L5.5 5.8C6 5.4 6.5 5.1 7.1 4.9L7.5 3H12.5L12.9 4.9C13.5 5.1 14 5.4 14.5 5.8L16.5 5L18 7.5L16.3 8.6C16.5 9 16.5 9.5 16.5 10Z"
              stroke="#64748B"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>

        <Link to="/notifications" className="header-icon-btn notification-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42116 18.2537 9.16816 18.1079C8.91516 17.9622 8.70486 17.7526 8.55835 17.5"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="notification-badge">3</span>
        </Link>

        <button className="premium-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2L10 6H14L10.5 9L12 13L8 10.5L4 13L5.5 9L2 6H6L8 2Z"
              fill="white"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          Premium
        </button>

        <button onClick={handleLogout} className="logout-btn">Logout</button>

      </div>
    </header>
  );
}

export default Header;
