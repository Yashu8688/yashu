import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider, useTheme } from './ThemeContext'

/* Icon Components */
const User = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Lock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Mail = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Phone = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Building = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BookOpen = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const Globe = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const Calendar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const Save = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

const Eye = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const X = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LogOut = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Sliders = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <circle cx="4" cy="17" r="1" />
    <circle cx="12" cy="10" r="1" />
    <circle cx="20" cy="19" r="1" />
  </svg>
);

const HelpCircle = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

const Info = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const Shield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const FileText = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="13" x2="8" y2="13" />
    <line x1="12" y1="17" x2="8" y2="17" />
  </svg>
);

const MessageSquare = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Camera = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ChevronRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const Star = ({ size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
    <polygon points="12 2 15.09 10.26 24 10.27 17.18 16.91 20.16 25.27 12 19.64 3.84 25.27 6.82 16.91 0 10.27 8.91 10.26 12 2" />
  </svg>
);

const Share2 = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const Languages = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 8a6 6 0 0 1 6-6c1 0 2 .18 2.97.52M9 19H8a6 6 0 0 1-6-6M15.8 5.2A6 6 0 0 1 21 11" />
    <path d="M2 12a10 10 0 1 1 20 0" />
  </svg>
);

const ArrowLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* Consolidated components */

