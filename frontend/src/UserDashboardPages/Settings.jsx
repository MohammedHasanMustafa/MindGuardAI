import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FiUpload, FiLogOut, FiUser, FiMail, 
  FiLock, FiEdit2, FiHelpCircle, FiClock, FiBell,
  FiInstagram, FiTwitter, FiFacebook, FiLinkedin
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button, TextField, TextareaAutosize, Chip } from "@mui/material";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    profile_image: null,
  });
  
  const [initialData, setInitialData] = useState({});
  const [preview, setPreview] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data;
        setFormData({
          name: user.name,
          email: user.email,
          password: "",
          bio: user.bio || "",
          profile_image: null,
        });
        setInitialData({ ...user });
        setPreview(user.profile_image || "");
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [token, navigate]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profile_image: "Image must be less than 5MB" }));
      return;
    }
    setFormData(prev => ({ ...prev, profile_image: file }));
    setPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, profile_image: "" }));
  };

  const handleReset = () => {
    setFormData({ ...initialData, password: "", profile_image: null });
    setPreview("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    if (formData.password) data.append("password", formData.password);
    if (formData.profile_image) data.append("profile_image", formData.profile_image);

    try {
      await axios.put("http://localhost:5000/api/users/profile", data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      setSuccessMessage("✅ Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      // Refresh user data
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInitialData(res.data);
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

  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser /> },
    { id: "security", label: "Security", icon: <FiLock /> },
    { id: "help", label: "Help Center", icon: <FiHelpCircle /> },
  ];

  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #297194, #D1E1F7, #E7F2F7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.div
        className="max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3,
          mb: 3,
          borderRadius: "12px",
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}>
            <Box>
              <Typography variant="h4" fontWeight="700" sx={{ color: "#2C3E50" }}>
                <Box component="span" sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  mr: 2
                }}>
                  <FiEdit2 style={{ color: "#2E7D32" }} />
                </Box>
                Account Settings
              </Typography>
              <Typography variant="body2" sx={{ color: "#546E7A", mt: 1 }}>
                Manage your profile and account preferences
              </Typography>
            </Box>
            <Button
              onClick={handleLogout}
              startIcon={<FiLogOut />}
              sx={{
                color: "#D32F2F",
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: "12px",
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          overflow: 'hidden'
        }}>
          {/* Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', md: 220 },
            p: 2,
            borderBottom: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' },
            borderRight: { xs: 'none', md: '1px solid rgba(0,0,0,0.1)' }
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'row', md: 'column' },
              gap: 1,
              overflowX: { xs: 'auto', md: 'visible' },
              pb: { xs: 1, md: 0 }
            }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  startIcon={tab.icon}
                  sx={{
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    minWidth: 'auto',
                    borderRadius: "8px",
                    textTransform: 'none',
                    color: activeTab === tab.id ? "#FFFFFF" : "#2C3E50",
                    backgroundColor: activeTab === tab.id ? "#297194" : "transparent",
                    '&:hover': {
                      backgroundColor: activeTab === tab.id ? "#1D4E6B" : "rgba(41, 113, 148, 0.1)"
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Content Area */}
          <Box sx={{ flex: 1, p: 4 }}>
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiUser /> Profile Information
                  </Typography>
                  
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: "rgba(46, 125, 50, 0.1)",
                        color: "#2E7D32"
                      }}
                    >
                      {successMessage}
                    </motion.div>
                  )}
                  
                  {errors.server && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                        color: "#D32F2F"
                      }}
                    >
                      {errors.server}
                    </motion.div>
                  )}

                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Profile Image */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ position: 'relative' }}>
                        {preview ? (
                          <Box
                            component="img"
                            src={preview}
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #297194"
                            }}
                          />
                        ) : (
                          <Box sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: "rgba(41, 113, 148, 0.1)",
                            color: "#297194",
                            fontSize: "2rem",
                            border: "2px solid #297194"
                          }}>
                            {formData.name ? formData.name.charAt(0).toUpperCase() : "👤"}
                          </Box>
                        )}
                        <Button
                          component="label"
                          variant="contained"
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderRadius: "20px",
                            textTransform: 'none',
                            backgroundColor: "#297194",
                            '&:hover': {
                              backgroundColor: "#1D4E6B"
                            }
                          }}
                          startIcon={<FiUpload size={14} />}
                        >
                          Change
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            hidden
                          />
                        </Button>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "#546E7A" }}>
                          Recommended: Square image, at least 200x200 pixels
                        </Typography>
                        {errors.profile_image && (
                          <Typography variant="body2" sx={{ color: "#D32F2F", mt: 1 }}>
                            {errors.profile_image}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Name */}
                    <Box>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FiUser size={16} /> Full Name
                      </Typography>
                      <TextField
                        fullWidth
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF"
                          }
                        }}
                        required
                      />
                    </Box>

                    {/* Email */}
                    <Box>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FiMail size={16} /> Email Address
                      </Typography>
                      <TextField
                        fullWidth
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF"
                          }
                        }}
                        required
                      />
                    </Box>

                    {/* Bio */}
                    <Box>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                        About Me
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        inputProps={{ maxLength: 200 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF"
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#546E7A", mt: 1 }}>
                        Max 200 characters: {formData.bio.length}/200
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                      <Button
                        onClick={handleReset}
                        variant="outlined"
                        sx={{
                          borderRadius: "8px",
                          color: "#297194",
                          borderColor: "#297194",
                          '&:hover': {
                            borderColor: "#1D4E6B"
                          }
                        }}
                      >
                        Discard Changes
                      </Button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        style={{
                          padding: '8px 24px',
                          borderRadius: "8px",
                          border: 'none',
                          backgroundColor: isSubmitting ? "#81C784" : "#297194",
                          color: "#FFFFFF",
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </motion.button>
                    </Box>
                  </Box>
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
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiLock /> Security Settings
                  </Typography>

                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Current Password */}
                    <Box>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                        Current Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="Enter your current password"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF"
                          }
                        }}
                      />
                    </Box>

                    {/* New Password */}
                    <Box>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                        New Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF"
                          }
                        }}
                        placeholder="Enter new password"
                      />
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ 
                          height: 4,
                          borderRadius: "2px",
                          mb: 1,
                          backgroundColor: formData.password.length > 0 
                            ? formData.password.length < 6 
                              ? "#D32F2F" 
                              : formData.password.length < 10 
                                ? "#FFA000" 
                                : "#2E7D32"
                            : "#E0E0E0"
                        }}></Box>
                        <Typography variant="body2" sx={{ color: "#546E7A" }}>
                          {formData.password.length > 0 
                            ? formData.password.length < 6 
                              ? "Weak" 
                              : formData.password.length < 10 
                                ? "Moderate" 
                                : "Strong"
                            : "Password strength"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Confirm New Password */}
                    <Box>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                        Confirm New Password
                      </Typography>
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="Confirm your new password"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: "8px",
                            backgroundColor: "#FFFFFF"
                          }
                        }}
                      />
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        style={{
                          padding: '8px 24px',
                          borderRadius: "8px",
                          border: 'none',
                          backgroundColor: isSubmitting ? "#81C784" : "#297194",
                          color: "#FFFFFF",
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}
                      >
                        {isSubmitting ? "Updating..." : "Update Security"}
                      </motion.button>
                    </Box>
                  </Box>
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
                  <Typography variant="h5" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiHelpCircle /> Help Center
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{ 
                      p: 3,
                      borderRadius: "8px",
                      backgroundColor: "rgba(41, 113, 148, 0.1)",
                      border: "1px solid rgba(41, 113, 148, 0.3)"
                    }}>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: "#297194" }}>
                        Need immediate help?
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Our support team is available 24/7 to assist you with any questions or issues.
                      </Typography>
                      <Button
                        onClick={() => setShowContactModal(true)}
                        variant="contained"
                        sx={{
                          backgroundColor: "#297194",
                          '&:hover': {
                            backgroundColor: "#1D4E6B"
                          }
                        }}
                      >
                        Contact Support
                      </Button>
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                        Frequently Asked Questions
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                          {
                            q: "How do I update my profile information?",
                            a: "You can update your profile information by navigating to the 'Profile' tab in Settings. Make your changes and click 'Save Changes'."
                          },
                          {
                            q: "How can I change my password?",
                            a: "Go to the 'Security' tab in Settings. Enter your current password, new password, and confirm the new password. Then click 'Update Security'."
                          },
                          {
                            q: "What should I do if I forget my password?",
                            a: "Click on 'Forgot Password' on the login page. Enter your email address and follow the instructions sent to your email to reset your password."
                          },
                          {
                            q: "How can I delete my account?",
                            a: "Currently, account deletion must be done by contacting our support team. Please use the 'Contact Support' button above."
                          }
                        ].map((faq, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              p: 2,
                              borderRadius: "8px",
                              backgroundColor: "rgba(0, 0, 0, 0.03)",
                              border: "1px solid rgba(0, 0, 0, 0.1)"
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="500">{faq.q}</Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: "#546E7A" }}>
                              {faq.a}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Contact Support Modal */}
                  <AnimatePresence>
                    {showContactModal && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1300,
                          padding: 16
                        }}
                        onClick={() => setShowContactModal(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 20 }}
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "12px",
                            padding: 24,
                            width: '100%',
                            maxWidth: 500
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FiMail /> Contact Support
                          </Typography>
                          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                              <Typography variant="body1" sx={{ mb: 1 }}>Your Email</Typography>
                              <TextField
                                fullWidth
                                type="email"
                                placeholder="email@example.com"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: "8px",
                                    backgroundColor: "#FFFFFF"
                                  }
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography variant="body1" sx={{ mb: 1 }}>Subject</Typography>
                              <TextField
                                fullWidth
                                placeholder="What can we help with?"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: "8px",
                                    backgroundColor: "#FFFFFF"
                                  }
                                }}
                              />
                            </Box>
                            <Box>
                              <Typography variant="body1" sx={{ mb: 1 }}>Message</Typography>
                              <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Describe your issue in detail..."
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: "8px",
                                    backgroundColor: "#FFFFFF"
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 1 }}>
                              <Button
                                onClick={() => setShowContactModal(false)}
                                variant="outlined"
                                sx={{
                                  color: "#297194",
                                  borderColor: "#297194",
                                  '&:hover': {
                                    borderColor: "#1D4E6B"
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                  backgroundColor: "#297194",
                                  '&:hover': {
                                    backgroundColor: "#1D4E6B"
                                  }
                                }}
                              >
                                Send Message
                              </Button>
                            </Box>
                          </Box>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          mt: 3,
          p: 2,
          textAlign: 'center',
          borderRadius: "12px",
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
          <Typography variant="body2" sx={{ color: "#546E7A" }}>
            © {new Date().getFullYear()} MindGuard. All rights reserved.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Settings;
