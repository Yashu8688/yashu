
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
  const [fullName, setFullName] = useState("");
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
      if (!fullName) {
        setError("Full name is required");
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
            fullName,
            email,
            createdAt: new Date(),
          });
        
        setLoading(false);
        setSuccessMessage("Verification sent to mail");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
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
                <label className="field-label" htmlFor="fullName">
                  Full Name
                </label>
                <div className="name-input-wrapper">
                  <span className="name-icon">👤</span>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="name-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
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
