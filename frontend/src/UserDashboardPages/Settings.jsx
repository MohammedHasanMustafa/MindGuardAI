import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiUpload, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    profileImage: null,
  });
  const [initialData, setInitialData] = useState({});
  const [preview, setPreview] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://mindguardaibackend.onrender.com/api/auth/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.user;
        setFormData({
          name: user.name,
          email: user.email,
          password: "",
          bio: user.bio || "",
          profileImage: null,
        });
        setInitialData({ name: user.name, email: user.email, bio: user.bio || "" });
      } catch (err) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profileImage: file }));
    setPreview(URL.createObjectURL(file));
  };
  const handleReset = () => {
    setFormData({ ...initialData, password: "", profileImage: null });
    setPreview("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    if (formData.password) data.append("password", formData.password);
    if (formData.profileImage) data.append("profileImage", formData.profileImage);

    try {
      await axios.put(`http://localhost:4000/api/auth/profile/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      alert("✅ Profile updated!");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-[#1e3a4c] via-[#1b2e3c] to-[#121c24] text-white"
          : "bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-black"
      }`}
    >
      <motion.div
        className={`max-w-3xl mx-auto rounded-2xl shadow-2xl p-8 backdrop-blur-sm ${
          darkMode ? "bg-gray-800/90 text-white" : "bg-white/80 text-gray-900"
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">⚙️ Account Settings</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle Theme"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-5">
            {preview ? (
              <img src={preview} alt="preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-2xl">
                📷
              </div>
            )}
            <label className="cursor-pointer text-blue-600 hover:underline flex items-center gap-2">
              <FiUpload />
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              Upload Profile Image
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              Reset
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
            >
              Save Changes
            </motion.button>
          </div>
        </form>

        {/* FAQ Section */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-4">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What is mental health?",
                a: "Mental health includes emotional, psychological, and social well-being. It affects how we think, feel, and act.",
              },
              {
                q: "How can I improve my mental health?",
                a: "Practice self-care, exercise, sleep well, connect with others, and consider therapy when needed.",
              },
              {
                q: "What should I do if I feel overwhelmed?",
                a: "Pause, take deep breaths, talk to someone, and don’t hesitate to seek professional support.",
              },
              {
                q: "When should I see a mental health professional?",
                a: "If you experience persistent sadness, anxiety, or difficulty coping with daily life, professional help can make a big difference.",
              },
              {
                q: "Is it normal to feel anxious or sad sometimes?",
                a: "Yes. It's part of being human. But if it becomes constant or unmanageable, don’t ignore it.",
              },
            ].map((item, index) => (
              <details key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg group cursor-pointer">
                <summary className="font-medium group-open:font-semibold text-lg text-blue-600 dark:text-blue-300">
                  {index + 1}. {item.q}
                </summary>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.a}</p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline flex items-center gap-2 justify-center text-sm"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
