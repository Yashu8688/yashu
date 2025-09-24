import React from 'react';
import './PortfolioStyleSelector.css';

const PortfolioStyleSelector = ({ onClose }) => {
  const portfolioOptions = [
    {
      id: 'voyloo',
      title: 'Voyloo Portfolio',
      description: 'Our signature design optimized for maximum professional impact',
      features: [
        'Voyloo branding',
        'Professional layout',
        'Mobile-responsive',
        'Easy to customize'
      ]
    },
    {
      id: 'ats',
      title: 'ATS Friendly Portfolio',
      description: 'Optimized for Applicant Tracking Systems and executive review',
      features: [
        'ATS optimization',
        'Executive design',
        'Corporate styling',
        'Keyword friendly'
      ]
    },
    {
      id: 'creative',
      title: 'Creative Portfolio',
      description: 'Bold and artistic showcase for creative professionals',
      features: [
        'Artistic layouts',
        'Interactive elements',
        'Custom animations',
        'Visual storytelling'
      ]
    }
  ];

  return (
    <div className="portfolio-modal-overlay">
      <div className="portfolio-modal">
        <div className="portfolio-modal-header">
          <h2>Choose Your Portfolio Style</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="portfolio-options">
          {portfolioOptions.map((option) => (
            <div key={option.id} className="portfolio-card">
              <div className="portfolio-icon">
                <div className="icon-placeholder"></div>
              </div>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <ul className="feature-list">
                {option.features.map((feature, index) => (
                  <li key={index}>
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioStyleSelector;
