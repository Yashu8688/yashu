import React from 'react';
import './MessagePage.css';

const MessagePage = () => {
  return (
    <div className="message-page">
      <div className="header">
        <div className="back">&larr; Back</div>
        <div className="title">Messages</div>
        <div className="settings">⚙ Settings</div>
      </div>

      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="search-box">
            <input type="text" placeholder="Search conversations..." />
          </div>

          <div className="message">
            <div className="avatar">SJ<div className="online"></div></div>
            <div className="details">
              <div className="name">Sarah Johnson <span className="time">2 min ago</span></div>
              <div className="role">Senior Software Engineer at Google</div>
              <div className="text">Thanks for connecting! I'd love to discuss the ...</div>
            </div>
          </div>

          <div className="message">
            <div className="avatar">MC</div>
            <div className="details">
              <div className="name">Mike Chen <span className="time">1 hour ago</span></div>
              <div className="role">Product Manager at Microsoft</div>
              <div className="text">Great portfolio! Would you be interested in a f...</div>
            </div>
          </div>

          <div className="message">
            <div className="avatar">ED<div className="online"></div></div>
            <div className="details">
              <div className="name">Emma Davis <span className="time">3 hours ago</span></div>
              <div className="role">UX Designer at Apple</div>
              <div className="text">See you at the networking event tomorrow!</div>
            </div>
          </div>

          <div className="message">
            <div className="avatar">AR</div>
            <div className="details">
              <div className="name">Alex Rodriguez <span className="time">1 day ago</span></div>
              <div className="role">Data Scientist at Netflix</div>
              <div className="text">Your recent post about React was really insightful.</div>
            </div>
          </div>

          <div className="message">
            <div className="avatar">LW<div className="online"></div></div>
            <div className="details">
              <div className="name">Lisa Wang <span className="time">2 days ago</span></div>
              <div className="role">Marketing Director at Shopify</div>
              <div className="text">The networking event was great! Let's collabora...</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <p>
            📩 <br /><br />
            <strong>Select a conversation</strong><br />
            Choose a conversation from the list to start messaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
