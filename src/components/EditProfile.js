import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basic-info');

  const sections = [
    { id: 'basic-info', label: 'Basic Info', icon: '👤' },
    { id: 'defining-moments', label: 'Defining Moments', icon: '💝' },
    { id: 'professional', label: 'Professional', icon: '🏢' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills-interests', label: 'Skills & Interests', icon: '⚙️' },
    { id: 'projects-publications', label: 'Projects & Publications', icon: '📁' },
    { id: 'volunteer-awards', label: 'Volunteer & Awards', icon: '🏆' },
    { id: 'contact-social', label: 'Contact & Social', icon: '📧' },
    { id: 'privacy-settings', label: 'Privacy Settings', icon: '🔒' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'basic-info':
        return <BasicInfo />;
      case 'defining-moments':
        return <DefiningMoments />;
      case 'professional':
        return <Professional />;
      case 'experience':
        return <Experience />;
      case 'education':
        return <Education />;
      case 'skills-interests':
        return <SkillsInterests />;
      case 'projects-publications':
        return <ProjectsPublications />;
      case 'volunteer-awards':
        return <VolunteerAwards />;
      case 'contact-social':
        return <ContactSocial />;
      case 'privacy-settings':
        return <PrivacySettings />;
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="edit-profile-container">
      {/* Header */}
      <header className="edit-profile-header">
        <button className="back-link" onClick={() => navigate('/profile')}>← Back</button>
        <h2>Edit Profile</h2>
        <div className="header-actions">
          <button className="view-analytics-btn">👁 View Analytics</button>
          <button className="save-btn">💾 Save Changes</button>
        </div>
      </header>

      <div className="edit-profile-content">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Basic Info Component
const BasicInfo = () => (
  <section className="section">
    <h3>👤 Basic Information</h3>
    <p>Update your basic personal information and profile photos.</p>

    {/* Profile Image + Banner */}
    <div className="profile-media">
      <div className="profile-banner">
        <p>Profile Banner Placeholder</p>
        <button className="camera-btn">📷</button>
      </div>
      <div className="profile-picture">
        <div className="profile-pic-placeholder">👤</div>
        <span className="username">@</span>
      </div>
    </div>

    {/* Basic Info Form */}
    <form className="basic-info-form">
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input type="text" name="firstName" placeholder="Enter your first name" />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input type="text" name="lastName" placeholder="Enter your last name" />
        </div>
      </div>

      <div className="form-group">
        <label>Username *</label>
        <input type="text" name="username" placeholder="Choose your username" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="Enter your phone number" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob" />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender">
            <option>Select your gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      <button type="submit" className="save-profile-btn">Save Profile Changes</button>
    </form>
  </section>
);

// Defining Moments Component
const DefiningMoments = () => (
  <section className="section">
    <h3>💝 3 Defining Moments</h3>
    <p>Share three pivotal moments that have shaped your professional journey and personal growth.</p>

    <form className="defining-moments-form">
      <div className="moment-group">
        <label>Defining Moment #1</label>
        <textarea
          name="moment1"
          rows="4"
          placeholder="Share a pivotal moment in your journey... (e.g., The moment you decided to pursue your career path)"
        ></textarea>
        <p className="char-count">0/500 characters</p>
      </div>

      <div className="moment-group">
        <label>Defining Moment #2</label>
        <textarea
          name="moment2"
          rows="4"
          placeholder="Share a pivotal moment in your journey... (e.g., A challenge that transformed your perspective)"
        ></textarea>
        <p className="char-count">0/500 characters</p>
      </div>

      <div className="moment-group">
        <label>Defining Moment #3</label>
        <textarea
          name="moment3"
          rows="4"
          placeholder="Share a pivotal moment in your journey... (e.g., An achievement that defined your values)"
        ></textarea>
        <p className="char-count">0/500 characters</p>
      </div>

      <div className="tips-section">
        <h4>💡 Tips for compelling defining moments:</h4>
        <ul>
          <li>Focus on moments of growth, learning, or transformation</li>
          <li>Include both challenges overcome and successes achieved</li>
          <li>Explain how these moments shaped your current perspective</li>
          <li>Keep each moment authentic and personally meaningful</li>
        </ul>
      </div>
    </form>
  </section>
);

// Professional Component
const Professional = () => (
  <section className="section">
    <h3>🏢 Professional Information</h3>
    <p>Tell us about your professional background and current role.</p>

    <form className="professional-form">
      <div className="form-group">
        <label>Professional Headline</label>
        <input type="text" name="headline" placeholder="e.g., Senior Software Engineer passionate about AI and Machine Learning" />
      </div>

      <div className="form-group">
        <label>Professional Bio</label>
        <textarea name="bio" rows="4" placeholder="Tell your professional story in a few sentences..."></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" placeholder="e.g., San Francisco, CA" />
        </div>
        <div className="form-group">
          <label>Industry</label>
          <select name="industry">
            <option>Select your industry</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Marketing & Advertising</option>
            <option>Consulting</option>
            <option>Retail</option>
            <option>Manufacturing</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Current Role</label>
          <input type="text" name="role" placeholder="e.g., Senior Software Engineer" />
        </div>
        <div className="form-group">
          <label>Current Company</label>
          <input type="text" name="company" placeholder="e.g., Microsoft" />
        </div>
      </div>

      <div className="form-group">
        <label>Years of Experience</label>
        <select name="experience">
          <option>Select your experience level</option>
          <option>0-1 years</option>
          <option>2-5 years</option>
          <option>6-10 years</option>
          <option>11-15 years</option>
          <option>15+ years</option>
        </select>
      </div>
    </form>
  </section>
);

// Experience Component
const Experience = () => (
  <section className="section">
    <h3>💼 Experience</h3>
    <p>This section is under development. Full functionality will be available soon.</p>
    <div className="coming-soon">
      <div className="coming-soon-icon">⚙️</div>
      <h4>Coming Soon</h4>
      <p>This section will allow you to manage your experience information.</p>
    </div>
  </section>
);

// Education Component
const Education = () => (
  <section className="section">
    <h3>🎓 Education</h3>
    <p>This section is under development. Full functionality will be available soon.</p>
    <div className="coming-soon">
      <div className="coming-soon-icon">⚙️</div>
      <h4>Coming Soon</h4>
      <p>This section will allow you to manage your education information.</p>
    </div>
  </section>
);

// Skills & Interests Component
const SkillsInterests = () => (
  <section className="section">
    <h3>⚙️ Skills & Interests</h3>
    <p>Highlight your professional skills, personal interests, and languages.</p>

    <form className="skills-form">
      <div className="skills-group">
        <h4>Professional Skills</h4>
        <div className="input-with-button">
          <input type="text" name="skill" placeholder="Add a skill..." />
          <button type="button" className="add-btn">+</button>
        </div>
      </div>

      <div className="skills-group">
        <h4>Personal Interests</h4>
        <div className="input-with-button">
          <input type="text" name="interest" placeholder="Add an interest..." />
          <button type="button" className="add-btn">+</button>
        </div>
      </div>

      <div className="skills-group">
        <h4>Languages</h4>
        <div className="input-with-button">
          <input type="text" name="language" placeholder="Add a language..." />
          <button type="button" className="add-btn">+</button>
        </div>
      </div>
    </form>
  </section>
);

// Projects & Publications Component
const ProjectsPublications = () => (
  <section className="section">
    <h3>📁 Projects & Publications</h3>
    <p>This section is under development. Full functionality will be available soon.</p>
    <div className="coming-soon">
      <div className="coming-soon-icon">⚙️</div>
      <h4>Coming Soon</h4>
      <p>This section will allow you to manage your project information.</p>
    </div>
  </section>
);

// Volunteer & Awards Component
const VolunteerAwards = () => (
  <section className="section">
    <h3>🏆 Volunteer & Awards</h3>
    <p>This section is under development. Full functionality will be available soon.</p>
    <div className="coming-soon">
      <div className="coming-soon-icon">⚙️</div>
      <h4>Coming Soon</h4>
      <p>This section will allow you to manage your Volunteer information.</p>
    </div>
  </section>
);

// Contact & Social Component
const ContactSocial = () => (
  <section className="section">
    <h3>📧 Contact & Social Links</h3>
    <p>Add your website and social media profiles to help others connect with you.</p>

    <form className="contact-form">
      <div className="form-group">
        <label>Personal Website</label>
        <input type="url" name="website" placeholder="https://yourwebsite.com" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>LinkedIn</label>
          <input type="url" name="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
        </div>
        <div className="form-group">
          <label>Twitter</label>
          <input type="url" name="twitter" placeholder="https://twitter.com/yourusername" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>GitHub</label>
          <input type="url" name="github" placeholder="https://github.com/yourusername" />
        </div>
        <div className="form-group">
          <label>Instagram</label>
          <input type="url" name="instagram" placeholder="https://instagram.com/yourusername" />
        </div>
      </div>
    </form>
  </section>
);

// Privacy Settings Component
const PrivacySettings = () => (
  <section className="section">
    <h3>🔒 Privacy Settings</h3>
    <p>Control who can see your profile and contact information.</p>

    <form className="privacy-form">
      <div className="privacy-option">
        <div className="privacy-info">
          <label>Public Profile</label>
          <small>Make your profile visible to everyone</small>
        </div>
        <label className="toggle">
          <input type="checkbox" name="publicProfile" />
          <span className="slider"></span>
        </label>
      </div>

      <div className="privacy-option">
        <div className="privacy-info">
          <label>Show Email Address</label>
          <small>Display your email on your profile</small>
        </div>
        <label className="toggle">
          <input type="checkbox" name="showEmail" />
          <span className="slider"></span>
        </label>
      </div>

      <div className="privacy-option">
        <div className="privacy-info">
          <label>Show Phone Number</label>
          <small>Display your phone number on your profile</small>
        </div>
        <label className="toggle">
          <input type="checkbox" name="showPhone" />
          <span className="slider"></span>
        </label>
      </div>

      <div className="privacy-option">
        <div className="privacy-info">
          <label>Allow Messages</label>
          <small>Let others send you direct messages</small>
        </div>
        <label className="toggle">
          <input type="checkbox" name="allowMessages" />
          <span className="slider"></span>
        </label>
      </div>

      <div className="privacy-option">
        <div className="privacy-info">
          <label>Allow Connection Requests</label>
          <small>Let others send you connection requests</small>
        </div>
        <label className="toggle">
          <input type="checkbox" name="allowConnections" />
          <span className="slider"></span>
        </label>
      </div>
    </form>
  </section>
);

export default EditProfile;
