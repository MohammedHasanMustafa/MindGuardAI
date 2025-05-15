import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axios.put(`http://localhost:4000/api/reset-password/${token}`, {
        newPassword,
      });

      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-md">
       
        <img
          src="/cross_icon.svg"
          alt="Close"
          className="w-6 h-6 absolute top-4 right-4 cursor-pointer z-50"
          onClick={() => navigate("/")}
        />

        <motion.div
          className="bg-white p-8 rounded-md shadow-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">🔐 Reset Password</h2>
          {message && <p className="text-green-600 text-center mb-3">{message}</p>}
          {error && <p className="text-red-600 text-center mb-3">{error}</p>}
          <form onSubmit={handleReset}>
            <label className="block mb-2 font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md mb-4"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
