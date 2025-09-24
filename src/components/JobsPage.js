import React from 'react';
import './JobsPage.css';

const JobsPage = () => {
  return (
    <div className="jobs-container">
      {/* Header */}
      <div className="jobs-header">
        <div className="header-left">
          <div className="back-button">← Back</div>
          <div className="jobs-title">
            <span className="title-icon">👜</span>
            <span>Jobs</span>
          </div>
        </div>
        <div className="job-alerts-button">🔔 Job Alerts</div>
      </div>

      {/* Main Content */}
      <main className="jobs-main">
        <div className="content-wrapper">
          {/* Icon */}
          <div className="main-icon">👜</div>

          {/* Text Content */}
          <h1 className="main-title">Jobs</h1>
          <h2 className="coming-soon">Coming Soon</h2>

          <p className="description">
            We're working hard to bring you an amazing job search experience. Check back soon for exciting opportunities!
          </p>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-home">🏠 Back to Home</button>
            <span className="button-separator">or</span>
            <button className="btn btn-network">👥 Explore My Network</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobsPage;
