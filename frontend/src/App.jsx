// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./AppContent";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Make sure the path is correct

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