function EditProfile({ onBack }) {
  const { styles } = useTheme()
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    visaType: 'F-1 (Student)',
    programLevel: '',
    country: 'India',
    arrivalDate: '',
    graduationMonth: '',
    graduationYear: ''
  })

  useEffect(() => {
    const fetchUserProfile = async (user) => {
      console.log('Fetching profile for user:', user)
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid, 'profile', 'info'))
        console.log('User doc exists:', userDoc.exists())
        if (userDoc.exists()) {
          const data = userDoc.data()
          console.log('Fetched data:', data)
          let graduationMonth = data.graduationMonth || ''
          let graduationYear = data.graduationYear || ''
          // Handle backward compatibility for graduationDate
          if (data.graduationDate && !graduationMonth && !graduationYear) {
            const [year, month] = data.graduationDate.split('-')
            graduationYear = year || ''
            graduationMonth = month || ''
          }
          const newProfileData = {
            fullName: data.fullName || user.displayName || '',
            email: user.email || '',
            phone: data.phone || '',
            university: data.university || '',
            major: data.major || '',
            visaType: data.visaType || 'F-1 (Student)',
            programLevel: data.programLevel || '',
            country: data.country || 'India',
            arrivalDate: data.arrivalDate || '',
            graduationMonth,
            graduationYear
          }
          console.log('Setting profile data:', newProfileData)
          setProfileData(newProfileData)
        } else {
          console.log('No profile doc found, using auth data')
          // If no profile doc, use auth data
          setProfileData({
            fullName: user.displayName || '',
            email: user.email || '',
            phone: '',
            university: '',
            major: '',
            visaType: 'F-1 (Student)',
            programLevel: '',
            country: 'India',
            arrivalDate: '',
            graduationMonth: '',
            graduationYear: ''
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user)
      } else {
        console.log('No user logged in')
        setProfileData({
          fullName: '',
          email: '',
          phone: '',
          university: '',
          major: '',
          visaType: 'F-1 (Student)',
          programLevel: '',
          country: 'India',
          arrivalDate: '',
          graduationMonth: '',
          graduationYear: ''
        })
      }
    })

    return unsubscribe
  }, [])

  const handleInputChange = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }))
  }

  const saveProfile = async () => {
    const user = auth.currentUser
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'profile', 'info'), profileData, { merge: true })
        alert('Profile updated successfully!')
      } catch (error) {
        console.error('Error saving profile:', error)
        alert('Error saving profile. Please try again.')
      }
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e6e6e6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Edit Profile</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Update your personal information</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '6rem', height: '6rem', borderRadius: '9999px', background: 'linear-gradient(135deg,#6366f1,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
            {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </div>
          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '2rem', height: '2rem', background: '#4f46e5', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={14} style={{ color: 'white' }} />
          </div>
        </div>
        <h2 style={{ marginTop: '0.75rem', fontWeight: '600', color: '#111827' }}>{profileData.fullName || 'User'}</h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{profileData.email}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { label: "Full Name", icon: <User size={16} />, key: 'fullName' },
          { label: "Email Address", icon: <Mail size={16} />, key: 'email' },
          { label: "Phone Number", icon: <Phone size={16} />, key: 'phone' },
          { label: "University", icon: <Building size={16} />, key: 'university' },
          { label: "Major / Field of Study", icon: <BookOpen size={16} />, key: 'major' }
        ].map((field, index) => (
          <div key={index}>
            <label style={{ fontSize: '0.875rem', color: '#111827', display: 'block', marginBottom: '0.25rem' }}>{field.label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
              <span style={{ color: '#9ca3af', marginRight: '0.5rem', display: 'inline-flex' }}>{field.icon}</span>
              <input
                value={profileData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        ))}

        <div>
          <label style={{ fontSize: '0.875rem', color: '#111827', display: 'block', marginBottom: '0.25rem' }}>Program Level</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
            <BookOpen size={16} style={{ color: '#9ca3af' }} />
            <input
              value={profileData.programLevel || ''}
              onChange={(e) => handleInputChange('programLevel', e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>Visa Type</label>
            <select value={profileData.visaType} onChange={(e) => handleInputChange('visaType', e.target.value)} style={{ marginTop: '0.25rem', width: '100%', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.75rem', fontSize: '0.875rem' }}>
              <option>F-1 (Student)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: '#111827', display: 'block', marginBottom: '0.25rem' }}>Country</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
              <Globe size={16} style={{ color: '#9ca3af' }} />
              <input value={profileData.country} onChange={(e) => handleInputChange('country', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', color: '#111827', display: 'block', marginBottom: '0.25rem' }}>Arrival Date</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
              <Calendar size={16} style={{ color: '#9ca3af' }} />
              <input value={profileData.arrivalDate} onChange={(e) => handleInputChange('arrivalDate', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', color: '#111827', display: 'block', marginBottom: '0.25rem' }}>Graduation Month</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
              <Calendar size={16} style={{ color: '#9ca3af' }} />
              <input value={profileData.graduationMonth} onChange={(e) => handleInputChange('graduationMonth', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.875rem', color: '#111827', display: 'block', marginBottom: '0.25rem' }}>Graduation Year</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
            <Calendar size={16} style={{ color: '#9ca3af' }} />
            <input value={profileData.graduationYear} onChange={(e) => handleInputChange('graduationYear', e.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem' }} />
          </div>
        </div>
      </div>

      <button onClick={saveProfile} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', width: '100%', background: '#4f46e5', color: '#fff', marginTop: '1.5rem' }}>
        <Save size={16} /> Save Profile
      </button>
    </div>
  )
}

function AccountSecurity({ onBack }) {
  const { styles } = useTheme()
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    setError('')
    setSuccess('')
  }

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const user = auth.currentUser
      if (!user) {
        setError('No user is currently signed in')
        return
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      await updatePassword(user, newPassword)

      setSuccess('Password updated successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error updating password:', error)
      if (error.code === 'auth/wrong-password') {
        setError('Current password is incorrect')
      } else if (error.code === 'auth/weak-password') {
        setError('New password is too weak')
      } else if (error.code === 'auth/requires-recent-login') {
        setError('Please sign in again to change your password')
      } else {
        setError('Failed to update password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Account Security</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Manage password and security</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '9999px', background: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={18} style={{ color: '#9333ea' }} />
        </div>
        <div>
          <p style={{ fontWeight: '500', color: '#111827' }}>Secure Your Account</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Use a strong password with at least 8 characters, including letters, numbers, and symbols.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#16a34a' }}>{success}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Current Password', key: 'currentPassword' },
          { label: 'New Password', key: 'newPassword' },
          { label: 'Confirm New Password', key: 'confirmPassword' }
        ].map((field, index) => (
          <div key={index}>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>{field.label}</label>
            <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.75rem' }}>
              <Lock size={16} style={{ color: '#9ca3af' }} />
              <input
                type="password"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={passwordData[field.key]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                style={{ width: '100%', outline: 'none', fontSize: '0.875rem', background: 'transparent' }}
              />
              <Eye size={16} style={{ color: '#9ca3af' }} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleChangePassword}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          background: loading ? '#9ca3af' : '#4f46e5',
          color: '#fff'
        }}
      >
        <Lock size={16} />
        {loading ? 'Updating...' : 'Change Password'}
      </button>

      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', borderTop: '1px solid #d1d5db' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontWeight: '500', color: '#111827' }}>Two-Factor Authentication</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Add extra security to your account</p>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', background: '#4f46e5', color: '#fff' }}>
          Enable
        </button>
      </div>
    </div>
  )
}

function Preferences({ onBack }) {
  const { styles } = useTheme()
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [news, setNews] = useState(true);
  const [reminders, setReminders] = useState(true);

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      style={{ width: '3rem', height: '1.75rem', borderRadius: '9999px', position: 'relative', display: 'inline-block', border: 'none', cursor: 'pointer', background: enabled ? '#4f46e5' : '#d1d5db' }}>
      <span style={{ position: 'absolute', top: '2px', left: '2px', width: '1.1rem', height: '1.1rem', borderRadius: '9999px', background: 'white', transition: 'transform 0.15s ease', transform: enabled ? 'translateX(1.25rem)' : 'translateX(0)' }} />
    </button>
  )

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Preferences</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Customize your experience</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Notifications</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[{
            title: 'Email Notifications',
            desc: 'Receive updates via email',
            value: email,
            set: setEmail
          },{
            title: 'Push Notifications',
            desc: 'Receive push notifications',
            value: push,
            set: setPush
          },{
            title: 'Immigration News Alerts',
            desc: 'Get notified about law changes',
            value: news,
            set: setNews
          },{
            title: 'Document Reminders',
            desc: 'Reminders for expiring documents',
            value: reminders,
            set: setReminders
          }].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <div>
                <p style={{ fontWeight: '500', color: '#111827' }}>{item.title}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.desc}</p>
              </div>
              <Toggle enabled={item.value} onChange={() => item.set(!item.value)} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Appearance</h2>

        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem' }}>Language</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '0.6rem' }}>
            <Languages size={16} style={{ color: '#9ca3af' }} />
            <select style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', color: '#111827' }}>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>

      <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', width: '100%', background: '#4f46e5', color: '#fff' }}>
        <Save size={16} /> Save Preferences
      </button>
    </div>
  )
}

function HelpSupport({ onBack }) {
  const { styles } = useTheme()
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Help & Support</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Get help and support</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', background: '#eff6ff', border: '1px solid #dbeafe', marginBottom: '1rem' }}>
        <HelpCircle style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb', marginTop: '0.125rem' }} />
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>Need Help?</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>We're here to assist you with any questions or issues.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#dbeafe' }}>
              <HelpCircle style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontWeight: '500' }}>FAQs</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Find answers to common questions</p>
            </div>
          </div>
          <ChevronRight style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', background: '#dbeafe' }}>
              <Mail style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontWeight: '500' }}>Contact Support</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email us at support@voyloo.com</p>
            </div>
          </div>
          <ChevronRight style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
        </div>
      </div>
    </div>
  )
}

