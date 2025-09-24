import React from 'react';
import './ConnectionsAnalytics.css'; // Make sure this CSS file is correctly linked

// A simple component for a person icon. You can also use an icon library like react-feather.
const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const ConnectionsAnalytics = () => {
    return (
        <div className="analytics-container">
            <header className="analytics-header">
                <div className="analytics-header-content">
                    <a href="#" className="back-link">← Back</a>
                    <div className="title-wrapper">
                        <PersonIcon />
                        <h1 className="header-title">Connections Analytics</h1>
                    </div>
                </div>
            </header>

            <main className="analytics-main">
                {/* Metrics Section */}
                <section className="metrics-section">
                    <div className="metric-card">
                        <div className="metric-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            <h2>Total Connections</h2>
                        </div>
                        <p className="metric-value">342</p>
                    </div>
                    <div className="metric-card">
                        <div className="metric-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                            <h2>New This Week</h2>
                        </div>
                        <p className="metric-value">12</p>
                    </div>
                    <div className="metric-card">
                        <div className="metric-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <h2>Pending Requests</h2>
                        </div>
                        <p className="metric-value">8</p>
                    </div>
                    <div className="metric-card">
                        <div className="metric-header">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-ccw"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                            <h2>Mutual Connections</h2>
                        </div>
                        <p className="metric-value">156</p>
                    </div>
                </section>

                {/* Charts and Lists Section */}
                <section className="charts-and-lists-section">
                    <div className="chart-panel">
                        <h2 className="panel-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                            Connection Growth
                        </h2>
                        <ul className="growth-list">
                            <li className="growth-item">
                                <span className="month">Jan</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '28.85%' }}></div>
                                </div>
                                <span className="count">45</span>
                            </li>
                            <li className="growth-item">
                                <span className="month">Feb</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '42.95%' }}></div>
                                </div>
                                <span className="count">67</span>
                            </li>
                            <li className="growth-item">
                                <span className="month">Mar</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '57.05%' }}></div>
                                </div>
                                <span className="count">89</span>
                            </li>
                            <li className="growth-item">
                                <span className="month">Apr</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '71.79%' }}></div>
                                </div>
                                <span className="count">112</span>
                            </li>
                            <li className="growth-item">
                                <span className="month">May</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '85.9%' }}></div>
                                </div>
                                <span className="count">134</span>
                            </li>
                            <li className="growth-item">
                                <span className="month">Jun</span>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: '100%' }}></div>
                                </div>
                                <span className="count">156</span>
                            </li>
                        </ul>
                    </div>

                    <div className="list-panel">
                        <h2 className="panel-title">Recent Connections</h2>
                        <ul className="connections-list">
                            <li className="connection-item">
                                <div className="connection-avatar">
                                    <PersonIcon />
                                </div>
                                <div className="connection-details">
                                    <span className="connection-name">Alex Thompson</span>
                                    <p className="connection-title">Software Engineer at Google</p>
                                    <p className="connection-meta">5 mutual • 2 days ago</p>
                                </div>
                            </li>
                            <li className="connection-item">
                                <div className="connection-avatar">
                                    <PersonIcon />
                                </div>
                                <div className="connection-details">
                                    <span className="connection-name">Sarah Davis</span>
                                    <p className="connection-title">Product Manager at Microsoft</p>
                                    <p className="connection-meta">12 mutual • 3 days ago</p>
                                </div>
                            </li>
                            <li className="connection-item">
                                <div className="connection-avatar">
                                    <PersonIcon />
                                </div>
                                <div className="connection-details">
                                    <span className="connection-name">Mike Johnson</span>
                                    <p className="connection-title">UX Designer at Apple</p>
                                    <p className="connection-meta">8 mutual • 5 days ago</p>
                                </div>
                            </li>
                            <li className="connection-item">
                                <div className="connection-avatar">
                                    <PersonIcon />
                                </div>
                                <div className="connection-details">
                                    <span className="connection-name">Emily Chen</span>
                                    <p className="connection-title">Data Scientist at Amazon</p>
                                    <p className="connection-meta">15 mutual • 1 week ago</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Connections by Industry Section */}
                <section className="industry-section">
                    <div className="chart-panel">
                        <h2 className="panel-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-briefcase"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            Connections by Industry
                        </h2>
                        <ul className="industry-list">
                            <li className="industry-item">
                                <span className="industry-name">Technology</span>
                                <span className="industry-percentage">38%</span>
                                <span className="industry-count">123</span>
                            </li>
                            <li className="industry-item">
                                <span className="industry-name">Finance</span>
                                <span className="industry-percentage">20%</span>
                                <span className="industry-count">67</span>
                            </li>
                            <li className="industry-item">
                                <span className="industry-name">Healthcare</span>
                                <span className="industry-percentage">13%</span>
                                <span className="industry-count">45</span>
                            </li>
                            <li className="industry-item">
                                <span className="industry-name">Education</span>
                                <span className="industry-percentage">10%</span>
                                <span className="industry-count">34</span>
                            </li>
                            <li className="industry-item">
                                <span className="industry-name">Other</span>
                                <span className="industry-percentage">21%</span>
                                <span className="industry-count">73</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ConnectionsAnalytics;