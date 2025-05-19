import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaExclamationCircle, FaExclamationTriangle, FaCheckCircle, 
  FaChartLine, FaHistory, FaBell, FaFilter, FaSearch, 
  FaUserFriends, FaCog, FaFileExport, FaComment, FaChartBar 
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const RiskAnalysis = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    riskLevels: ["High", "Moderate", "Low"],
    dateRange: [null, null],
    searchQuery: "",
  });
  const [userPreferences, setUserPreferences] = useState({
    darkMode: false,
    alertThreshold: 70,
    layout: "standard",
  });
  const [newComment, setNewComment] = useState("");
  const [activeAlertId, setActiveAlertId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAlerts = async () => {
      try {
        const res = await axios.get("https://mindguardaibackend.onrender.com/api/chatbot/risk-alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(res.data.alerts.map(alert => ({
          ...alert,
          riskScore: calculateRiskScore(alert.riskLevel),
          comments: [],
          acknowledged: false
        })) || []);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const calculateRiskScore = (riskLevel) => {
    switch(riskLevel) {
      case "High": return Math.floor(Math.random() * 30) + 70; // 70-100
      case "Moderate": return Math.floor(Math.random() * 30) + 40; // 40-69
      case "Low": return Math.floor(Math.random() * 39) + 1; // 1-39
      default: return 0;
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Risk Level Filter
      if (!filters.riskLevels.includes(alert.riskLevel)) return false;
      
      // Date Range Filter
      const alertDate = new Date(alert.createdAt);
      if (filters.dateRange[0] && alertDate < filters.dateRange[0]) return false;
      if (filters.dateRange[1] && alertDate > filters.dateRange[1]) return false;
      
      // Search Query Filter
      if (filters.searchQuery && 
          !alert.recommendation.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [alerts, filters]);

  const recentHighRisk = filteredAlerts.filter((a) => a.riskLevel === "High").slice(-3).reverse();

  const handleAddComment = (alertId) => {
    if (!newComment.trim()) return;
    
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, comments: [...alert.comments, { 
            text: newComment, 
            timestamp: new Date().toISOString(),
            user: "Current User"
          }]}
        : alert
    ));
    setNewComment("");
    setActiveAlertId(null);
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  // Chart Data
  const chartData = {
    labels: filteredAlerts.map((a) => new Date(a.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Risk Level Trend",
        data: filteredAlerts.map((a) => (a.riskLevel === "High" ? 3 : a.riskLevel === "Moderate" ? 2 : 1)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value === 3 ? "#ef4444" : value === 2 ? "#f59e0b" : "#10b981";
        },
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const analyticsData = {
    labels: ["High", "Moderate", "Low"],
    datasets: [{
      label: 'Alerts by Risk Level',
      data: [
        filteredAlerts.filter(a => a.riskLevel === "High").length,
        filteredAlerts.filter(a => a.riskLevel === "Moderate").length,
        filteredAlerts.filter(a => a.riskLevel === "Low").length
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)'
      ],
      borderWidth: 1
    }]
  };

  const riskLabels = {
    1: "Low",
    2: "Moderate",
    3: "High",
  };

  const getRiskColor = (riskLevel) => {
    return riskLevel === "High" ? "red" : riskLevel === "Moderate" ? "yellow" : "green";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-gray-800 p-4 md:p-6 ${userPreferences.darkMode ? 'dark' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header with Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-500 drop-shadow tracking-tight"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Risk Analysis Dashboard
          </motion.h2>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.searchQuery}
                onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg border border-gray-300 flex items-center gap-2"
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {/* Filter Panel */}
<AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Level Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Risk Level</label>
          <div className="space-y-2">
            {["High", "Moderate", "Low"].map(level => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.riskLevels.includes(level)}
                  onChange={() => {
                    const newLevels = filters.riskLevels.includes(level)
                      ? filters.riskLevels.filter(l => l !== level)
                      : [...filters.riskLevels, level];
                    setFilters({...filters, riskLevels: newLevels});
                  }}
                  className="rounded text-blue-600"
                />
                <span>{level} Risk</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Fixed Date Range Picker */}
                <div>
                  <label className="block text-sm font-medium mb-1">Date Range</label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="date"
                      onChange={(e) => setFilters(prev => ({
                        ...prev, 
                        dateRange: [e.target.value ? new Date(e.target.value) : null, prev.dateRange[1]]
                      }))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      onChange={(e) => setFilters(prev => ({
                        ...prev, 
                        dateRange: [prev.dateRange[0], e.target.value ? new Date(e.target.value) : null]
                      }))}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="End Date"
                    />
                  </div>
                </div>
        
        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({
              riskLevels: ["High", "Moderate", "Low"],
              dateRange: [null, null],
              searchQuery: ""
            })}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* Navigation Tabs */}
        <motion.div className="flex mb-6 md:mb-10 overflow-x-auto">
          {["overview", "trends", "history", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium rounded-t-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-md"
                  : "bg-white/50 text-gray-600 hover:bg-white/70"
              }`}
            >
              {tab === "overview" && <FaChartLine />}
              {tab === "trends" && <FaChartLine />}
              {tab === "history" && <FaHistory />}
              {tab === "analytics" && <FaChartBar />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Risk Summary Card */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Risk Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Alerts:</span>
                  <span className="font-bold">{filteredAlerts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Risk:</span>
                  <span className="font-bold text-red-600">
                    {filteredAlerts.filter(a => a.riskLevel === "High").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Moderate Risk:</span>
                  <span className="font-bold text-yellow-600">
                    {filteredAlerts.filter(a => a.riskLevel === "Moderate").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low Risk:</span>
                  <span className="font-bold text-green-600">
                    {filteredAlerts.filter(a => a.riskLevel === "Low").length}
                  </span>
                </div>
                
                {/* Risk Score Meter */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Overall Risk Score</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-4 rounded-full" 
                      style={{ 
                        width: `${Math.min(
                          filteredAlerts.reduce((sum, a) => sum + a.riskScore, 0) / 
                          Math.max(filteredAlerts.length, 1),
        )}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="font-bold">
                      {filteredAlerts.length > 0 
                        ? Math.round(filteredAlerts.reduce((sum, a) => sum + a.riskScore, 0) / filteredAlerts.length)
                        : 0}
                    </span> Current Average Risk Score
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent High-Risk Alerts */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2">
                  <FaExclamationCircle className="text-2xl" />
                  Recent High-Risk Alerts
                </h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Threshold: {userPreferences.alertThreshold}+
                </span>
              </div>
              {recentHighRisk.length > 0 ? (
                <ul className="space-y-3">
                  {recentHighRisk.map((a, i) => (
                    <motion.li
                      key={i}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            {new Date(a.createdAt).toLocaleString()}
                          </p>
                          <p className="font-medium">{a.recommendation}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-600">{a.riskScore}</span>
                          <span className="block text-xs text-gray-500">Risk Score</span>
                        </div>
                      </div>
                      
                      {/* Collaboration Features */}
                      <div className="mt-2 flex justify-between items-center">
                        <button 
                          onClick={() => setActiveAlertId(activeAlertId === a.id ? null : a.id)}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FaComment /> {a.comments.length} Comments
                        </button>
                        {!a.acknowledged && (
                          <button 
                            onClick={() => handleAcknowledge(a.id)}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                      
                      {/* Comment Section */}
                      {activeAlertId === a.id && (
                        <div className="mt-3">
                          <div className="max-h-40 overflow-y-auto mb-2 space-y-2">
                            {a.comments.length > 0 ? (
                              a.comments.map((comment, idx) => (
                                <div key={idx} className="bg-white p-2 rounded border text-sm">
                                  <p className="font-medium">{comment.user}</p>
                                  <p>{comment.text}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No comments yet</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="flex-1 text-sm p-2 border rounded"
                            />
                            <button
                              onClick={() => handleAddComment(a.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    No recent high-risk alerts detected.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && (
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center gap-2">
              <FaChartLine className="text-2xl" />
              Risk Level Trend Analysis
            </h3>
            <div className="h-64 md:h-80">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => riskLabels[value] || "",
                        stepSize: 1,
                      },
                      min: 1,
                      max: 3,
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw;
                          return `Risk Level: ${riskLabels[value]}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span>Moderate Risk</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                <FaHistory className="text-2xl" />
                Alert History Timeline
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  Showing {filteredAlerts.length} alerts
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <FaFileExport />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                [...filteredAlerts].reverse().map((a, i) => (
                  <motion.div
                    key={i}
                    className={`p-4 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-${getRiskColor(a.riskLevel)}-500 bg-white`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start gap-3">
                      {a.riskLevel === "High" && (
                        <FaExclamationCircle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                      )}
                      {a.riskLevel === "Moderate" && (
                        <FaExclamationTriangle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
                      )}
                      {a.riskLevel === "Low" && (
                        <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 mb-1">
                            {new Date(a.createdAt).toLocaleString()}
                          </p>
                          <span className={`font-bold text-${getRiskColor(a.riskLevel)}-600`}>
                            {a.riskScore} pts
                          </span>
                        </div>
                        <p className="font-medium">
                          <span className={`font-semibold text-${getRiskColor(a.riskLevel)}-600`}>
                            {a.riskLevel} Risk
                          </span>{" "}
                          – <span className="text-gray-700">{a.recommendation}</span>
                        </p>
                        
                        {/* Collaboration Features */}
                        <div className="mt-2 flex justify-between items-center">
                          <button 
                            onClick={() => setActiveAlertId(activeAlertId === a.id ? null : a.id)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FaComment /> {a.comments.length} Comments
                          </button>
                          <div className="flex items-center gap-2">
                            {a.acknowledged ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Acknowledged
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleAcknowledge(a.id)}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                              >
                                Acknowledge
                              </button>
                            )}
                            <button className="text-xs text-gray-600 hover:text-gray-800">
                              <FaUserFriends />
                            </button>
                          </div>
                        </div>
                        
                        {/* Comment Section */}
                        {activeAlertId === a.id && (
                          <div className="mt-3">
                            <div className="max-h-40 overflow-y-auto mb-2 space-y-2">
                              {a.comments.length > 0 ? (
                                a.comments.map((comment, idx) => (
                                  <div key={idx} className="bg-gray-50 p-2 rounded border text-sm">
                                    <p className="font-medium">{comment.user}</p>
                                    <p>{comment.text}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(comment.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No comments yet</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 text-sm p-2 border rounded"
                              />
                              <button
                                onClick={() => handleAddComment(a.id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-gray-600">No alerts match your filters.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Alert Distribution</h3>
                <div className="h-64">
                  <Bar 
                    data={analyticsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Risk Score Distribution</h3>
                <div className="h-64">
                  <Line
                    data={{
                      labels: filteredAlerts.map((_, i) => `Alert ${i+1}`),
                      datasets: [{
                        label: 'Risk Score',
                        data: filteredAlerts.map(a => a.riskScore),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          min: 0,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>
            
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Alert Frequency Over Time</h3>
              <div className="h-64">
                <Line
                  data={{
                    labels: Array.from(new Set(filteredAlerts.map(a => new Date(a.createdAt).toLocaleDateString()))),
                    datasets: [{
                      label: 'Alerts per Day',
                      data: Object.values(filteredAlerts.reduce((acc, alert) => {
                        const date = new Date(alert.createdAt).toLocaleDateString();
                        acc[date] = (acc[date] || 0) + 1;
                        return acc;
                      }, {})),
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      fill: true
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Personalization Panel */}
        <div className="fixed bottom-4 right-4">
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUserPreferences({...userPreferences, darkMode: !userPreferences.darkMode})}
          >
            <FaCog className="text-2xl text-blue-600" />
          </motion.div>
          
          <AnimatePresence>
            {userPreferences.darkMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 right-0 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 w-64"
              >
                <h4 className="font-medium mb-2">Dashboard Preferences</h4>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <input
                        type="checkbox"
                        checked={userPreferences.darkMode}
                        onChange={() => setUserPreferences({...userPreferences, darkMode: !userPreferences.darkMode})}
                        className="toggle"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Alert Threshold</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={userPreferences.alertThreshold}
                      onChange={(e) => setUserPreferences({...userPreferences, alertThreshold: e.target.value})}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-600 mt-1">
                      Current: {userPreferences.alertThreshold}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Layout</label>
                    <select
                      value={userPreferences.layout}
                      onChange={(e) => setUserPreferences({...userPreferences, layout: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="standard">Standard</option>
                      <option value="compact">Compact</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskAnalysis;
