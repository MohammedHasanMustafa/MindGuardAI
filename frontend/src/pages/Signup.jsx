import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/signup", { fullName, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/ls.jpeg')" }}
    >
      <motion.div
        className="bg-white/30 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img
          src="/cross_icon.svg"
          alt="Close"
          className="w-6 h-6 absolute top-4 right-4 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded-md mb-3"
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-md mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
          onClick={handleSignup}
        >
          Sign Up
        </button>
        <p className="text-sm text-center mt-4 text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
