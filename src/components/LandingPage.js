import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        author: "Elena Rodriguez",
        role: "Portfolio Designer on Voyloo",
        time: "2h",
        content: newPost,
        image: "/demo-post.jpg",
        likes: 324,
        comments: 45,
        shares: 28,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  return (
    <div className="landing-page-ass">
      {/* Top Navigation */}
      <nav className="top-nav-ass">
        <div className="nav-logo-ass">
          <span className="logo-ass">V</span>
          <span>Voyloo</span>
        </div>
        <div className="nav-search-ass">
          <input
            type="text"
            placeholder="Search professionals, companies, jobs..."
          />
        </div>
      </nav>

      <div className="content-container-ass">
        {/* LEFT SIDEBAR */}
        <aside className="left-sidebar-ass">
          <ul className="menu-list-ass">
            <li>🏠 Home</li>
            <li onClick={() => navigate('/messages')} style={{ cursor: 'pointer' }}>💬 Messages</li>
            <li onClick={() => navigate('/portfolio-template-selector')} style={{ cursor: 'pointer' }}>🔔 Notifications</li>
            <li onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>👤 Profile</li>
            <li onClick={() => navigate('/jobs')} style={{ cursor: 'pointer' }}>💼 Jobs</li>
            <li onClick={() => navigate('/v-network')} style={{ cursor: 'pointer' }}>👥 V-Network</li>
            <hr />
            <li className="section-ass">PORTFOLIO</li>
            <li onClick={() => navigate('/portfolio-template-selector')} style={{ cursor: 'pointer' }}>➕ Create Portfolio</li>
            <li onClick={() => navigate('/portfolio-gallery')} style={{ cursor: 'pointer' }}>📄 View Portfolio</li>
            <li>🔖 Saved items</li>
            <li>👥 Groups</li>
            <li>📅 Events</li>
            <hr />
            <li>🏢 Settings & Privacy</li>
            <li>⭐ Help Center</li>
            <li className="sign-out-ass">🚪 Sign Out</li>
          </ul>
        </aside>

        {/* CENTER CONTENT */}
        <main className="center-content-ass">
          {/* Build Portfolio */}
          <div className="portfolio-container-ass">
            <h3>⚡ Build Your Portfolio ⚡</h3>
            <p>
              Stand out with Voyloo's signature portfolio templates - your key
              to career success
            </p>
            <div className="portfolio-options-ass">
              <button onClick={() => navigate('/portfolio-gallery')} style={{ cursor: 'pointer' }}>Voyloo Portfolio</button>
              <button onClick={() => navigate('/portfolio-gallery')} style={{ cursor: 'pointer' }}>ATS Friendly</button>
              <button onClick={() => navigate('/portfolio-gallery')} style={{ cursor: 'pointer' }}>Creative</button>
            </div>
            <div className="portfolio-actions-ass">
              <button className="create-btn-ass" onClick={() => navigate('/portfolio-template-selector')} style={{ cursor: 'pointer' }}>+ Create Portfolio</button>
              <button className="view-btn-ass" onClick={() => navigate('/portfolio-gallery')} style={{ cursor: 'pointer' }}>👁 View Portfolios</button>
            </div>
          </div>

          {/* Post Box */}
          <div className="post-box-ass">
            <div className="post-input-ass">
              <div className="avatar-ass">👤</div>
              <input
                type="text"
                placeholder="Start a post"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            <div className="post-actions-ass">
              <div className="video-button-ass" onClick={handlePostSubmit}>🎥Video</div>
              <div className="video-photo-ass" onClick={handlePostSubmit}>📷Photo</div>
              <div className="video-anonymous-ass" onClick={handlePostSubmit}>👁Anonymous posting</div>
            </div>
          </div>

          {/* Feed */}
          {posts.map((post) => (
            <div key={post.id} className="feed-post-ass">
              <div className="post-header-ass">
                <div className="post-avatar-ass">👩</div>
                <div>
                  <h4>{post.author}</h4>
                  <span>{post.role} • {post.time}</span>
                </div>
              </div>
              <p className="post-text-ass">{post.content}</p>
              {post.image && <img src={post.image} alt="post" />}
              <div className="post-footer-ass">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>🔄 {post.shares}</span>
              </div>
            </div>
          ))}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="right-sidebar-ass">
          {/* Suggestions */}
          <div className="suggestions-card-ass">
            <div className="card-header-ass">
              <h4>Voyloo Suggestions</h4>
              <span className="see-all-ass">See All</span>
            </div>
            <ul className="suggestions-list-ass">
              <li>
                <div className="suggestion-avatar-ass">👩</div>
                <div className="suggestion-info-ass">
                  <h5>Jennifer Liu <span className="verified-ass">✔️</span></h5>
                  <p>VP Engineering</p>
                  <span className="mutual-ass">12 mutual</span>
                </div>
                <button className="connect-btn-ass">Connect</button>
              </li>
              <li>
                <div className="suggestion-avatar-ass">👨</div>
                <div className="suggestion-info-ass">
                  <h5>David Kim</h5>
                  <p>Product Designer</p>
                  <span className="mutual-ass">8 mutual</span>
                </div>
                <button className="connect-btn-ass">Connect</button>
              </li>
              <li>
                <div className="suggestion-avatar-ass">👩</div>
                <div className="suggestion-info-ass">
                  <h5>Maria Sanchez</h5>
                  <p>Data Science Manager</p>
                  <span className="mutual-ass">15 mutual</span>
                </div>
                <button className="connect-btn-ass">Connect</button>
              </li>
              <li>
                <div className="suggestion-avatar-ass">👨</div>
                <div className="suggestion-info-ass">
                  <h5>Alex Johnson</h5>
                  <p>Senior SWE</p>
                  <span className="mutual-ass">6 mutual</span>
                </div>
                <button className="connect-btn-ass">Connect</button>
              </li>
            </ul>
          </div>

          {/* Portfolio Insights */}
          <div className="insights-card-ass">
            <h4>⚡ Portfolio Insights</h4>
            <div className="insights-main-ass">
              <h2>2.5x</h2>
              <p>More likely to get hired with <span className="highlight-ass">Voyloo Portfolio</span></p>
            </div>
            <div className="insights-stats-ass">
              <p>Profile Views <span className="up-ass">↑ 340%</span></p>
              <p>Job Offers <span className="up-ass">↑ 180%</span></p>
              <p>Network Connections <span className="up-ass">↑ 220%</span></p>
            </div>
            <button className="create-btn-ass" onClick={() => navigate('/portfolio-template-selector')} style={{ cursor: 'pointer' }}>+ Build Your Portfolio</button>
          </div>

          {/* Trending */}
          <div className="trending-card-ass">
            <h4>Trending on Voyloo</h4>
            <ul>
              <li>#VoylooLaunch <span>2.5k posts</span></li>
              <li>#PortfolioTips <span>1.8k posts</span></li>
              <li>#NetworkingMadeEasy <span>987 posts</span></li>
              <li>#VoylooSuccess <span>3.2k posts</span></li>
              <li>#ProfessionalGrowth <span>1.4k posts</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LandingPage;
