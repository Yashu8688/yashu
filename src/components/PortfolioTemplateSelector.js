import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioTemplateSelector.css';

const PortfolioTemplateSelector = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/landing');
  };

  const handleClose = () => {
    navigate('/landing');
  };

  const handleSelectTemplate = (templateName) => {
    // Handle template selection logic here
    console.log(`Selected template: ${templateName}`);
    // You can add navigation to the next step or show a success message
  };

  const handleAIRecommendation = () => {
    // Handle AI recommendation logic here
    console.log('AI Recommendation clicked');
  };

  return (
    <div className="portfolio-selector-overlay">
      <div className="portfolio-selector-modal">
        {/* Header */}
        <div className="modal-header">
          <a href="#" className="back-link" onClick={handleBackToHome}>
            ← Back to Home
          </a>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h1 className="main-title">Choose Your Portfolio Template</h1>
          <p className="subtitle">
            Select a portfolio template that best represents your professional brand and industry.
            You can customize it later to match your unique style.
          </p>
        </div>

        {/* Template Cards */}
        <div className="templates-grid">
          {/* Voyloo Portfolio */}
          <div className="template-card">
            <div className="template-icon voyloo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="24" height="24" rx="4" fill="white"/>
                <rect x="12" y="12" width="16" height="2" fill="#2563eb"/>
                <rect x="12" y="16" width="12" height="2" fill="#2563eb"/>
                <rect x="12" y="20" width="8" height="2" fill="#2563eb"/>
              </svg>
            </div>
            <h3 className="template-title">Voyloo Portfolio</h3>
            <p className="template-description">
              Our signature design optimized for maximum professional impact
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Signature design</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Maximum visibility</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Industry optimized</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Career accelerator</span>
              </div>
            </div>

            <button className="select-button" onClick={() => navigate('/uploadresumemodal')} style={{ cursor: 'pointer' }}>Select Template</button>
          </div>

          {/* ATS Friendly Portfolio */}
          <div className="template-card">
            <div className="template-icon ats-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="24" height="24" rx="4" fill="white"/>
                <rect x="12" y="12" width="16" height="2" fill="#374151"/>
                <rect x="12" y="16" width="12" height="2" fill="#374151"/>
                <rect x="12" y="20" width="10" height="2" fill="#374151"/>
                <circle cx="28" cy="14" r="2" fill="#374151"/>
              </svg>
            </div>
            <h3 className="template-title">ATS Friendly Portfolio</h3>
            <p className="template-description">
              Optimized for Applicant Tracking Systems and executive review
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>ATS optimization</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Executive design</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Corporate styling</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Keyword friendly</span>
              </div>
            </div>

            <button className="select-button" onClick={() => navigate('/uploadresumemodal')} style={{ cursor: 'pointer' }}>Select Template</button>
          </div>

          {/* Creative Portfolio */}
          <div className="template-card">
            <div className="template-icon creative-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="24" height="24" rx="12" fill="white"/>
                <circle cx="16" cy="16" r="3" fill="#ec4899"/>
                <circle cx="24" cy="16" r="3" fill="#ec4899"/>
                <rect x="12" y="22" width="16" height="2" rx="1" fill="#ec4899"/>
              </svg>
            </div>
            <h3 className="template-title">Creative Portfolio</h3>
            <p className="template-description">
              Bold and artistic showcase for creative professionals
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Artistic layouts</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Interactive elements</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Custom animations</span>
              </div>
              <div className="feature-item">
                <span className="checkmark">✓</span>
                <span>Visual storytelling</span>
              </div>
            </div>

            <button className="select-button" onClick={() => navigate('/uploadresumemodal')} style={{ cursor: 'pointer' }}>Select Template</button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <p className="recommendation-text">Not sure which template is right for you?</p>
          <button className="ai-recommendation-button" onClick={handleAIRecommendation}>
            <span className="ai-icon">✨</span>
            Get AI Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTemplateSelector;