function Feedback({ onBack }) {
  const { styles } = useTheme()
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const maxChars = 500;

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        rating,
        comment,
        timestamp: serverTimestamp()
      });
      alert('Thank you for your feedback!');
      setComment("");
      setRating(3);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = () => {
    if (rating <= 2) return 'Not great';
    if (rating === 3) return "It's okay";
    if (rating === 4) return 'Good';
    return 'Excellent';
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Feedback</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Share your thoughts</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', background: '#fffbeb', border: '1px solid #fef3c7', marginBottom: '1.5rem' }}>
        <MessageSquare style={{ width: '1.5rem', height: '1.5rem', color: '#d97706', marginTop: '0.125rem' }} />
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>Your Feedback Matters</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Help us improve by sharing your thoughts and experiences.</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Rate Your Experience</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
          {[1,2,3,4,5].map((star) => (
            <Star
              key={star}
              style={{ width: '1.75rem', height: '1.75rem', cursor: 'pointer', color: (hoverRating || rating) >= star ? '#facc15' : '#d1d5db', fill: (hoverRating || rating) >= star ? '#facc15' : 'none' }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>😊 {getRatingLabel()}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>Additional Comments</p>
        <textarea value={comment} onChange={(e) => setComment(e.target.value.slice(0, maxChars))} placeholder="Tell us what you think..." style={{ width: '100%', height: '6.5rem', padding: '0.6rem', borderRadius: '0.75rem', border: '2px solid #fef3c7', fontSize: '0.95rem' }} />
        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>{comment.length}/{maxChars} characters</div>
      </div>

      <button
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: loading ? '#9ca3af' : '#d97706',
          color: 'white',
          fontWeight: '500',
          padding: '0.75rem',
          borderRadius: '0.75rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        <MessageSquare style={{ width: '1rem', height: '1rem' }} />
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  )
}

function TermsOfService({ onBack }) {
  const { styles } = useTheme()
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Terms of Service</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Terms and conditions</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', background: '#ecfdf5', border: '1px solid #d1fae5', marginBottom: '1rem' }}>
        <FileText style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', marginTop: '0.125rem' }} />
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>Terms of Service</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Please read these terms carefully before using our service.</p>
        </div>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '1rem', height: '420px', overflowY: 'auto', fontSize: '0.875rem' }}>
        <h2 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Terms of Service</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Last updated: November 23, 2024</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#374151' }}>
          <div>
            <p style={{ fontWeight: '500' }}>1. Acceptance of Terms</p>
            <p>By accessing and using Voyloo Assistant, you accept and agree to be bound by these Terms of Service.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>2. Service Description</p>
            <p>Voyloo Assistant provides immigration tracking, document management, and informational resources. We do not provide legal advice.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>3. User Responsibilities</p>
            <p>You are responsible for maintaining accurate information, keeping your account secure, and complying with all applicable immigration laws.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>4. Prohibited Activities</p>
            <p>You may not use the service for illegal purposes, violate others' rights, or attempt to access unauthorized areas of the platform.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>5. Limitation of Liability</p>
            <p>Voyloo Assistant is provided "as is" without warranties. We are not liable for any damages arising from your use of the service.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrivacyPolicy({ onBack }) {
  const { styles } = useTheme()
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Privacy Policy</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>How we handle your data</p>
          </div>
        </div>
      </div>

      <div style={{ borderRadius: '0.75rem', padding: '1rem', border: '1px solid #eef2ff', background: '#f8fafc', marginBottom: '1rem' }}>
        <Shield style={{ width: '1.5rem', height: '1.5rem', color: '#f97316', marginTop: '0.125rem' }} />
        <div>
          <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>Your Privacy Matters</h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>We're committed to protecting your personal information and maintaining transparency.</p>
        </div>
      </div>

      <div style={{ borderRadius: '0.75rem', padding: '1rem', border: '1px solid #eef2ff', background: '#f8fafc', height: '420px', overflowY: 'auto' }}>
        <h2 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Privacy Policy</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Last updated: November 23, 2024</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#374151' }}>
          <div>
            <p style={{ fontWeight: '500' }}>1. Information We Collect</p>
            <p>We collect information you provide directly to us, including name, email, university details, visa information, and documents you upload.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>2. How We Use Your Information</p>
            <p>We use your information to provide immigration assistance, track visa timelines, send relevant updates, and improve our services.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>3. Data Security</p>
            <p>We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>4. Data Sharing</p>
            <p>We do not sell your personal information. We may share data with service providers who assist in our operations, under strict confidentiality agreements.</p>
          </div>

          <div>
            <p style={{ fontWeight: '500' }}>5. Your Rights</p>
            <p>You have the right to access, correct, delete, or export your data. Contact us to exercise these rights.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function About({ onBack }) {
  const { styles } = useTheme()
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #d1d5db' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} style={{ padding: '0.25rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} style={{ color: '#4b5563' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>About</h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>App information and version</p>
          </div>
        </div>
      </div>

      <div style={{ borderRadius: '0.75rem', padding: '1rem', border: '1px solid #eef2ff', background: '#f8fafc', textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>V</div>
        <h2 style={{ fontWeight: '600', fontSize: '1.125rem' }}>Voyloo Assistant</h2>
        <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>Immigration Journey Simplified</p>
        <span style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '9999px', background: 'white', border: '1px solid #d1d5db' }}>Version 1.0.0</span>
      </div>

      <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span style={{ color: '#6b7280' }}>Developer</span>
          <span style={{ fontWeight: '500' }}>Voyloo Inc.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span style={{ color: '#6b7280' }}>Release Date</span>
          <span style={{ fontWeight: '500' }}>November 2024</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span style={{ color: '#6b7280' }}>Last Updated</span>
          <span style={{ fontWeight: '500' }}>November 23, 2024</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span style={{ color: '#6b7280' }}>License</span>
          <span style={{ fontWeight: '500' }}>Proprietary</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', flex: 1, background: '#4f46e5', color: '#fff' }}><Star style={{ width: '1rem', height: '1rem' }} /> Rate Us</button>
        <button style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', flex: 1, background: '#e5e7eb', color: '#374151' }}><Share2 style={{ width: '1rem', height: '1rem' }} /> Share App</button>
      </div>
    </div>
  )
}

/* Main Settings Layout with Left Sidebar */

function SettingsLayout({ onBack }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('settings')

  const settings = [
    { title: 'Edit Profile', desc: 'Update your personal information', icon: <User size={18} />, bg: '#eef2ff', key: 'edit' },
    { title: 'Account Security', desc: 'Password and security settings', icon: <Lock size={18} />, bg: '#faf5ff', key: 'security' },
    { title: 'Preferences', desc: 'Notifications, theme, and language', icon: <Sliders size={18} />, bg: '#fdf2f8', key: 'preferences' },
    { title: 'Help & Support', desc: 'Get help and contact support', icon: <HelpCircle size={18} />, bg: '#eff6ff', key: 'help' },
    { title: 'About', desc: 'App version and information', icon: <Info size={18} />, bg: '#f0fdf4', key: 'about' },
    { title: 'Privacy Policy', desc: 'How we protect your data', icon: <Shield size={18} />, bg: '#fff7ed', key: 'privacy' },
    { title: 'Terms of Service', desc: 'Terms and conditions', icon: <FileText size={18} />, bg: '#f0fdfa', key: 'terms' },
    { title: 'Feedback', desc: 'Rate and share your experience', icon: <MessageSquare size={18} />, bg: '#fffbeb', key: 'feedback' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Close Button */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>Settings</h1>
        <button onClick={onBack} style={{ padding: '0.5rem', borderRadius: '9999px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={20} style={{ color: '#6b7280' }} />
        </button>
      </div>

      {/* Settings Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {active === 'edit' && <EditProfile onBack={() => setActive('settings')} />}
        {active === 'security' && <AccountSecurity onBack={() => setActive('settings')} />}
        {active === 'preferences' && <Preferences onBack={() => setActive('settings')} />}
        {active === 'help' && <HelpSupport onBack={() => setActive('settings')} />}
        {active === 'feedback' && <Feedback onBack={() => setActive('settings')} />}
        {active === 'terms' && <TermsOfService onBack={() => setActive('settings')} />}
        {active === 'privacy' && <PrivacyPolicy onBack={() => setActive('settings')} />}
        {active === 'about' && <About onBack={() => setActive('settings')} />}

        {/* Main Settings List */}
        {active === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {settings.map((item, index) => (
              <div key={index} onClick={() => setActive(item.key)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #d1d5db', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 2px rgba(15,23,42,0.03)', cursor: 'pointer', transition: 'box-shadow .12s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: '#111827' }}>{item.title}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.desc}</p>
                  </div>
                </div>
                <ChevronRight size={20} style={{ color: '#9ca3af' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Out Button */}
      {active === 'settings' && (
        <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', background: '#ffffff' }}>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', width: '100%', background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca' }}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Settings({ onBack }) {
  return (
    <ThemeProvider>
      <SettingsLayout onBack={onBack || (() => {})} />
    </ThemeProvider>
  )
}
