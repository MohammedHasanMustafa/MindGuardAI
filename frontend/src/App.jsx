// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContent from "./AppContent";
import { AuthProvider } from "./AuthContext"; 

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
