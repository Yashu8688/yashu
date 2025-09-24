import React from 'react';
import './PortfolioGallery.css';

const portfolios = [
  {
    id: 1,
    recommended: true,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
      </svg>
    ),
    popularity: '95%',
    title: 'Voyloo Portfolio',
    description: 'Modern professional portfolio with clean design and powerful features',
    tags: [
      { text: 'ATS-friendly', color: 'blue' },
      { text: 'Mobile responsive', color: 'blue' },
      { text: 'Analytics tracking', color: 'blue' },
      { text: '+1 more', color: 'gray' },
    ],
  },
  {
    id: 2,
    recommended: false,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
    popularity: '88%',
    title: 'ATS Friendly',
    description: 'Optimized for Applicant Tracking Systems with clean, scannable layout',
    tags: [
      { text: 'ATS-optimized', color: 'gray' },
      { text: 'Clean layout', color: 'gray' },
      { text: 'Easy parsing', color: 'gray' },
      { text: '+1 more', color: 'gray' },
    ],
  },
  {
    id: 3,
    recommended: false,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 3.87 7 13 7 13s7-9.13 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
    ),
    popularity: '82%',
    title: 'Creative Portfolio',
    description: 'Bold and creative design perfect for designers and artists',
    tags: [
      { text: 'Visual showcase', color: 'purple' },
      { text: 'Creative layouts', color: 'purple' },
      { text: 'Interactive elements', color: 'purple' },
      { text: '+1 more', color: 'gray' },
    ],
  },
];

const featuredPortfolios = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Product Designer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    tag: 'Voyloo Portfolio',
    views: '2.5k',
    likes: 156,
  },
  {
    id: 2,
    name: 'Alex Chen',
    role: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    tag: 'ATS Friendly',
    views: '1.8k',
    likes: 98,
  },
  {
    id: 3,
    name: 'Maya Rodriguez',
    role: 'Creative Director',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    tag: 'Creative Portfolio',
    views: '3.2k',
    likes: 234,
  },
];

const PortfolioGallery = () => {
  return (
    <div className="portfolio-gallery">
      <header className="pg-header">
        <button className="back-button" aria-label="Go back">
          &#8592;
        </button>
        <div className="pg-title-group">
          <h1>Portfolio Gallery</h1>
          <p>Choose the perfect template for your professional portfolio</p>
        </div>
        <button className="create-button">
          + Create New Portfolio
        </button>
      </header>

      <nav className="pg-tabs">
        <button className="tab active">All Templates (3)</button>
        <button className="tab">Professional (2)</button>
        <button className="tab">Creative (1)</button>
      </nav>

      <section className="pg-templates-section">
        <h2>
          <span role="img" aria-label="sparkles">✨</span> Portfolio Templates
        </h2>

        <div className="pg-cards">
          {portfolios.map((portfolio) => (
            <article key={portfolio.id} className={`pg-card ${portfolio.recommended ? 'recommended' : ''}`}>
              {portfolio.recommended && (
                <div className="recommended-badge">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: '4px' }}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  Recommended
                </div>
              )}
              <div className="pg-card-image-wrapper">
                <img src={portfolio.image} alt={portfolio.title} className="pg-card-image" />
                <div className="pg-card-overlay">
                  <div className="pg-card-icon">{portfolio.icon}</div>
                  <div className="pg-card-popularity">
                    <svg width="14" height="14" fill="white" viewBox="0 0 24 24" className="popularity-icon" aria-hidden="true">
                      <path d="M3 17h2v-7H3v7zm4 0h2v-4H7v4zm4 0h2v-10h-2v10zm4 0h2v-6h-2v6zm4 0h2v-2h-2v2z"/>
                    </svg>
                    <span>{portfolio.popularity}</span>
                  </div>
                </div>
              </div>
              <div className="pg-card-content">
                <h3>{portfolio.title}</h3>
                <p>{portfolio.description}</p>
                <div className="pg-tags">
                  {portfolio.tags.map((tag, idx) => (
                    <span key={idx} className={`pg-tag ${tag.color}`}>{tag.text}</span>
                  ))}
                </div>
                <div className="pg-card-buttons">
                  <button className="btn-outline">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="btn-icon" aria-hidden="true">
                      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                      <circle cx="12" cy="12" r="2.5"/>
                    </svg>
                    Preview
                  </button>
                  <button className="btn-primary">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="btn-icon" aria-hidden="true">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                    </svg>
                    Use Template
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pg-featured-section">
        <div className="pg-featured-header">
          <h3>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="featured-icon" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"/>
            </svg>
            Featured Portfolios
          </h3>
          <span className="community-picks">Community Picks</span>
        </div>
        <div className="pg-featured-cards">
          {featuredPortfolios.map((profile) => (
            <article key={profile.id} className="pg-featured-card">
              <div className="pg-featured-avatar-wrapper">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="pg-featured-avatar" />
                ) : (
                  <div className="pg-featured-avatar-placeholder" aria-label="No avatar" />
                )}
              </div>
              <div className="pg-featured-content">
                <div className="pg-featured-header-text">
                  <h4>{profile.name}</h4>
                  <p>{profile.role}</p>
                </div>
                <button className="pg-featured-tag">{profile.tag}</button>
                <div className="pg-featured-stats">
                  <div className="views">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="views-icon" aria-hidden="true">
                      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                      <circle cx="12" cy="12" r="2.5"/>
                    </svg>
                    <span>{profile.views} views</span>
                  </div>
                  <div className="likes">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="likes-icon" aria-hidden="true">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{profile.likes} likes</span>
                  </div>
                </div>
                <div className="pg-featured-actions">
                  <button className="btn-view">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="btn-icon" aria-hidden="true">
                      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                      <circle cx="12" cy="12" r="2.5"/>
                    </svg>
                    View
                  </button>
                  <button className="btn-share" aria-label="Share portfolio">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="btn-icon" aria-hidden="true">
                      <path d="M18 8a3 3 0 1 0-2.83-4H8a3 3 0 1 0 0 6h7.17A3 3 0 0 0 18 8zm-6 8a3 3 0 1 0-2.83-4H2a3 3 0 1 0 0 6h7.17A3 3 0 0 0 12 16z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioGallery;
