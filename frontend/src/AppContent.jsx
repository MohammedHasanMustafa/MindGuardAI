import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; 
import { useAuth } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";

// User Dashboard Pages
import BreathingExercise from "./UserDashboardPages/BreathingExercise";
import GuidedMeditation from "./UserDashboardPages/GuidedMeditation";
import MeditationDetail from "./UserDashboardPages/MeditationDetail"; 
import CopingStrategies from "./UserDashboardPages/CopingStrategies";
import ChatbotSuggestionPage from "./UserDashboardPages/ChatbotSuggestionPage";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />

      <Route 
        path="/breathing-exercise" 
        element={
          <PrivateRoute>
            <BreathingExercise />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/guided-meditation" 
        element={
          <PrivateRoute>
            <GuidedMeditation />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/guided-meditation/:id" 
        element={
          <PrivateRoute>
            <MeditationDetail />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/coping-strategies" 
        element={
          <PrivateRoute>
            <CopingStrategies />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/chatbot-suggestions" 
        element={
          <PrivateRoute>
            <ChatbotSuggestionPage userId={user?._id} />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/dashboard/*" />} />
    </Routes>
  );
};

export default AppContent;
