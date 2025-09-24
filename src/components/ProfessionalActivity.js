import React from 'react';
import {
  FiArrowLeft,
  FiEye,
  FiThumbsUp,
  FiMessageCircle,
  FiUser,
  FiCamera,
  FiVideo,
  FiLink,
  FiSend,
  FiMoreHorizontal,
  FiClock,
  FiGlobe,
  FiShare2,
  FiBookmark,
} from 'react-icons/fi';
import { MdOutlineArticle } from 'react-icons/md';
import './ProfessionalActivity.css';

const statsData = [
  { id: 1, icon: <FiEye />, label: 'Post Views', value: '2.4K' },
  { id: 2, icon: <FiThumbsUp />, label: 'Likes Received', value: '387' },
  { id: 3, icon: <FiMessageCircle />, label: 'Comments', value: '94' },
  { id: 4, icon: <FiUser />, label: 'Connections', value: '342' },
];

const postsData = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      connection: '1st',
      title: 'Senior Product Manager at TechCorp',
      time: '2 hours ago',
      avatar: null,
    },
    content:
      'Excited to share that our team just launched a new feature that will help thousands of users streamline their workflow! The journey from concept to launch took 6 months of hard work and collaboration. Thank you to everyone who made this possible! 🚀',
    reactions: { likes: 127, comments: 23, shares: 8 },
  },
  {
    id: 2,
    user: {
      name: 'David Kim',
      connection: '1st',
      title: 'AI Research Scientist at Innovation Labs',
      time: '4 hours ago',
      avatar: null,
    },
    content:
      "Just published a new article on the future of AI in healthcare. After 2 years of research, we're seeing incredible potential for early disease detection using machine learning algorithms.",
    article: {
      title: 'AI-Powered Healthcare: The Next Frontier',
      description:
        'Exploring how artificial intelligence is revolutionizing medical diagnosis and patient care...',
    },
    reactions: { likes: 89, comments: 12, shares: 15 },
    comments: [
      {
        id: 1,
        user: 'Alex Thompson',
        time: '1 hour ago',
        text: 'Congratulations! This looks amazing!',
      },
      {
        id: 2,
        user: 'Mike Chen',
        time: '45 minutes ago',
        text: "Can't wait to try this out. Great work team!",
      },
    ],
  },
  {
    id: 3,
    user: {
      name: 'Emma Wilson',
      connection: '1st',
      title: 'UX Designer',
      time: '6 hours ago',
      avatar: null,
    },
    content:
      "🎉 Celebrating 5 years at DesignStudio! From junior designer to leading a team of 12 talented individuals. Grateful for this journey and excited for what's ahead!",
    badge: { text: '5 Year Work Anniversary', color: 'purple' },
    reactions: { likes: 156, comments: 31, shares: 4 },
  },
  {
    id: 4,
    user: {
      name: 'John Martinez',
      connection: '1st',
      title: 'Full Stack Developer',
      time: '1 day ago',
      avatar: null,
    },
    content:
      'Just earned my AWS Solutions Architect certification! 3 months of studying nights and weekends, but totally worth it. Next up: preparing for the Professional level.',
    badge: { text: 'AWS Certified Solutions Architect', color: 'orange' },
    reactions: { likes: 78, comments: 19, shares: 6 },
  },
  {
    id: 5,
    user: {
      name: 'Lisa Chen',
      connection: '1st',
      title: 'Data Scientist at Analytics Pro',
      time: '2 days ago',
      avatar: null,
    },
    content:
      "Thrilled to announce that I'm starting a new position as Senior Data Scientist at Analytics Pro! Looking forward to working on cutting-edge projects in the fintech space.",
    jobChange: 'DataTech Solutions → Analytics Pro',
    reactions: { likes: 203, comments: 47, shares: 12 },
  },
];

const IconBadge = ({ color }) => {
  // Return different icons based on color for badges
  switch (color) {
    case 'purple':
      return <FiUser className="badge-icon" />;
    case 'orange':
      return <FiUser className="badge-icon" />;
    default:
      return <FiUser className="badge-icon" />;
  }
};

