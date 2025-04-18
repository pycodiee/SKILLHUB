import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CodeEditor from './pages/CodeEditor';
import VideoSummary from './pages/VideoSummary';
import RecommendationForm from './pages/RecommendationForm';
import ResumeBuilder from './pages/ResumeBuilder';
import AssessmentTest from './pages/AssessmentTest';
import Logout from './pages/Logout';

import './index.css';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/code-editor" element={<CodeEditor onBack={() => {}} />} />
          <Route path="/resume-builder" element={<NotFound />} /> {/* Placeholder until ResumeBuilder is implemented */}
          <Route path="/video-summary" element={<VideoSummary />} />
          <Route path="/recommendation-form" element={<RecommendationForm />} />
          <Route path="/assessment" element={<AssessmentTest />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
