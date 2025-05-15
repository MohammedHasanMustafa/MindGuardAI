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
  FaHeartbeat,
  FaLightbulb,
} from "react-icons/fa";

const WellnessOverview = () => {
  const [overviewData, setOverviewData] = useState({
    sentiment: "",
    sentiment_confidence: 0,
    disorder: "",
    disorder_confidence: 0,
    risk: "",
    recommendations: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/chatbot/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOverviewData(response.data);
      } catch (error) {
        console.error("Error fetching chatbot results:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const mapSentimentToLevel = (sentiment) => {
    if (sentiment.toLowerCase() === "positive") return "Low";
    if (sentiment.toLowerCase() === "neutral") return "Medium";
    return "High";
  };

  const mapConfidenceToLevel = (confidence) => {
    if (confidence < 40) return "Low";
    if (confidence < 70) return "Medium";
    return "High";
  };

  // Function to map risk level to Low, Medium, or High
  const mapRiskToLevel = (risk) => {
    if (!risk) return "Low";
    const normalized = risk.toLowerCase();
    if (normalized === "high") return "high"; 
    if (normalized === "medium") return "medium"; 
    return "low"; // Default to "low"
  };

  const cardBase =
    "bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center border border-white/30 hover:shadow-gray-600/40 hover:ring-2 hover:ring-gray-500/40 transition-all duration-300";

  const iconContainer =
    "w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/40 shadow-md";

  return (
    <div className="flex-1 min-h-screen p-6 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-gray-800">
      <motion.h2
        className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-500 mb-14 drop-shadow tracking-tight"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Wellness Overview
      </motion.h2>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
        <motion.div className={cardBase} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <div className={iconContainer}>
            <FaSmileBeam className="text-3xl text-[#34D399]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sentiment</h3>
          <ShieldIndicator
            level={mapSentimentToLevel(overviewData.sentiment)}
            label={overviewData.sentiment}
          />
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <div className={iconContainer}>
            <FaBrain className="text-3xl text-[#818CF8]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Disorder</h3>
          <ShieldIndicator
            level={mapConfidenceToLevel(overviewData.disorder_confidence)}
            label={overviewData.disorder}
          />
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <div className={iconContainer}>
            <FaExclamationTriangle className="text-3xl text-[#F59E0B]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Risk Level</h3>
          <ShieldIndicator
            level={mapRiskToLevel(overviewData.risk)}  
            label={overviewData.risk}
          />
        </motion.div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <motion.div className={cardBase} whileHover={{ scale: 1.03 }}>
          <div className={iconContainer}>
            <FaChartLine className="text-3xl text-blue-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-1">Sentiment Confidence</h4>
          <p className="text-gray-700 font-semibold text-lg">
            {overviewData.sentiment_confidence.toFixed(2)}%
          </p>
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.03 }}>
          <div className={iconContainer}>
            <FaHeartbeat className="text-3xl text-indigo-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-1">Disorder Confidence</h4>
          <p className="text-gray-700 font-semibold text-lg">
            {overviewData.disorder_confidence.toFixed(2)}%
          </p>
        </motion.div>

        <motion.div className={cardBase} whileHover={{ scale: 1.03 }}>
          <div className={iconContainer}>
            <FaLightbulb className="text-3xl text-emerald-600" />
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-1">Top Recommendation</h4>
          <p className="text-gray-700 font-medium leading-relaxed">
            {overviewData.recommendations.length > 0
              ? overviewData.recommendations[0]
              : "No recommendations available"}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WellnessOverview;
