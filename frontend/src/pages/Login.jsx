import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://mindguardaibackend.onrender.com/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      if (setToken) {
        setToken(res.data.token);
      }
      // redirect field from the response 
      if (res.data.redirect) {
        navigate(res.data.redirect);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/ls.jpeg')" }}>
      <motion.div 
        className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img src="/cross_icon.svg" alt="Close" className="w-6 h-6 absolute top-4 right-4 cursor-pointer" onClick={() => navigate("/")} />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-md mb-3" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded-md mb-3" onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition" onClick={handleLogin}>
          Login
        </button>
        <p 
      className="text-sm text-center mt-3 text-purple-600 cursor-pointer hover:underline"
      onClick={() => navigate("/forgot-password")}
    >
      Forgot Password?
    </p>
        <p className="text-sm text-center mt-4 text-gray-700">
          Don't have an account? <span className="text-purple-600 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
