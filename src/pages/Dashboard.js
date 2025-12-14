// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy, limit, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "./Dashboard.css";

function Dashboard() {
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [expiringDocuments, setExpiringDocuments] = useState([]);
  const [activeTimelineItem, setActiveTimelineItem] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'documents'), orderBy('uploadedAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setRecentDocuments(docs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'documents'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Include documents that have either startDate or expiryDate
        if (data.startDate || data.expiryDate) {
          docs.push({ id: doc.id, ...data });
        }
      });
      // Sort by startDate or expiryDate ascending
      docs.sort((a, b) => {
        const aDate = a.startDate || a.expiryDate;
        const bDate = b.startDate || b.expiryDate;
        return aDate.toDate() - bDate.toDate();
      });
      setExpiringDocuments(docs);
      // Set the first document as active by default
      setActiveTimelineItem(docs.length > 0 ? docs[0].id : null);
    });

    return () => unsubscribe();
  }, []);

  const calculateDaysLeft = (date) => {
    if (!date) return null;
    const today = new Date();
    const targetDate = date.toDate ? date.toDate() : new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>Welcome back, Alex! 👋</h1>
            <p>Your Immigration Journey Starts Here</p>
          </div>
         
          <button className="visa-readiness-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2" fill="none" />
              <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="btn-title">Visa Readiness Score</div>
              <div className="btn-subtitle">View Checklist</div>
            </div>
          </button>
        </div>

        <div className="info-cards-row">
          <div className="info-card deadline-card">
            <div className="card-icon warning-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="card-content">
              <div className="card-label">OPT Application Deadline</div>
              <div className="card-value">45 Days Left</div>
              <a href="#timeline" className="card-link">
                Tap to View Timeline ›
              </a>
            </div>
          </div>

          <div className="info-card documents-card">
            <div className="card-icon success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="card-content">
              <div className="card-value-large">12 / 15</div>
              <div className="card-label">Documents Uploaded</div>
              <div className="progress-text">80% Complete</div>
            </div>
          </div>
        </div>

        <div className="alerts-card">
          <div className="alert-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" fill="#1e293b" />
              <text x="10" y="14" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                !
              </text>
            </svg>
          </div>
          <div className="alert-content">
            <div className="alert-title">Recent Documents</div>
            <div className="alert-subtitle">
              {recentDocuments.length > 0 ? (
                recentDocuments.map(doc => (
                  <div key={doc.id}>{doc.name} - Expires: {doc.expiryDate?.toDate().toLocaleDateString()}</div>
                ))
              ) : (
                "No recent documents"
              )}
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="section-title">Quick Actions</div>
        <div className="quick-actions-grid">
          <button className="quick-action-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6366f1" strokeWidth="2" fill="none" />
              <path d="M16 2V6M8 2V6M3 10H21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>View Full OPT Timeline</span>
          </button>

          <button className="quick-action-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                stroke="#6366f1"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#6366f1"
                strokeWidth="2"
                fill="none"
              />
              <path d="M9 12L11 14L15 10" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Verify Uploaded Documents</span>
          </button>

          <button className="quick-action-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="#6366f1"
                strokeWidth="2"
                fill="none"
              />
              <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Add New Document</span>
          </button>

          <button className="quick-action-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span>Ask Immigration Assistant</span>
          </button>
        </div>

        <div className="timeline-section">
          <div className="timeline-header">
            <div className="timeline-header-left">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="4" width="14" height="14" rx="2" stroke="#6366f1" strokeWidth="1.5" fill="none" />
                <path d="M13 2V6M7 2V6M3 8H17" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <div className="timeline-title">Visa Timeline</div>
                <div className="timeline-subtitle">OPT Application In Progress</div>
              </div>
            </div>
            <button className="set-reminder-btn">Set Reminder</button>
          </div>

          <div className="overall-progress">
            <div className="progress-header">
              <span>Overall Progress</span>
              <span className="days-left-badge">
                {activeTimelineItem ? (
                  expiringDocuments.find(doc => doc.id === activeTimelineItem) ?
                    (() => {
                      const doc = expiringDocuments.find(doc => doc.id === activeTimelineItem);
                      const startDate = doc.startDate;
                      const expiryDate = doc.expiryDate;
                      const today = new Date();
                      let daysLeft = null;

                      if (startDate && expiryDate) {
                        daysLeft = calculateDaysLeft(expiryDate);
                      } else if (expiryDate) {
                        daysLeft = calculateDaysLeft(expiryDate);
                      }

                      return daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days left` : 'Expired') : 'Active';
                    })()
                    : '0'
                ) : '0'}
              </span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{
                width: activeTimelineItem ? (
                  expiringDocuments.find(doc => doc.id === activeTimelineItem) ?
                    (() => {
                      const doc = expiringDocuments.find(doc => doc.id === activeTimelineItem);
                      const startDate = doc.startDate;
                      const expiryDate = doc.expiryDate;
                      const today = new Date();
                      let progress = 0;

                      if (startDate && expiryDate) {
                        const start = startDate.toDate();
                        const expiry = expiryDate.toDate();
                        const totalDuration = expiry - start;
                        const elapsed = today - start;
                        progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                      } else if (expiryDate) {
                        const daysLeft = calculateDaysLeft(expiryDate);
                        progress = daysLeft > 0 ? 0 : 100;
                      } else if (startDate) {
                        progress = 50;
                      }

                      return `${progress}%`;
                    })()
                    : "65%"
                ) : "0%"
              }}></div>
            </div>
            <div className="progress-footer">
              <span className="progress-percentage">
                {activeTimelineItem ? (
                  expiringDocuments.find(doc => doc.id === activeTimelineItem) ?
                    (() => {
                      const doc = expiringDocuments.find(doc => doc.id === activeTimelineItem);
                      const startDate = doc.startDate;
                      const expiryDate = doc.expiryDate;
                      const today = new Date();
                      let progress = 0;

                      if (startDate && expiryDate) {
                        const start = startDate.toDate();
                        const expiry = expiryDate.toDate();
                        const totalDuration = expiry - start;
                        const elapsed = today - start;
                        progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                      } else if (expiryDate) {
                        const daysLeft = calculateDaysLeft(expiryDate);
                        progress = daysLeft > 0 ? 0 : 100;
                      } else if (startDate) {
                        progress = 50;
                      }

                      return `${Math.round(progress)}% Complete`;
                    })()
                    : "65% Complete"
                ) : "0% Complete"}
              </span>
              <span className="deadline-date">
                {activeTimelineItem ? (
                  expiringDocuments.find(doc => doc.id === activeTimelineItem) ?
                    (() => {
                      const doc = expiringDocuments.find(doc => doc.id === activeTimelineItem);
                      const startDate = doc.startDate;
                      const expiryDate = doc.expiryDate;

                      if (expiryDate) {
                        return expiryDate.toDate().toLocaleDateString();
                      } else if (startDate) {
                        return startDate.toDate().toLocaleDateString();
                      } else {
                        return '0';
                      }
                    })()
                    : '0'
                ) : '0'}
              </span>
            </div>
          </div>

          <div className="timeline-items">
            {expiringDocuments.length > 0 ? (
              expiringDocuments.map((doc, index) => {
                const startDate = doc.startDate;
                const expiryDate = doc.expiryDate;
                const today = new Date();
                let progress = 0;
                let daysLeft = null;
                let status = '';

                if (startDate && expiryDate) {
                  const start = startDate.toDate();
                  const expiry = expiryDate.toDate();
                  const totalDuration = expiry - start;
                  const elapsed = today - start;
                  progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                  daysLeft = calculateDaysLeft(expiryDate);
                  status = daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
                } else if (expiryDate) {
                  daysLeft = calculateDaysLeft(expiryDate);
                  status = daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
                  progress = daysLeft > 0 ? 0 : 100; // Simple progress for expiry only
                } else if (startDate) {
                  const start = startDate.toDate();
                  const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
                  status = `${daysSinceStart} days active`;
                  progress = 50; // Default progress for start date only
                }

                const isActive = activeTimelineItem === doc.id;
                return (
                  <div key={doc.id} className={`timeline-item ${isActive ? 'active-timeline-item' : ''}`} onClick={() => setActiveTimelineItem(doc.id)} style={{ cursor: 'pointer' }}>
                    <div
                      className={`timeline-dot ${isActive ? 'timeline-dot-active' : 'timeline-dot-inactive'}`}
                    ></div>
                    <div className="timeline-content">
                      <div className="timeline-item-title">{doc.name}</div>
                      <div className="timeline-item-desc">
                        {startDate && expiryDate ? `Valid from ${startDate.toDate().toLocaleDateString()} to ${expiryDate.toDate().toLocaleDateString()}` :
                         expiryDate ? `Expires on ${expiryDate.toDate().toLocaleDateString()}` :
                         `Started on ${startDate.toDate().toLocaleDateString()}`}
                      </div>
                      <div className="timeline-item-date">{status}</div>
                    </div>
                    <div className={`timeline-badge ${daysLeft !== null && daysLeft <= 30 ? 'urgent-badge' : 'days-badge'}`}>
                      {status}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-item-title">No Documents with Dates</div>
                  <div className="timeline-item-desc">Upload documents with start or expiry dates to see them here</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="footer-disclaimer">
          Voyloo provides guidance, not legal advice. For legal review, consult a licensed attorney. We connect you with verified immigration experts when needed.
        </div>
      </main>

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

      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Dashboard;
