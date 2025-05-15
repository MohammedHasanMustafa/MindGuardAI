// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./AppContent";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "../src/UserDashboardPages/Themes/ThemeContext";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

