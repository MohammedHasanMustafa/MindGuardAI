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
  const [riskData, setRiskData] = useState({
    userId: null,
    count: 0,
    riskLevels: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    riskLevels: ["High Risk", "Moderate Risk", "Low Risk"],
    disorders: [
      "ADHD", "BPD", "OCD", "PTSD", "Anxiety", 
      "Autism", "Bipolar", "Depression", "Eating Disorders", 
      "Health", "Mental Illness", "Schizophrenia", "Suicide Watch"
    ],
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

    const fetchRisks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chatbot/risk-levels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Transform API data to match our frontend structure
        const transformedRisks = res.data.riskLevels.map(risk => ({
          ...risk,
          id: risk.id.toString(),
          riskScore: calculateRiskScore(risk.riskLevel),
          text: `${risk.disorder} assessment`,
          comments: [],
          acknowledged: false,
          recommendation: getRecommendation(risk.riskLevel, risk.disorder),
          timestamp: new Date(risk.timestamp).toISOString()
        }));
        
        setRiskData({
          userId: res.data.userId,
          count: res.data.count,
          riskLevels: transformedRisks
        });
      } catch (err) {
        console.error("Error fetching risks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRisks();
  }, []);

  const calculateRiskScore = (riskLevel) => {
    switch(riskLevel) {
      case "High Risk": return Math.floor(Math.random() * 30) + 70; // 70-100
      case "Moderate Risk": return Math.floor(Math.random() * 30) + 40; // 40-69
      case "Low Risk": return Math.floor(Math.random() * 39) + 1; // 1-39
      default: return 0;
    }
  };

  const getRecommendation = (riskLevel, disorder) => {
    const recommendations = {
      "High Risk": {
        "ADHD": "Immediate consultation with a specialist recommended for ADHD management.",
        "BPD": "Urgent psychiatric evaluation needed for Borderline Personality Disorder.",
        "OCD": "Schedule intensive therapy sessions for OCD symptoms.",
        "PTSD": "Immediate trauma-focused therapy recommended.",
        "Anxiety": "Urgent intervention for anxiety disorder needed.",
        "Autism": "Immediate consultation with a specialist recommended.",
        "Bipolar": "Urgent psychiatric evaluation needed.",
        "Depression": "Immediate intervention and possible medication review.",
        "Eating Disorders": "Urgent nutritional and psychological intervention required.",
        "Health": "Immediate medical consultation recommended.",
        "Mental Illness": "Urgent psychiatric evaluation needed.",
        "Schizophrenia": "Immediate psychiatric intervention required.",
        "Suicide Watch": "Emergency intervention and continuous monitoring needed."
      },
      "Moderate Risk": {
        "ADHD": "Behavioral therapy and possible medication evaluation recommended.",
        "BPD": "Regular dialectical behavior therapy sessions suggested.",
        "OCD": "Cognitive behavioral therapy recommended for OCD.",
        "PTSD": "Trauma-focused therapy and regular monitoring suggested.",
        "Anxiety": "Cognitive behavioral therapy and stress management recommended.",
        "Autism": "Regular monitoring and behavioral therapy suggested.",
        "Bipolar": "Regular check-ups and mood tracking recommended.",
        "Depression": "Therapy and lifestyle changes advised.",
        "Eating Disorders": "Nutritional counseling and therapy recommended.",
        "Health": "Regular medical check-ups and monitoring suggested.",
        "Mental Illness": "Regular psychiatric follow-ups recommended.",
        "Schizophrenia": "Regular antipsychotic medication monitoring needed.",
        "Suicide Watch": "Regular mental health check-ins and safety planning."
      },
      "Low Risk": {
        "ADHD": "Routine screening and organizational strategies suggested.",
        "BPD": "Emotional regulation techniques and self-monitoring recommended.",
        "OCD": "Mindfulness exercises may be beneficial.",
        "PTSD": "Stress management techniques and self-care recommended.",
        "Anxiety": "Relaxation techniques and regular self-assessment suggested.",
        "Autism": "Routine developmental screening suggested.",
        "Bipolar": "Self-monitoring and annual check-up recommended.",
        "Depression": "Regular self-assessment and support groups suggested.",
        "Eating Disorders": "Regular nutritional self-assessment recommended.",
        "Health": "Routine health check-ups and preventive care.",
        "Mental Illness": "Annual mental health screening recommended.",
        "Schizophrenia": "Regular self-monitoring for early symptoms.",
        "Suicide Watch": "Regular self-assessment and support network maintenance."
      }
    };
    
    return recommendations[riskLevel]?.[disorder] || "No specific recommendation available.";
  };

  const filteredRisks = useMemo(() => {
    return riskData.riskLevels.filter(risk => {
      // Risk Level Filter
      if (!filters.riskLevels.includes(risk.riskLevel)) return false;
      
      // Disorder Filter
      if (!filters.disorders.includes(risk.disorder)) return false;
      
      // Date Range Filter
      const riskDate = new Date(risk.timestamp);
      if (filters.dateRange[0] && riskDate < filters.dateRange[0]) return false;
      if (filters.dateRange[1] && riskDate > filters.dateRange[1]) return false;
      
      // Search Query Filter
      if (
        filters.searchQuery &&
        !risk.text.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      
      return true;
    });
  }, [riskData.riskLevels, filters]);

  const recentHighRisk = filteredRisks.filter((r) => r.riskLevel === "High Risk").slice(-3).reverse();

  const handleAddComment = (riskId) => {
    if (!newComment.trim()) return;
    
    setRiskData(prev => ({
      ...prev,
      riskLevels: prev.riskLevels.map(risk => 
        risk.id === riskId 
          ? { ...risk, comments: [...risk.comments, { 
              text: newComment, 
              timestamp: new Date().toISOString(),
              user: "Current User"
            }]}
          : risk
      )
    }));
    setNewComment("");
    setActiveAlertId(null);
  };

  const handleAcknowledge = (riskId) => {
    setRiskData(prev => ({
      ...prev,
      riskLevels: prev.riskLevels.map(risk => 
        risk.id === riskId ? { ...risk, acknowledged: true } : risk
      )
    }));
  };

  // Chart Data
  const chartData = {
    labels: filteredRisks.map((r) => new Date(r.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Risk Level Trend",
        data: filteredRisks.map((r) => {
          switch(r.riskLevel) {
            case "High Risk": return 3;
            case "Moderate Risk": return 2;
            case "Low Risk": return 1;
            default: return 0;
          }
        }),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value === 3 ? "#ef4444" : value === 2 ? "#f59e0b" : value === 1 ? "#10b981" : "#888";
        },
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const analyticsData = {
    labels: ["High Risk", "Moderate Risk", "Low Risk"],
    datasets: [{
      label: 'Risks by Level',
      data: [
        filteredRisks.filter(r => r.riskLevel === "High Risk").length,
        filteredRisks.filter(r => r.riskLevel === "Moderate Risk").length,
        filteredRisks.filter(r => r.riskLevel === "Low Risk").length
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

  const disorderDistributionData = {
    labels: [...new Set(filteredRisks.map(r => r.disorder))],
    datasets: [{
      label: 'Assessments by Disorder',
      data: [...new Set(filteredRisks.map(r => r.disorder))].map(disorder => 
        filteredRisks.filter(r => r.disorder === disorder).length
      ),
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(168, 85, 247, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(6, 182, 212, 0.7)'
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(6, 182, 212, 1)'
      ],
      borderWidth: 1
    }]
  };

  const riskLabels = {
    0: "No Data",
    1: "Low Risk",
    2: "Moderate Risk",
    3: "High Risk",
  };

  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case "High Risk": return "red";
      case "Moderate Risk": return "yellow";
      case "Low Risk": return "green";
      default: return "gray";
    }
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
                placeholder="Search assessments..."
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
              {["High Risk", "Moderate Risk", "Low Risk"].map(level => (
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
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Disorder Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Disorder Type</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                "ADHD", "BPD", "OCD", "PTSD", "Anxiety", 
                "Autism", "Bipolar", "Depression", "Eating Disorders", 
                "Health", "Mental Illness", "Schizophrenia", "Suicide Watch"
              ].map(disorder => (
                <label key={disorder} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.disorders.includes(disorder)}
                    onChange={() => {
                      const newDisorders = filters.disorders.includes(disorder)
                        ? filters.disorders.filter(d => d !== disorder)
                        : [...filters.disorders, disorder];
                      setFilters({...filters, disorders: newDisorders});
                    }}
                    className="rounded text-blue-600"
                  />
                  <span>{disorder}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Date Range Picker */}
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
                riskLevels: ["High Risk", "Moderate Risk", "Low Risk"],
                disorders: [
                  "ADHD", "BPD", "OCD", "PTSD", "Anxiety", 
                  "Autism", "Bipolar", "Depression", "Eating Disorders", 
                  "Health", "Mental Illness", "Schizophrenia", "Suicide Watch"
                ],
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
                  <span className="text-gray-600">Total Assessments:</span>
                  <span className="font-bold">{filteredRisks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Risk:</span>
                  <span className="font-bold text-red-600">
                    {filteredRisks.filter(r => r.riskLevel === "High Risk").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Moderate Risk:</span>
                  <span className="font-bold text-yellow-600">
                    {filteredRisks.filter(r => r.riskLevel === "Moderate Risk").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low Risk:</span>
                  <span className="font-bold text-green-600">
                    {filteredRisks.filter(r => r.riskLevel === "Low Risk").length}
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
                          filteredRisks.reduce((sum, r) => sum + r.riskScore, 0) / 
                          Math.max(filteredRisks.length, 1),
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
                      {filteredRisks.length > 0 
                        ? Math.round(filteredRisks.reduce((sum, r) => sum + r.riskScore, 0) / filteredRisks.length)
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
                  Recent High-Risk Assessments
                </h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Threshold: {userPreferences.alertThreshold}+
                </span>
              </div>
              {recentHighRisk.length > 0 ? (
                <ul className="space-y-3">
                  {recentHighRisk.map((r, i) => (
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
                            {new Date(r.timestamp).toLocaleString()}
                          </p>
                          <p className="font-medium">{r.disorder} Assessment</p>
                          <p className="text-sm text-gray-700">{r.text}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-600">{r.riskScore}</span>
                          <span className="block text-xs text-gray-500">Risk Score</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm font-medium">Recommendation:</p>
                        <p className="text-sm text-gray-700">{r.recommendation}</p>
                      </div>
                      
                      {/* Collaboration Features */}
                      <div className="mt-2 flex justify-between items-center">
                        <button 
                          onClick={() => setActiveAlertId(activeAlertId === r.id ? null : r.id)}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FaComment /> {r.comments.length} Comments
                        </button>
                        {!r.acknowledged && (
                          <button 
                            onClick={() => handleAcknowledge(r.id)}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                      
                      {/* Comment Section */}
                      {activeAlertId === r.id && (
                        <div className="mt-3">
                          <div className="max-h-40 overflow-y-auto mb-2 space-y-2">
                            {r.comments.length > 0 ? (
                              r.comments.map((comment, idx) => (
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
                              onClick={() => handleAddComment(r.id)}
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
                    No recent high-risk assessments detected.
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
                      min: 0,
                      max: 3,
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw;
                          const risk = filteredRisks[context.dataIndex];
                          return [
                            `Risk Level: ${riskLabels[value]}`,
                            `Disorder: ${risk.disorder}`,
                            `Score: ${risk.riskScore}`
                          ];
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
                Assessment History
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  Showing {filteredRisks.length} of {riskData.count} assessments
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <FaFileExport />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {filteredRisks.length > 0 ? (
                [...filteredRisks].reverse().map((r, i) => (
                  <motion.div
                    key={i}
                    className={`p-4 rounded-xl shadow-sm hover:shadow-md transition border-l-4 border-${getRiskColor(r.riskLevel)}-500 bg-white`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-start gap-3">
                      {r.riskLevel === "High Risk" && (
                        <FaExclamationCircle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                      )}
                      {r.riskLevel === "Moderate Risk" && (
                        <FaExclamationTriangle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
                      )}
                      {r.riskLevel === "Low Risk" && (
                        <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 mb-1">
                            {new Date(r.timestamp).toLocaleString()}
                          </p>
                          <span className={`font-bold text-${getRiskColor(r.riskLevel)}-600`}>
                            {r.riskScore} pts
                          </span>
                        </div>
                        <p className="font-medium">
                          <span className={`font-semibold text-${getRiskColor(r.riskLevel)}-600`}>
                            {r.riskLevel}
                          </span>{" "}
                          – <span className="text-gray-700">{r.disorder} Assessment</span>
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{r.text}</p>
                        
                        <div className="mt-2">
                          <p className="text-sm font-medium">Recommendation:</p>
                          <p className="text-sm text-gray-700">{r.recommendation}</p>
                        </div>
                        
                        {/* Collaboration Features */}
                        <div className="mt-2 flex justify-between items-center">
                          <button 
                            onClick={() => setActiveAlertId(activeAlertId === r.id ? null : r.id)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FaComment /> {r.comments.length} Comments
                          </button>
                          <div className="flex items-center gap-2">
                            {r.acknowledged ? (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Acknowledged
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleAcknowledge(r.id)}
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
                        {activeAlertId === r.id && (
                          <div className="mt-3">
                            <div className="max-h-40 overflow-y-auto mb-2 space-y-2">
                              {r.comments.length > 0 ? (
                                r.comments.map((comment, idx) => (
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
                                onClick={() => handleAddComment(r.id)}
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
                  <p className="text-gray-600">No assessments match your filters.</p>
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
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Risk Level Distribution</h3>
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
                <h3 className="text-xl font-semibold mb-4 text-blue-800">Disorder Distribution</h3>
                <div className="h-64">
                  <Bar 
                    data={disorderDistributionData}
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
            </div>
            
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Assessment Frequency Over Time</h3>
              <div className="h-64">
                <Line
                  data={{
                    labels: Array.from(new Set(filteredRisks.map(r => new Date(r.timestamp).toLocaleDateString()))),
                    datasets: [{
                      label: 'Assessments per Day',
                      data: Object.values(filteredRisks.reduce((acc, risk) => {
                        const date = new Date(risk.timestamp).toLocaleDateString();
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
