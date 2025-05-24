import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ShieldIndicator from "../UserDashboardPages/ShieldIndicator";
import {
  FaSmileBeam,
  FaBrain,
  FaExclamationTriangle,
  FaChartLine,
  FaLightbulb,
  FaHistory,
  FaSync
} from "react-icons/fa";

const WellnessOverview = () => {
  const [analysisData, setAnalysisData] = useState({
    userId: null,
    count: 0,
    analyses: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/chatbot/results", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      // Parse recommendations from JSON string to array
      const parsedData = {
        ...response.data,
        analyses: response.data.analyses.map(analysis => ({
          ...analysis,
          recommendations: typeof analysis.recommendations === 'string' 
            ? JSON.parse(analysis.recommendations) 
            : analysis.recommendations || []
        }))
      };

      setAnalysisData(parsedData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching analysis results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Optional: Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Get the latest analysis (last item in array)
  const latestAnalysis = analysisData.analyses.length > 0 
    ? analysisData.analyses[analysisData.analyses.length - 1] 
    : {
        sentiment: "No data",
        sentimentConfidence: 0,
        disorder: "No data",
        disorderConfidence: 0,
        recommendations: [],
        riskLevel: "No data",
        timestamp: "",
        text: "No analysis available"
      };

  const mapSentimentToLevel = (sentiment) => {
    if (!sentiment) return "Low";
    const normalized = sentiment.toLowerCase();
    if (normalized.includes("positive")) return "Low";
    if (normalized.includes("neutral")) return "Medium";
    return "High";
  };

  const mapRiskToLevel = (risk) => {
    if (!risk) return "Low";
    const normalized = risk.toLowerCase();
    if (normalized.includes("high")) return "High";
    if (normalized.includes("moderate")) return "Medium";
    return "Low";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatConfidence = (confidence) => {
    return confidence ? `${confidence.toFixed(1)}%` : "N/A";
  };

  const cardBase = "bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center border border-white/30 hover:shadow-gray-600/40 hover:ring-2 hover:ring-gray-500/40 transition-all duration-300";

  const iconContainer = "w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/40 shadow-md";

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen p-6 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen p-6 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <motion.h2
          className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-500 drop-shadow tracking-tight"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Wellness Overview
        </motion.h2>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg transition-all"
        >
          <FaSync className={`${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Analysis Count and User Info */}
      <motion.div 
        className="bg-white/30 backdrop-blur-md rounded-xl shadow-md p-4 mb-10 max-w-md mx-auto text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-lg font-medium text-gray-700">
          You've completed <span className="font-bold text-indigo-600">{analysisData.count}</span> analysis{analysisData.count !== 1 ? 'es' : ''}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
        </p>
      </motion.div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <motion.div className={cardBase} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <div className={iconContainer}>
            <FaSmileBeam className="text-3xl text-[#34D399]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sentiment</h3>
          <ShieldIndicator
            level={mapSentimentToLevel(latestAnalysis.sentiment)}
            label={`${latestAnalysis.sentiment || "No data"} (${formatConfidence(latestAnalysis.sentimentConfidence)})`}
          />
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <div className={iconContainer}>
            <FaBrain className="text-3xl text-[#818CF8]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Potential Concern</h3>
          <ShieldIndicator
            level={mapRiskToLevel(latestAnalysis.riskLevel)}
            label={`${latestAnalysis.disorder || "No data"} (${formatConfidence(latestAnalysis.disorderConfidence)})`}
          />
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <div className={iconContainer}>
            <FaExclamationTriangle className="text-3xl text-[#F59E0B]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Risk Level</h3>
          <ShieldIndicator
            level={mapRiskToLevel(latestAnalysis.riskLevel)}
            label={latestAnalysis.riskLevel || "No data"}
          />
        </motion.div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <motion.div className={cardBase} whileHover={{ scale: 1.03 }}>
          <div className={iconContainer}>
            <FaHistory className="text-3xl text-blue-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-1">Analysis History</h4>
          <p className="text-gray-700 font-semibold text-lg">
            {analysisData.count} record{analysisData.count !== 1 ? 's' : ''}
          </p>
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.03 }}>
          <div className={iconContainer}>
            <FaLightbulb className="text-3xl text-emerald-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-1">Recommendations</h4>
          <div className="text-gray-700 font-medium leading-relaxed">
            {latestAnalysis.recommendations && latestAnalysis.recommendations.length > 0 ? (
              <ul className="list-disc list-inside text-left space-y-1">
                {latestAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            ) : (
              "No recommendations available"
            )}
          </div>
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.03 }}>
          <div className={iconContainer}>
            <FaChartLine className="text-3xl text-indigo-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-1">Latest Analysis</h4>
          <p className="text-gray-600 text-sm mb-2">{formatDate(latestAnalysis.timestamp)}</p>
          <div className="bg-white/50 rounded-lg p-3 text-left">
            <p className="text-gray-700 italic line-clamp-3">
              {latestAnalysis.text || "No analysis text available"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WellnessOverview;
