import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaExclamationCircle, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const RiskAnalysis = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/chatbot/risk-alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(res.data.alerts || []);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      }
    };

    fetchAlerts();
  }, []);

  const normalizeRiskLevel = (level) => {
    if (level.toLowerCase().includes("high")) return "High";
    if (level.toLowerCase().includes("moderate")) return "Moderate";
    return "Low";
  };

  const riskLevelToValue = (level) => {
    const normalized = normalizeRiskLevel(level);
    return normalized === "High" ? 3 : normalized === "Moderate" ? 2 : 1;
  };

  const riskLevelToColor = (level) => {
    const normalized = normalizeRiskLevel(level);
    return normalized === "High"
      ? "text-red-600"
      : normalized === "Moderate"
      ? "text-yellow-500"
      : "text-green-600";
  };

  const recentHighRisk = alerts
    .filter((a) => normalizeRiskLevel(a.riskLevel) === "High")
    .slice(-3)
    .reverse();

  const chartData = {
    labels: alerts.map((a) => new Date(a.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Risk Level Trend",
        data: alerts.map((a) => riskLevelToValue(a.riskLevel)),
        borderColor: "#3b82f6",
        backgroundColor: "#bfdbfe",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const riskLabels = {
    1: "Low",
    2: "Moderate",
    3: "High",
  };

  return (
    <div className="flex-1 min-h-screen p-6 bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-gray-800 transition-all duration-300">
      <motion.h2
        className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-500 mb-14 drop-shadow tracking-tight"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Risk Analysis Overview
      </motion.h2>

      {/* Recent Alerts */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-red-600 mb-3 flex items-center gap-2">
          <FaExclamationCircle className="text-2xl" />
          Recent High-Risk Alerts
        </h3>
        {recentHighRisk.length > 0 ? (
          <ul className="space-y-3">
            {recentHighRisk.map((a, i) => (
              <li
                key={i}
                className="bg-red-100 border-l-4 border-red-500 p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <strong>{new Date(a.createdAt).toLocaleString()}</strong> – {a.recommendation}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">✅ No recent high-risk alerts.</p>
        )}
      </motion.div>

      {/* Risk Level Trend Graph */}
      <motion.div
        className="bg-white shadow rounded p-5 mb-10"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
          Risk Level Trend Graph
        </h3>
        <Line
          data={chartData}
          options={{
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
          }}
          height={200}
        />
      </motion.div>

      {/* Timeline of All Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
          Timeline of Past Alerts & Recommendations
        </h3>
        <div className="space-y-4">
          {[...alerts].reverse().map((a, i) => {
            const normalized = normalizeRiskLevel(a.riskLevel);
            const colorClass = riskLevelToColor(a.riskLevel);
            const Icon =
              normalized === "High"
                ? FaExclamationCircle
                : normalized === "Moderate"
                ? FaExclamationTriangle
                : FaCheckCircle;

            return (
              <motion.div
                key={i}
                className="p-4 border border-gray-300 rounded bg-white/70 shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
                <p className="font-medium">
                  <Icon className={`${colorClass} inline mr-1`} />
                  <span className={`font-semibold ${colorClass}`}>
                    {normalized} Risk
                  </span>{" "}
                  – <span className="text-gray-700">{a.recommendation}</span>
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default RiskAnalysis;
