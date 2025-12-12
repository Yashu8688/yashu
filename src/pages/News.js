// src/pages/News.js
import React, { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "./News.css";

function News() {
  const [activeFilter, setActiveFilter] = useState("all");

  const newsItems = [
    {
      id: 1,
      title: "New OPT Extension Rules Announced",
      description: "USCIS announces 24-month STEM OPT exten updates for 2026.",
      source: "USCIS",
      verified: true,
      applicableToYou: true,
      category: "OPT",
      urgent: false,
    },
    {
      id: 2,
      title: "H-1B Visa Cap Registration Opens",
      description: "Registration period for H-1B lottery opens March 1-17, 2026.",
      source: "Department of State",
      verified: true,
      applicableToYou: true,
      category: "H-1B",
      urgent: true,
    },
    {
      id: 3,
      title: "F-1 Student Work Authorization Updates",
      description: "New guidelines for F-1 students seeking on-campus employment.",
      source: "Immigration News",
      verified: true,
      applicableToYou: true,
      category: "F-1",
      urgent: false,
    },
    {
      id: 4,
      title: "Travel Advisory for International Students",
      description: "Important information for students planning international travel.",
      source: "US Embassy",
      verified: true,
      applicableToYou: false,
      category: "F-1",
      urgent: false,
    },
  ];

  const filters = [
    { id: "all", label: "All News", count: 24 },
    { id: "f1", label: "F-1 Visa", count: 8 },
    { id: "opt", label: "OPT", count: 5 },
    { id: "h1b", label: "H-1B", count: 6 },
  ];

  const trendingTopics = ["#STEM_OPT", "#H1B_Lottery", "#Travel_Rules", "#CPT_Guidelines"];

  const urgentCount = newsItems.filter(item => item.urgent || item.applicableToYou).length;

  return (
    <div className="news-container">
      <Header />

      <main className="news-content">
        {/* News Header Banner */}
        <div className="news-header-banner">
          <div className="news-banner-content">
            <div className="news-banner-left">
              <h1 className="news-banner-title">
                Immigration News{" "}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path d="M7 7H17M7 12H17M7 17H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </h1>
              <p className="news-banner-subtitle">Stay updated with latest immigration updates</p>
            </div>
            <div className="news-banner-badge">Verified Sources. Not Legal Advice.</div>
          </div>
        </div>

        {/* News Feed Section */}
        <div className="news-feed-section">
          <div className="news-feed-header">
            <div className="news-feed-title-section">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M7 7H17M7 12H17M7 17H13" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div>
                <h2 className="news-feed-title">News Feed</h2>
                <p className="news-feed-subtitle">Latest immigration updates</p>
              </div>
            </div>
            <div className="urgent-alert">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <div className="urgent-label">High Priority</div>
                <div className="urgent-text">Tap to view {urgentCount} urgent updates</div>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="filter-pills">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-pill ${activeFilter === filter.id ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label} {filter.count}
              </button>
            ))}
          </div>

          {/* News Items */}
          <div className="news-items">
            {newsItems.map((item) => (
              <div key={item.id} className="news-item">
                <div className="news-item-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="#64748b"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="news-item-content">
                  <h3 className="news-item-title">{item.title}</h3>
                  <p className="news-item-description">{item.description}</p>
                  <div className="news-item-meta">
                    <span className="news-source">Source</span>
                    <span className="news-dot">•</span>
                    <span className="news-source-name">{item.source}</span>
                    <span className="news-dot">•</span>
                    {item.verified && (
                      <span className="verified-badge">
                        OT{" "}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="#10b981" strokeWidth="1.5" fill="none" />
                          <path d="M5 7L6.5 8.5L9 6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                <div className="news-item-actions">
                  {item.applicableToYou && (
                    <div className="applicable-badge">
                      <span>Source</span>
                      <span className="arrow-sep">›</span>
                      <span className="applicable-text">
                        Applicable to You{" "}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M3 6H9M9 6L6 3M9 6L6 9" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </span>
                    </div>
                  )}
                  <a href="#read" className="read-link">
                    Read{" "}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="trending-section">
          <div className="trending-header">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 12L8 6L12 10L18 4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 4H18V8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="trending-title">Trending Topics</h3>
          </div>
          <div className="trending-tags">
            {trendingTopics.map((topic, index) => (
              <button key={index} className="trending-tag">
                {topic}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Floating AI Button */}
      <button className="floating-ai-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </button>

      <BottomNav />
    </div>
  );
}

export default News;
