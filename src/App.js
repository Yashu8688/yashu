import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
// Placeholder imports for other pages to be created
import UploadResumeModal from './components/UploadResumeModal';
import EmailPage from './components/EmailPage';
import PasswordPage from './components/PasswordPage';
import LandingPage from './components/LandingPage';
import MessagePage from './components/MessagePage';
import PortfolioGallery from './components/PortfolioGallery';
import VNetworkPage from './components/VNetworkPage';
import PortfolioTemplateSelector from './components/PortfolioTemplateSelector';
import JobsPage from './components/JobsPage';
import ProfilePage from './components/ProfilePage';
import EditProfile from './components/EditProfile';
import ConnectionsAnalytics from './components/ConnectionsAnalytics';
import PortfolioStyleSelector from './components/PortfolioStyleSelector';
import ProfessionalActivity from './components/ProfessionalActivity';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/portfolio-gallery" element={<PortfolioGallery />} />
        <Route path="/portfolio-template-selector" element={<PortfolioTemplateSelector />} />
        <Route path="/v-network" element={<VNetworkPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/uploadresumemodal" element={<UploadResumeModal />} />
        <Route path="/editprofile" element={<EditProfile/>}/>
        <Route path="connectionanalytics" element={<ConnectionsAnalytics/>}/>
        <Route path="portfoliostyleselector" element={<PortfolioStyleSelector/>}/>
        <Route path="professionalactivity" element={<ProfessionalActivity/>}/>
      </Routes>
    </Router>
  );
}

export default App;
