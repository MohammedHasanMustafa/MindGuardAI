import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FiSun, FiMoon, FiUpload, FiLogOut, FiUser, FiMail, 
  FiLock, FiEdit2, FiHelpCircle, FiClock, FiBell,
  FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiGlobe
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Dark mode context to share across all pages
export const DarkModeContext = React.createContext();

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    profileImage: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    socialMedia: {
      instagram: "",
      twitter: "",
      facebook: "",
      linkedin: ""
    }
  });
  
  const [initialData, setInitialData] = useState({});
  const [preview, setPreview] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Apply dark mode to entire app
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
          timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          notifications: user.notifications || {
            email: true,
            push: true,
            sms: false,
          },
          socialMedia: user.socialMedia || {
            instagram: "",
            twitter: "",
            facebook: "",
            linkedin: ""
          }
        });
        setInitialData({ ...user });
        setPreview(user.profileImage || "");
      } catch (err) {
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

  // Timezone options
  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Chennai",
    "Australia/Sydney",

  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profileImage: "Image must be less than 5MB" }));
      return;
    }
    setFormData(prev => ({ ...prev, profileImage: file }));
    setPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, profileImage: "" }));
  };

  const handleReset = () => {
    setFormData({ ...initialData, password: "", profileImage: null });
    setPreview("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    const userId = JSON.parse(atob(token.split(".")[1])).id;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    data.append("timezone", formData.timezone);
    data.append("notifications", JSON.stringify(formData.notifications));
    data.append("socialMedia", JSON.stringify(formData.socialMedia));
    if (formData.password) data.append("password", formData.password);
    if (formData.profileImage) data.append("profileImage", formData.profileImage);

    try {
      await axios.put(`https://mindguardaibackend.onrender.com/api/auth/profile/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("✅ Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrors(prev => ({
        ...prev,
        server: err.response?.data?.message || "Update failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser /> },
    { id: "preferences", label: "Preferences", icon: <FiBell /> },
    { id: "social", label: "Social Media", icon: <FiInstagram /> },
    { id: "security", label: "Security", icon: <FiLock /> },
    { id: "help", label: "Help Center", icon: <FiHelpCircle /> },
  ];

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`min-h-screen p-4 md:p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}>
        <motion.div
          className={`max-w-4xl mx-auto rounded-2xl shadow-xl overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
                    <FiEdit2 />
                  </span>
                  Account Settings
                </h1>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  Manage your profile and account preferences
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full transition-colors ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label="Toggle theme"
                >
                  {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon />}
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    darkMode 
                      ? "text-red-400 hover:bg-gray-700" 
                      : "text-red-600 hover:bg-gray-100"
                  }`}
                >
                  <FiLogOut />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className={`w-full md:w-56 p-4 border-b md:border-b-0 md:border-r ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? darkMode
                          ? "bg-blue-900/50 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                        : darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <FiUser />
                      Profile Information
                    </h2>
                    
                    {successMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-3 rounded-md ${
                          darkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {successMessage}
                      </motion.div>
                    )}
                    
                    {errors.server && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-3 rounded-md ${
                          darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {errors.server}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Profile Image */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative group">
                          {preview ? (
                            <img 
                              src={preview} 
                              alt="preview" 
                              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                            />
                          ) : (
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${
                              darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                            }`}>
                              {formData.name ? formData.name.charAt(0).toUpperCase() : "👤"}
                            </div>
                          )}
                          <label className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                            <FiUpload className="inline mr-1" />
                            Change
                            <input
                              type="file"
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <p className="text-sm mb-1 text-gray-500 dark:text-gray-400">
                            Recommended: Square image, at least 200x200 pixels
                          </p>
                          {errors.profileImage && (
                            <p className="text-sm text-red-500">{errors.profileImage}</p>
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiUser size={16} />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          } ${errors.name ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiMail size={16} />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          } ${errors.email ? "border-red-500" : ""}`}
                          required
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block font-medium mb-1">
                          About Me
                        </label>
                        <textarea
                          name="bio"
                          rows="4"
                          value={formData.bio}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none resize-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          }`}
                          placeholder="Tell us about yourself..."
                          maxLength="200"
                        />
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          Max 200 characters: {formData.bio.length}/200
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                        <button
                          type="button"
                          onClick={handleReset}
                          className={`px-4 py-2 rounded-md transition-colors ${
                            darkMode 
                              ? "bg-gray-700 hover:bg-gray-600" 
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          Discard Changes
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-2 rounded-md text-white transition-colors ${
                            isSubmitting
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === "preferences" && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <FiBell />
                      Notification Preferences
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Timezone */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiClock size={16} />
                          Timezone
                        </label>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </select>
                      </div>

                      {/* Notification Preferences */}
                      <div>
                        <h3 className="font-medium mb-3">Notification Settings</h3>
                        <div className={`p-4 rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="font-medium">Email Notifications</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.notifications.email}
                                  onChange={() => handleNotificationChange("email")}
                                  className="sr-only"
                                />
                                <div className={`block w-12 h-6 rounded-full transition-colors ${
                                  formData.notifications.email
                                    ? "bg-blue-600"
                                    : darkMode
                                      ? "bg-gray-600"
                                      : "bg-gray-300"
                                }`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                                  formData.notifications.email ? "transform translate-x-6" : ""
                                }`}></div>
                              </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="font-medium">Push Notifications</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.notifications.push}
                                  onChange={() => handleNotificationChange("push")}
                                  className="sr-only"
                                />
                                <div className={`block w-12 h-6 rounded-full transition-colors ${
                                  formData.notifications.push
                                    ? "bg-blue-600"
                                    : darkMode
                                      ? "bg-gray-600"
                                      : "bg-gray-300"
                                }`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                                  formData.notifications.push ? "transform translate-x-6" : ""
                                }`}></div>
                              </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                              <span className="font-medium">SMS Notifications</span>
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={formData.notifications.sms}
                                  onChange={() => handleNotificationChange("sms")}
                                  className="sr-only"
                                />
                                <div className={`block w-12 h-6 rounded-full transition-colors ${
                                  formData.notifications.sms
                                    ? "bg-blue-600"
                                    : darkMode
                                      ? "bg-gray-600"
                                      : "bg-gray-300"
                                }`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                                  formData.notifications.sms ? "transform translate-x-6" : ""
                                }`}></div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-2 rounded-md text-white transition-colors ${
                            isSubmitting
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {isSubmitting ? "Updating..." : "Update Preferences"}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === "social" && (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <FiInstagram />
                      Social Media Accounts
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Instagram */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiInstagram size={16} />
                          Instagram
                        </label>
                        <div className="flex">
                          <span className={`inline-flex items-center px-3 rounded-l-md border border-r-0 ${
                            darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-500"
                          }`}>
                            instagram.com/
                          </span>
                          <input
                            type="text"
                            value={formData.socialMedia.instagram}
                            onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-r-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                              darkMode 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                            }`}
                            placeholder="username"
                          />
                        </div>
                      </div>

                      {/* Twitter */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiTwitter size={16} />
                          Twitter
                        </label>
                        <div className="flex">
                          <span className={`inline-flex items-center px-3 rounded-l-md border border-r-0 ${
                            darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-500"
                          }`}>
                            twitter.com/
                          </span>
                          <input
                            type="text"
                            value={formData.socialMedia.twitter}
                            onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-r-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                              darkMode 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                            }`}
                            placeholder="username"
                          />
                        </div>
                      </div>

                      {/* Facebook */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiFacebook size={16} />
                          Facebook
                        </label>
                        <div className="flex">
                          <span className={`inline-flex items-center px-3 rounded-l-md border border-r-0 ${
                            darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-500"
                          }`}>
                            facebook.com/
                          </span>
                          <input
                            type="text"
                            value={formData.socialMedia.facebook}
                            onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-r-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                              darkMode 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                            }`}
                            placeholder="username"
                          />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label className="block font-medium mb-1 flex items-center gap-2">
                          <FiLinkedin size={16} />
                          LinkedIn
                        </label>
                        <div className="flex">
                          <span className={`inline-flex items-center px-3 rounded-l-md border border-r-0 ${
                            darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-500"
                          }`}>
                            linkedin.com/in/
                          </span>
                          <input
                            type="text"
                            value={formData.socialMedia.linkedin}
                            onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-r-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                              darkMode 
                                ? "bg-gray-700 border-gray-600" 
                                : "bg-white border-gray-300"
                            }`}
                            placeholder="username"
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-2 rounded-md text-white transition-colors ${
                            isSubmitting
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {isSubmitting ? "Updating..." : "Update Social Links"}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <FiLock />
                      Security Settings
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Current Password */}
                      <div>
                        <label className="block font-medium mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          }`}
                          placeholder="Enter your current password"
                        />
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block font-medium mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          } ${errors.password ? "border-red-500" : ""}`}
                          placeholder="Enter new password"
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                        <div className="mt-2">
                          <div className={`h-1 rounded-full mb-1 ${
                            formData.password.length > 0 
                              ? formData.password.length < 6 
                                ? "bg-red-500" 
                                : formData.password.length < 10 
                                  ? "bg-yellow-500" 
                                  : "bg-green-500"
                              : darkMode 
                                ? "bg-gray-600" 
                                : "bg-gray-200"
                          }`}></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.password.length > 0 
                              ? formData.password.length < 6 
                                ? "Weak" 
                                : formData.password.length < 10 
                                  ? "Moderate" 
                                  : "Strong"
                              : "Password strength"}
                          </p>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block font-medium mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                            darkMode 
                              ? "bg-gray-700 border-gray-600" 
                              : "bg-white border-gray-300"
                          }`}
                          placeholder="Confirm your new password"
                        />
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="pt-4">
                        <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                        <div className={`p-4 rounded-md ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Status: <span className="text-yellow-600 dark:text-yellow-400">Disabled</span></p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <button
                              type="button"
                              className={`px-4 py-2 rounded-md text-sm ${
                                darkMode 
                                  ? "bg-gray-600 hover:bg-gray-500" 
                                  : "bg-gray-200 hover:bg-gray-300"
                              }`}
                            >
                              Enable
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-2 rounded-md text-white transition-colors ${
                            isSubmitting
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {isSubmitting ? "Updating..." : "Update Security"}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === "help" && (
                  <motion.div
                    key="help"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <FiHelpCircle />
                      Help Center
                    </h2>

                    <div className="space-y-6">
                      <div className={`p-6 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-blue-50"
                      }`}>
                        <h3 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-300">
                          Need immediate help?
                        </h3>
                        <p className="mb-4">
                          Our support team is available 24/7 to assist you with any questions or issues.
                        </p>
                        <button
                          onClick={() => setShowContactModal(true)}
                          className={`px-4 py-2 rounded-md ${
                            darkMode 
                              ? "bg-blue-600 hover:bg-blue-700" 
                              : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                          }`}
                        >
                          Contact Support
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                          {[
                            {
                              q: "What is mental health and why is it important?",
                              a: "Mental health encompasses our emotional, psychological, and social well-being. It affects how we think, feel, and act as we cope with life. Good mental health isn't just the absence of mental health problems. It's essential to your overall health and quality of life. Self-care can play a role in maintaining your mental health and help support your treatment and recovery if you have a mental illness.",
                            },
                            {
                              q: "How can I improve my mental health on a daily basis?",
                              a: "There are many ways to maintain good mental health: \n\n• Practice self-care through proper sleep, nutrition, and exercise \n• Develop coping skills for stress like meditation or journaling \n• Connect with others and maintain healthy relationships \n• Set realistic goals and break tasks into small steps \n• Take breaks when needed and make time for activities you enjoy \n• Seek professional help when you need it - it's a sign of strength",
                            },
                            {
                              q: "What should I do when I feel overwhelmed or anxious?",
                              a: "When feeling overwhelmed: \n\n1. Pause and take slow, deep breaths (try 4-7-8 breathing) \n2. Ground yourself by noticing 5 things you can see, 4 you can touch, etc. \n3. Break tasks into smaller, manageable pieces \n4. Prioritize what needs immediate attention \n5. Reach out to a friend, family member, or professional \n6. Remember that feelings are temporary and will pass \n7. Consider professional help if these feelings persist",
                            },
                            {
                              q: "When should I consider seeing a mental health professional?",
                              a: "Consider seeking professional help if you experience: \n\n• Persistent sadness, anxiety, or \"empty\" feelings lasting weeks \n• Extreme mood swings or excessive anger \n• Withdrawal from social activities and relationships \n• Significant changes in eating or sleeping patterns \n• Difficulty concentrating or making decisions \n• Thoughts of self-harm or suicide \n\nEarly intervention often leads to better outcomes. There's no need to wait until symptoms are severe",
                            },
                            {
                              q: "How can I support a loved one with mental health challenges?",
                              a: "Supporting someone with mental health issues: \n\n• Educate yourself about their condition \n• Listen without judgment and offer emotional support \n• Encourage professional help but don't force it \n• Be patient - recovery takes time \n• Take care of your own mental health too \n• Offer practical help with daily tasks if needed \n• Avoid dismissive phrases like \"snap out of it\" \n• Check in regularly but respect their boundaries",
                            }
                          ].map((faq, index) => (
                            <div 
                              key={index} 
                              className={`p-4 rounded-md ${
                                darkMode ? "bg-gray-700" : "bg-gray-100"
                              }`}
                            >
                              <h4 className="font-medium">{faq.q}</h4>
                              <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                {faq.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contact Support Modal */}
                    <AnimatePresence>
                      {showContactModal && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                          onClick={() => setShowContactModal(false)}
                        >
                          <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className={`rounded-xl p-6 w-full max-w-md ${
                              darkMode ? "bg-gray-800" : "bg-white"
                            }`}
                            onClick={e => e.stopPropagation()}
                          >
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                              <FiMail />
                              Contact Support
                            </h3>
                            <form className="space-y-4">
                              <div>
                                <label className="block mb-1">Your Email</label>
                                <input
                                  type="email"
                                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                    darkMode 
                                      ? "bg-gray-700 border-gray-600" 
                                      : "bg-white border-gray-300"
                                  }`}
                                  placeholder="email@example.com"
                                />
                              </div>
                              <div>
                                <label className="block mb-1">Subject</label>
                                <input
                                  type="text"
                                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                    darkMode 
                                      ? "bg-gray-700 border-gray-600" 
                                      : "bg-white border-gray-300"
                                  }`}
                                  placeholder="What can we help with?"
                                />
                              </div>
                              <div>
                                <label className="block mb-1">Message</label>
                                <textarea
                                  rows="4"
                                  className={`w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                    darkMode 
                                      ? "bg-gray-700 border-gray-600" 
                                      : "bg-white border-gray-300"
                                  }`}
                                  placeholder="Describe your issue in detail..."
                                ></textarea>
                              </div>
                              <div className="flex justify-end gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setShowContactModal(false)}
                                  className={`px-4 py-2 rounded-md ${
                                    darkMode 
                                      ? "bg-gray-700 hover:bg-gray-600" 
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className={`px-4 py-2 rounded-md text-white ${
                                    darkMode 
                                      ? "bg-blue-600 hover:bg-blue-700" 
                                      : "bg-blue-500 hover:bg-blue-600"
                                  }`}
                                >
                                  Send Message
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 text-center text-sm ${
            darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
          }`}>
            <p>© {new Date().getFullYear()} Mental Health App. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </DarkModeContext.Provider>
  );
};

export default Settings;
