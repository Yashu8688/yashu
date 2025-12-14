
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [visaType, setVisaType] = useState("");
  const [programLevel, setProgramLevel] = useState("");
  const [major, setMajor] = useState("");
  const [graduationMonth, setGraduationMonth] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  const validateEmail = (email) => {
    return email.endsWith(".edu") || email.endsWith(".edu.in") || email.endsWith("@gmail.com");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordSuccess(false);

    if (!validateEmail(forgotPasswordEmail)) {
        setForgotPasswordError("Please enter a valid .edu, .edu.in, or Gmail email address");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, forgotPasswordEmail);
        setForgotPasswordSuccess(true);
    } catch (err) {
        setForgotPasswordError(err.message || "Failed to send password reset email");
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setSuccessMessage("A new verification email has been sent.");
      setError("");
    } catch (err) {
      setError("Failed to resend verification email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Only .edu, .edu.in, or Gmail email addresses are accepted");
      setLoading(false);
      return;
    }

    if (isRegisterMode) {
      if (!firstName || !lastName) {
        setError("First name and last name are required");
        setLoading(false);
        return;
      }
      if (!universityName) {
        setError("University name is required");
        setLoading(false);
        return;
      }
      if (!visaType) {
        setError("Please select a visa type");
        setLoading(false);
        return;
      }
      if (!programLevel) {
        setError("Please select a program level");
        setLoading(false);
        return;
      }
      if (!major) {
        setError("Major/Field of Study is required");
        setLoading(false);
        return;
      }
      if (!graduationMonth || !graduationYear) {
        setError("Expected graduation date is required");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        await setDoc(doc(db, 'users', userCred.user.uid), {
            firstName,
            lastName,
            universityName,
            visaType,
            programLevel,
            major,
            graduationMonth,
            graduationYear,
            email,
            createdAt: new Date(),
          });
        
        setLoading(false);
        setSuccessMessage("Verification sent to mail");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setUniversityName("");
        setVisaType("");
        setProgramLevel("");
        setMajor("");
        setGraduationMonth("");
        setGraduationYear("");
        setIsRegisterMode(false);
      } catch (err) {
        setError(err.message || 'Registration failed');
        setLoading(false);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user.emailVerified) {
            setLoading(false);
            navigate('/dashboard');
        } else {
            setError("Please verify your email to login.");
            setLoading(false);
        }
      } catch (err) {
        setError(err.message || "Login failed");
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError("");
    setSuccessMessage("");
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo-circle">V</div>
        <h1 className="brand-name">Voyloo</h1>
        <p className="brand-tagline">Immigration Journey Simplified</p>
      </header>

      <main className="card-wrapper">
        <div className="login-card">
          <div className="secure-badge">
            <span className="secure-icon">🛡️</span>
            <span>Secure University Login</span>
          </div>

          <h2 className="card-title">{isRegisterMode ? "Create an Account" : "Welcome Back"}</h2>
          <p className="card-subtitle">
            {isRegisterMode ? "Enter your details to get started" : "Sign in with your university email to continue"}
          </p>

          <form className="form" onSubmit={handleSubmit}>
            {isRegisterMode && (
              <>
                <div className="name-inputs">
                  <div className="name-input-container">
                    <label className="field-label" htmlFor="firstName">
                      First Name
                    </label>
                    <div className="name-input-wrapper-sm">
                      <span className="name-icon">👤</span>
                      <input
                        id="firstName"
                        type="text"
                        required
                        placeholder="First Name"
                        className="name-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="name-input-container">
                    <label className="field-label" htmlFor="lastName">
                      Last Name
                    </label>
                    <div className="name-input-wrapper-sm">
                      <span className="name-icon">👤</span>
                      <input
                        id="lastName"
                        type="text"
                        required
                        placeholder="Last Name"
                        className="name-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <label className="field-label" htmlFor="universityName">
                  University Name
                </label>
                <div className="name-input-wrapper">
                  <span className="name-icon">🎓</span>
                  <input
                    id="universityName"
                    type="text"
                    required
                    placeholder="Enter your university name"
                    className="name-input"
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                  />
                </div>
                <label className="field-label" htmlFor="visaType">
                  Current Visa Type
                </label>
                <div className="select-wrapper">
                  <span className="select-icon">✈️</span>
                  <select
                    id="visaType"
                    required
                    className="visa-select"
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                  >
                    <option value="" disabled>Select your visa type</option>
                    <option value="F-1 Student Visa">F-1 Student Visa</option>
                    <option value="J-1 Exchange Visitor">J-1 Exchange Visitor</option>
                    <option value="M-1 Vocational Student">M-1 Vocational Student</option>
                    <option value="H-1B Work Visa">H-1B Work Visa</option>
                    <option value="OPT (F-1)">OPT (F-1)</option>
                    <option value="CPT (F-1)">CPT (F-1)</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <label className="field-label" htmlFor="programLevel">
                  Program Level
                </label>
                <div className="select-wrapper">
                  <span className="select-icon">📚</span>
                  <select
                    id="programLevel"
                    required
                    className="visa-select"
                    value={programLevel}
                    onChange={(e) => setProgramLevel(e.target.value)}
                  >
                    <option value="" disabled>Select your program level</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate (Master's)">Graduate (Master's)</option>
                    <option value="PhD/Doctoral">PhD/Doctoral</option>
                    <option value="Certificate Program">Certificate Program</option>
                    <option value="Post-Doctoral">Post-Doctoral</option>
                  </select>
                </div>
                <label className="field-label" htmlFor="major">
                  Major/Field of Study
                </label>
                <div className="name-input-wrapper">
                  <span className="name-icon">🔬</span>
                  <input
                    id="major"
                    type="text"
                    required
                    placeholder="Enter your major or field of study"
                    className="name-input"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                </div>
                <label className="field-label">
                  Expected Graduation Date
                </label>
                <div className="date-inputs">
                  <div className="date-input-container">
                    <div className="select-wrapper">
                      <span className="select-icon">📅</span>
                      <select
                        required
                        className="visa-select"
                        value={graduationMonth}
                        onChange={(e) => setGraduationMonth(e.target.value)}
                      >
                        <option value="" disabled>Month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="date-input-container">
                    <div className="select-wrapper">
                      <span className="select-icon">📅</span>
                      <select
                        required
                        className="visa-select"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                      >
                        <option value="" disabled>Year</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <label className="field-label" htmlFor="email">
              {isRegisterMode ? "College Email ID" : "University Email Address"}
            </label>

            <div className="email-input-wrapper">
              <span className="email-icon">@</span>
              <input
                id="email"
                type="email"
                required
                placeholder="you@university.edu"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <label className="field-label" htmlFor="password">
              Password
            </label>

            <div className="password-input-wrapper">
              <span className="password-icon">🔒</span>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                className="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegisterMode && (
              <>
                <label className="field-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <span className="password-icon">🔒</span>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm your password"
                    className="password-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <p className="helper-text">Only .edu, .edu.in, or Gmail email addresses are accepted</p>

            {error && (
              <p className="error-text">
                {error}
                {error.includes("verify your email") && (
                  <button type="button" className="link-button" onClick={resendVerificationEmail}>
                    Resend verification email
                  </button>
                )}
              </p>
            )}
            {successMessage && <p className="success-text">{successMessage}</p>}


            <button type="submit" className="primary-button" disabled={loading}>
                {loading ? (isRegisterMode ? "Registering..." : "Logging in...") : (isRegisterMode ? "Register" : "Login")}
                <span className="arrow">›</span>
              </button>
            </form>

          <p className="register-link">
            {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
            <button type="button" className="link-button" onClick={toggleMode}>
              {isRegisterMode ? "Login" : "Register"}
            </button>
          </p>

          {!isRegisterMode && (
            <p className="forgot-password-link">
                <button type="button" className="link-button" onClick={() => setShowForgotPassword(true)}>
                Forgot Password?
                </button>
            </p>
          )}

          <div className="why-section">
            <h3 className="why-title">Why Voyloo?</h3>
            <ul className="why-list">
              <li>
                <span className="check-icon">✔</span>
                Track your visa timeline &amp; deadlines
              </li>
              <li>
                <span className="check-icon">✔</span>
                Secure document vault storage
              </li>
              <li>
                <span className="check-icon">✔</span>
                AI-powered immigration assistant
              </li>
            </ul>
          </div>
        </div>
      </main>

      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Forgot Password</h3>
            {forgotPasswordSuccess ? (
              <p className="success-text">A password reset email has been sent to your email address.</p>
            ) : (
              <>
                <p className="modal-subtitle">Enter your email to receive a password reset link.</p>
                <form onSubmit={handlePasswordReset}>
                  <div className="email-input-wrapper">
                    <span className="email-icon">@</span>
                    <input
                      type="email"
                      required
                      placeholder="you@university.edu"
                      className="email-input"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>
                  {forgotPasswordError && <p className="error-text">{forgotPasswordError}</p>}
                  <button type="submit" className="primary-button">Send Reset Link</button>
                </form>
              </>
            )}
            <button className="link-button" onClick={() => setShowForgotPassword(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;