const StatsCard = ({ icon, label, value }) => (
  <div className="stats-card">
    <div className="stats-icon">{icon}</div>
    <div className="stats-info">
      <p className="stats-label">{label}</p>
      <p className="stats-value">{value}</p>
    </div>
  </div>
);

const PostInput = () => (
  <div className="post-input-container">
    <div className="post-input-avatar">
      <FiUser size={32} />
    </div>
    <textarea
      className="post-textarea"
      placeholder="Share your professional thoughts and achievements..."
    />
    <div className="post-input-actions">
      <button className="post-action-btn">
        <FiCamera /> Photo
      </button>
      <button className="post-action-btn">
        <FiVideo /> Video
      </button>
      <button className="post-action-btn">
        <FiLink /> Article
      </button>
      <button className="post-submit-btn">
        <FiSend /> Post
      </button>
    </div>
  </div>
);

const Comment = ({ user, time, text }) => (
  <div className="comment">
    <div className="comment-avatar">
      <FiUser />
    </div>
    <div className="comment-content">
      <p className="comment-user">{user}</p>
      <p className="comment-time">{time}</p>
      <p className="comment-text">{text}</p>
    </div>
  </div>
);

const Post = ({
  user,
  content,
  article,
  badge,
  jobChange,
  reactions,
  comments,
}) => (
  <div className="post">
    <div className="post-header">
      <div className="post-user-avatar">
        <FiUser size={40} />
      </div>
      <div className="post-user-info">
        <h2 className="post-user-name">
          {user.name} <span className="connection-badge">{user.connection}</span>{' '}
          {badge && (
            <span
              className={`badge badge-${badge.color}`}
              title={badge.text}
            >
              <FiUser className="badge-icon" /> {badge.text}
            </span>
          )}
          {!badge && article && (
            <span className="badge badge-article" title="Article">
              <MdOutlineArticle className="badge-icon" />
            </span>
          )}
        </h2>
        <p className="post-user-title">{user.title}</p>
        <div className="post-meta">
          <FiClock className="post-meta-icon" />
          <span>{user.time}</span>
          <FiGlobe className="post-meta-icon" />
        </div>
      </div>
      <div className="post-options">
        <FiMoreHorizontal />
      </div>
    </div>
    <div className="post-content">
      <p>{content}</p>
      {article && (
        <div className="post-article">
          <h3>{article.title}</h3>
          <p>{article.description}</p>
        </div>
      )}
      {jobChange && <div className="post-job-change">{jobChange}</div>}
    </div>
    <hr />
    <div className="post-reactions">
      <button className="reaction-btn">
        <FiThumbsUp /> {reactions.likes}
      </button>
      <button className="reaction-btn">
        <FiMessageCircle /> {reactions.comments}
      </button>
      <button className="reaction-btn">
        <FiShare2 /> {reactions.shares}
      </button>
      <button className="bookmark-btn">
        <FiBookmark />
      </button>
    </div>
    {comments && (
      <div className="post-comments">
        <p className="view-comments">View all {reactions.comments} comments</p>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            user={comment.user}
            time={comment.time}
            text={comment.text}
          />
        ))}
      </div>
    )}
  </div>
);

const ProfessionalActivity = () => {
  return (
    <div className="professional-activity">
      <header className="header">
        <button className="back-btn">
          <FiArrowLeft /> Back
        </button>
        <h1 className="title">
          <FiEye className="title-icon" /> Professional Activity
        </h1>
      </header>

      <section className="stats-section">
        {statsData.map(({ id, icon, label, value }) => (
          <StatsCard key={id} icon={icon} label={label} value={value} />
        ))}
      </section>

      <section className="post-input-section">
        <PostInput />
      </section>

      <section className="posts-section">
        {postsData.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </section>

      <div className="load-more-container">
        <button className="load-more-btn">Load More Activities</button>
      </div>
    </div>
  );
};

export default ProfessionalActivity;
