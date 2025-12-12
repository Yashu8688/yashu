// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import Vault from "./pages/Vault";
import Advisors from "./pages/Advisors";
import Onboarding from "./components/Onboarding";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted') === 'true';
    setOnboardingCompleted(completed);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setOnboardingCompleted(true);
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const isUserVerified = user && user.emailVerified;

  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        <Route path="/login" element={isUserVerified ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/" element={<Navigate to={isUserVerified ? "/dashboard" : (onboardingCompleted ? "/login" : "/onboarding")} replace />} />
        <Route path="/dashboard" element={isUserVerified ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/news" element={isUserVerified ? <News /> : <Navigate to="/login" />} />
        <Route path="/vault" element={isUserVerified ? <Vault /> : <Navigate to="/login" />} />
        <Route path="/advisors" element={isUserVerified ? <Advisors /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
