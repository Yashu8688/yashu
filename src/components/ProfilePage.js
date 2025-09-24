import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      {/* Left Sidebar */}
      <aside className="profile-left-sidebar">
        <div className="profile-card">
          <div className="profile-banner"></div>
          <div className="profile-avatar">👤</div>
          <h2>Yashwanth Kumba</h2>
          <p className="profile-role">Student</p>
          <p className="profile-headline">Add your own headline</p>
          <button className="edit-profile-btn" onClick={() => navigate('/editprofile')} style={{ cursor: 'pointer' }}>Edit Profile</button>
          <hr />
          <div className="connections-followers">
            <div onClick={() => navigate('/connectionanalytics')} style={{ cursor: 'pointer' }}>
              <span className="count">71</span>
              <span>Connections</span>
            </div>
            <div onClick={() => navigate('/connectionanalytics')} style={{ cursor: 'pointer' }}>
              <span className="count">163</span>
              <span>Followers</span>
            </div>
          </div>
          <div className="analysis-portfolio">
            <div onClick={() => navigate('/connectionanalytics')} style={{ cursor: 'pointer' }}>
              <span className="count">127</span>
              <span>Analysis</span>
            </div>
            <div onClick={() => navigate('/portfoliostyleselector')} style={{ cursor: 'pointer' }}>
              <span className="count">48</span>
              <span>Portfolio</span>
            </div>
          </div>
          <hr />
          <div className="profile-strength">
            <div className="strength-label">
              <span>Profile Strength</span>
              <span>18%</span>
            </div>
            <div className="strength-bar">
              <div className="strength-progress" style={{ width: "18%" }}></div>
            </div>
            <p>Complete your profile to increase visibility</p>
          </div>
          <hr />
          <button className="get-verified-btn">Get Verified</button>
          <button className="add-certificate-btn">Add Certificate</button>
        </div>
      </aside>

      {/* Middle Content */}
      <main className="profile-middle-content">
        <div className="build-portfolio-card">
          <div className="header">
            <h3>Build Your Portfolio</h3>
            <div className="actions">
              <button className="start-building-btn" onClick={() => navigate('/portfolio-template-selector')} style={{ cursor: 'pointer' }}>+ Start Building</button>
              <button className="view-portfolios-btn">View Portfolios</button>
            </div>
          </div>
          <p>Showcase your work and stand out to employers</p>
          <div className="portfolio-types">
            <div className="portfolio-type">
              <h4>Voyloo Portfolio</h4>
              <p>Our signature design optimized for maximum professional impact</p>
            </div>
            <div className="portfolio-type">
              <h4>ATS Friendly Portfolio</h4>
              <p>Optimized for Applicant Tracking Systems and executive review</p>
            </div>
            <div className="portfolio-type">
              <h4>Creative Portfolio</h4>
              <p>Bold and artistic showcase for creative professionals</p>
            </div>
          </div>
          <div className="portfolio-benefits">
            <p>Portfolio Benefits</p>
            <p>5x more likely to get hired with a portfolio</p>
            <div className="benefit-tags">
              <span>Professional</span>
              <span>Targeted</span>
              <span>Impressive</span>
            </div>
          </div>
        </div>

        <div className="defining-moments-card">
          <div className="header">
            <h4>3 Defining Moments</h4>
            <button className="edit-btn">Edit</button>
          </div>
          <ol className="moments-list">
            <li>Add your first defining moment...</li>
            <li>Add your second defining moment...</li>
            <li>Add your third defining moment...</li>
          </ol>
        </div>

        <div className="activity-card">
          <div className="header">
            <h4>Activity</h4>
            <button className="view-all-btn" onClick={() => navigate('/professionalactivity')} style={{ cursor: 'pointer' }}>View All</button>
          </div>
          <div className="activity-item">
            <div className="avatar">👤</div>
            <div className="activity-content">
              <h5>Yashwanth Kumba <span>2 days ago</span></h5>
              <p>
                Excited to share that I've completed my portfolio! Thanks to everyone who supported me on this journey.
              </p>
              <div className="activity-actions">
                <span>❤️ 15</span>
                <span>💬 3</span>
                <span>🔄 Share</span>
              </div>
            </div>
          </div>
          <div className="activity-item">
            <div className="avatar">👤</div>
            <div className="activity-content">
              <h5>Yashwanth Kumba <span>1 week ago</span></h5>
              <p>
                Just finished an amazing online course on Advanced React. The learning never stops! 🚀
              </p>
              <div className="activity-actions">
                <span>❤️ 23</span>
                <span>💬 7</span>
                <span>🔄 Share</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="profile-right-sidebar">
        <div className="voyloo-suggestions-card">
          <h4>Voyloo Suggestions</h4>
          <ul>
            <li>
              <div className="avatar">👩</div>
              <div className="info">
                <h5>Sarah Johnson</h5>
                <p>Product Manager</p>
                <span>3 mutual connections</span>
              </div>
              <button className="connect-btn">Connect</button>
            </li>
            <li>
              <div className="avatar">👨</div>
              <div className="info">
                <h5>Mike Chen</h5>
                <p>UX Designer</p>
                <span>1 mutual connection</span>
              </div>
              <button className="connect-btn">Connect</button>
            </li>
            <li>
              <div className="avatar">👩</div>
              <div className="info">
                <h5>Emma Davis</h5>
                <p>Marketing Lead</p>
                <span>5 mutual connections</span>
              </div>
              <button className="connect-btn">Connect</button>
            </li>
          </ul>
        </div>

        <div className="recent-activity-card">
          <h4>Recent Activity</h4>
          <ul>
            <li>
              <span className="blue-dot"></span>
              <p><strong>John Smith</strong> viewed your profile <br /><small>2 hours ago</small></p>
            </li>
            <li>
              <span className="blue-dot"></span>
              <p><strong>Lisa Wang</strong> sent you a connection request <br /><small>1 day ago</small></p>
            </li>
            <li>
              <span className="blue-dot"></span>
              <p><strong>Alex Rodriguez</strong> liked your portfolio <br /><small>3 days ago</small></p>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default ProfilePage;
