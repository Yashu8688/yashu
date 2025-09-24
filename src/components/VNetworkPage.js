import { useState } from 'react'
import './VNetworkPage.css'

// Mock data for the network page
const statsData = [
  {
    id: 1,
    icon: '👥',
    number: '342',
    label: 'Total Connections'
  },
  {
    id: 2,
    icon: '📈',
    number: '12',
    label: 'New This Week'
  },
  {
    id: 3,
    icon: '👁️',
    number: '89',
    label: 'Profile Views'
  },
  {
    id: 4,
    icon: '🔍',
    number: '156',
    label: 'Search Appearances'
  }
]

const connectionsData = [
  {
    id: 1,
    initials: 'SJ',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'San Francisco, CA',
    status: 'Works at Google • Has 12 mutual connections'
  },
  {
    id: 2,
    initials: 'MC',
    name: 'Michael Chen',
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Seattle, WA',
    status: 'Works at Microsoft • In your extended network'
  },
  {
    id: 3,
    initials: 'ER',
    name: 'Emily Rodriguez',
    title: 'UX Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    status: 'Similar background • Has 15 mutual connections'
  },
  {
    id: 4,
    initials: 'DK',
    name: 'David Kim',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Angeles, CA',
    status: 'Works at Netflix • Went to similar school'
  }
]

// Header Component
function Header() {
  return (
    <header className="network-header">
      <button className="back-button" aria-label="Go back">
        ← Back
      </button>
      <h1 className="network-title">My Network</h1>
      <button className="invite-button">
        <span>👥</span>
        Invite Connections
      </button>
    </header>
  )
}

// StatsCard Component
function StatsCard({ icon, number, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// SearchBar Component
function SearchBar() {
  return (
    <div className="search-section">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, company, or title"
          aria-label="Search connections"
        />
      </div>
    </div>
  )
}

// ConnectionCard Component
function ConnectionCard({ connection }) {
  return (
    <div className="connection-card">
      <div className="connection-avatar">
        {connection.initials}
      </div>
      <div className="connection-info">
        <h3 className="connection-name">{connection.name}</h3>
        <p className="connection-title">{connection.title} at {connection.company}</p>
        <p className="connection-location">📍 {connection.location}</p>
        <p className="connection-status">{connection.status}</p>
      </div>
      <div className="connection-actions">
        <button className="connect-button">
          <span>👥</span>
          Connect
        </button>
        <button className="view-profile-button">
          View Profile
        </button>
      </div>
    </div>
  )
}

// Main App Component
function VNetworkPage() {
  return (
    <div className="app">
      <Header />

      <div className="stats-container">
        {statsData.map(stat => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="main-content">
        <div className="connections-section">
          <div className="connections-container">
            {connectionsData.map(connection => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
          </div>
        </div>

        <SearchBar />
      </div>
    </div>
  )
}

export default VNetworkPage
