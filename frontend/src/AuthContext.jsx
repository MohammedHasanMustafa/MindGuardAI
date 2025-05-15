import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Provide the token globally
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUserId(decoded.userId); 
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem("token");
        setToken(null);
        setUserId(null);
      }
    }
  }, []);

  const setTokenAndStore = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      try {
        const decoded = jwtDecode(newToken);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Failed to decode new token", error);
        setUserId(null);
      }
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUserId(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, userId, setToken: setTokenAndStore }}>
      {children}
    </AuthContext.Provider>
  );
};


