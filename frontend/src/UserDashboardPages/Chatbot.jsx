import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaBrain,
  FaHeartbeat,
  FaExclamationTriangle,
  FaLightbulb,
  FaHistory,
  FaSync,
  FaInfoCircle
} from "react-icons/fa";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [pastResults, setPastResults] = useState([]);
  const [expandedExplanation, setExpandedExplanation] = useState(null);

  const fetchPastResults = async () => {
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

      setPastResults(response.data.analyses);
    } catch (error) {
      console.error("Error fetching past results:", error);
    }
  };

  useEffect(() => {
    fetchPastResults();
  }, [navigate]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/chatbot/analyze",
        { text: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      const botMessage = {
        role: "assistant",
        content: response.data
      };

      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error("Error during analysis:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: {
          text: "We encountered an error processing your request",
          sentiment: "Error",
          sentiment_confidence: 0,
          disorder: "Error",
          disorder_confidence: 0,
          risk_level: "Unknown",
          recommendations: ["Please try again later"],
          alert: "Analysis failed",
          explanations: {}
        }
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadPastResult = (result) => {
    setMessages([
      {
        role: "user",
        content: result.text
      },
      {
        role: "assistant",
        content: result
      }
    ]);
    setHistoryOpen(false);
  };

  const renderExplanationFeatures = (features) => {
    if (!features || !Array.isArray(features)) return null;
    
    return (
      <div className="space-y-2">
        {features.map((feature, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-gray-700">{feature[0]}</span>
            <span 
              className={`font-medium px-2 py-1 rounded ${
                feature[1] > 0 
                  ? 'bg-green-100/50 text-green-700' 
                  : 'bg-red-100/50 text-red-700'
              }`}
            >
              {feature[1] > 0 ? '+' : ''}{feature[1].toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderAssistantMessage = (data) => {
    const getRiskColor = (risk) => {
      switch (risk) {
        case 'High Risk': return 'bg-red-100/50 ring-red-200/50 text-red-600';
        case 'Moderate Risk': return 'bg-yellow-100/50 ring-yellow-200/50 text-yellow-600';
        case 'Low Risk': return 'bg-green-100/50 ring-green-200/50 text-green-600';
        default: return 'bg-gray-100/50 ring-gray-200/50 text-gray-600';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/30"
      >
        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100/50 backdrop-blur-md ring-2 ring-blue-200/50">
              <FaBrain className="text-blue-600 text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Sentiment Analysis</h4>
              <div className="mt-2">
                <p className="text-gray-700">
                  <span className="font-semibold">{data.sentiment}</span> ({data.sentiment_confidence.toFixed(1)}% confidence)
                </p>
              </div>
            </div>
          </div>

          {/* Disorder Detection */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100/50 backdrop-blur-md ring-2 ring-purple-200/50">
              <FaHeartbeat className="text-purple-600 text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Potential Concern</h4>
              <div className="mt-2">
                <p className="text-gray-700">
                  <span className="font-semibold">{data.disorder}</span> ({data.disorder_confidence.toFixed(1)}% confidence)
                </p>
              </div>
            </div>
          </div>

          {/* Risk Level */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-md ring-2 ${getRiskColor(data.risk_level)}`}>
              <FaExclamationTriangle className="text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">Risk Assessment</h4>
              <div className="mt-2">
                <div className={`px-3 py-1 rounded-full inline-flex items-center ${getRiskColor(data.risk_level)}`}>
                  <span className="font-medium">{data.risk_level}</span>
                </div>
                {data.alert && (
                  <p className="text-sm mt-1 text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle /> {data.alert}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* LIME Explanations */}
          {data.explanations && (
            <div className="space-y-4">
              {/* Sentiment Explanation */}
              {data.explanations.sentiment && (
                <div className="mt-4 bg-white/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaLightbulb className="text-indigo-600" />
                    <h4 className="font-medium text-gray-800">Sentiment Influencers</h4>
                  </div>
                  <div className="mb-2 text-sm text-gray-600 flex items-center gap-1">
                    <FaInfoCircle /> Words that influenced the sentiment analysis
                  </div>
                  {data.explanations.sentiment.rawExplanation?.explanation ? (
                    renderExplanationFeatures(
                      data.explanations.sentiment.rawExplanation.explanation[0].features
                    )
                  ) : (
                    <p className="text-gray-500">No detailed explanation available</p>
                  )}
                </div>
              )}

              {/* Disorder Explanation */}
              {data.explanations.disorder && (
                <div className="mt-4 bg-white/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaLightbulb className="text-indigo-600" />
                    <h4 className="font-medium text-gray-800">Disorder Indicators</h4>
                  </div>
                  <div className="mb-2 text-sm text-gray-600 flex items-center gap-1">
                    <FaInfoCircle /> Phrases that contributed to the disorder detection
                  </div>
                  {data.explanations.disorder.rawExplanation?.explanation ? (
                    renderExplanationFeatures(
                      data.explanations.disorder.rawExplanation.explanation[0].features
                    )
                  ) : (
                    <p className="text-gray-500">No detailed explanation available</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {data.recommendations?.length > 0 && (
            <div className="mt-4 bg-white/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaLightbulb className="text-emerald-600" />
                <h4 className="font-medium text-gray-800">Recommendations</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {data.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const cardBase = "bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/30";

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] relative">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all"
          >
            <FaArrowLeft className="text-gray-700 text-xl" />
          </button>
          <motion.h2
            className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-500 drop-shadow tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            MindGuard Chat
          </motion.h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchPastResults}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all"
            title="Refresh"
          >
            <FaSync className={`text-gray-700 text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setHistoryOpen(!historyOpen)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all"
            title="History"
          >
            <FaHistory className="text-gray-700 text-xl" />
          </button>
        </div>
      </div>

      {/* History Panel */}
      {historyOpen && (
        <div className="absolute top-24 right-6 w-80 bg-white/40 backdrop-blur-md rounded-3xl shadow-xl z-10 max-h-[70vh] overflow-y-auto border border-white/30">
          <div className="p-4 border-b border-white/30 font-semibold text-gray-700">Past Analyses</div>
          {pastResults.length > 0 ? (
            <ul>
              {pastResults.map((result) => (
                <li 
                  key={result.id}
                  className="p-4 border-b border-white/30 hover:bg-white/30 cursor-pointer transition-all"
                  onClick={() => loadPastResult(result)}
                >
                  <div className="font-medium text-gray-800 truncate">{result.text}</div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{result.sentiment}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-600">No past analyses found</div>
          )}
        </div>
      )}

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="max-w-md bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/30">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to MindGuard</h3>
              <p className="text-gray-700 mb-6">
                Share your thoughts or feelings, and I'll analyze them for mental health insights.
                Your conversations are private and secure.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto"></div>
            </div>
          </motion.div>
        )}
        
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {msg.role === "user" ? (
              <div className={`${cardBase} bg-blue-100/50 border-blue-200/50 max-w-md`}>
                <p className="text-gray-800">{msg.content}</p>
              </div>
            ) : (
              renderAssistantMessage(msg.content)
            )}
          </motion.div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className={`${cardBase} max-w-xs`}>
              <div className="flex space-x-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-6">
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your thoughts or feelings..."
            className="flex-1 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-lg"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
