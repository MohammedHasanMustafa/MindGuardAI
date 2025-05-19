import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaSmile,
  FaBed,
  FaBolt,
  FaUtensils,
  FaUsers,
  FaComments,
  FaChartLine,
  FaDownload,
  FaBook,
  FaMedal,
  FaCalendarAlt,
  FaHistory,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssessmentHeatmap from "./AssessmentHeatmap";
import Chatbot from "./Chatbot";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you're a failure",
  "Trouble concentrating on things like reading or TV",
  "Moving/speaking slowly or being very fidgety/restless",
  "Thoughts that you'd be better off dead or hurting yourself",
];

const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid something awful might happen",
];

const pssQuestions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that happened that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
];

const sleepQualityQuestions = [
  "How would you rate your sleep quality overall?",
  "How long did it take you to fall asleep last night?",
  "How many times did you wake up during the night?",
  "How rested did you feel upon waking up?",
];

const motivationalQuotes = [
  "Progress, not perfection, is what matters.",
  "You are stronger than you think.",
  "Small steps every day lead to big results.",
  "Your mental health is a priority.",
  "It's okay not to be okay. What matters is you're checking in with yourself.",
];

const SelfAssessmentPage = () => {
  const [phq9, setPhq9] = useState(Array(9).fill(null));
  const [gad7, setGad7] = useState(Array(7).fill(null));
  const [pss, setPss] = useState(Array(10).fill(null));
  const [sleepQuality, setSleepQuality] = useState(Array(4).fill(null));
  const [mood, setMood] = useState(2);
  const [sleep, setSleep] = useState(2);
  const [energy, setEnergy] = useState(2);
  const [appetite, setAppetite] = useState(1);
  const [social, setSocial] = useState(1);
  const [notes, setNotes] = useState("");
  const [currentModule, setCurrentModule] = useState("phq9");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    checkStreak();
  }, []);

  const checkStreak = async () => {
    if (!token) return;
    try {
      const response = await axios.get("https://mindguardaibackend.onrender.com/api/assessment/streak", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setStreakCount(response.data.streak);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  const fetchAssessments = async () => {
    if (!token) return;
    try {
      const response = await axios.get("https://mindguardaibackend.onrender.com/api/assessment", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAssessments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleChange = (index, value, setter) => {
    const updated = [...(setter === setPhq9 ? phq9 : 
                     setter === setGad7 ? gad7 : 
                     setter === setPss ? pss : 
                     sleepQuality)];
    updated[index] = parseInt(value);
    setter(updated);
  };

  const calculateProgress = () => {
    let total = 0;
    let answered = 0;
    
    switch(currentModule) {
      case 'phq9':
        total = phq9.length;
        answered = phq9.filter(val => val !== null).length;
        break;
      case 'gad7':
        total = gad7.length;
        answered = gad7.filter(val => val !== null).length;
        break;
      case 'pss':
        total = pss.length;
        answered = pss.filter(val => val !== null).length;
        break;
      case 'sleep':
        total = sleepQuality.length;
        answered = sleepQuality.filter(val => val !== null).length;
        break;
    }
    
    return total > 0 ? Math.round((answered / total) * 100) : 0;
  };

  const calculatePHQ9Score = () => {
    return phq9.reduce((sum, val) => sum + (val || 0), 0);
  };

  const calculateGAD7Score = () => {
    return gad7.reduce((sum, val) => sum + (val || 0), 0);
  };

  const generateFeedback = () => {
    const phq9Score = calculatePHQ9Score();
    const gad7Score = calculateGAD7Score();
    
    let feedback = {
      title: "Your Assessment Results",
      content: [],
      severity: "low",
      suggestions: [],
    };
    
    if (phq9Score >= 20) {
      feedback.content.push(`Your depression score (${phq9Score}) is in the severe range.`);
      feedback.severity = "high";
      feedback.suggestions.push("Consider reaching out to a mental health professional immediately.");
    } else if (phq9Score >= 15) {
      feedback.content.push(`Your depression score (${phq9Score}) is in the moderately severe range.`);
      feedback.severity = "moderate";
      feedback.suggestions.push("You might benefit from professional support or therapy.");
    } else if (phq9Score >= 10) {
      feedback.content.push(`Your depression score (${phq9Score}) is in the moderate range.`);
      feedback.severity = "moderate";
      feedback.suggestions.push("Consider self-help strategies or speaking with a counselor.");
    } else if (phq9Score >= 5) {
      feedback.content.push(`Your depression score (${phq9Score}) is in the mild range.`);
      feedback.suggestions.push("Mindfulness exercises might be helpful for you.");
    } else {
      feedback.content.push(`Your depression score (${phq9Score}) suggests minimal symptoms.`);
      feedback.suggestions.push("Continue with your current healthy habits.");
    }
    
    if (gad7Score >= 15) {
      feedback.content.push(`Your anxiety score (${gad7Score}) is in the severe range.`);
      feedback.severity = feedback.severity === "high" ? "high" : "moderate";
      feedback.suggestions.push("Consider anxiety management techniques or professional help.");
    } else if (gad7Score >= 10) {
      feedback.content.push(`Your anxiety score (${gad7Score}) is in the moderate range.`);
      feedback.severity = feedback.severity === "high" ? "high" : "moderate";
      feedback.suggestions.push("Breathing exercises and relaxation techniques may help.");
    } else if (gad7Score >= 5) {
      feedback.content.push(`Your anxiety score (${gad7Score}) is in the mild range.`);
      feedback.suggestions.push("Regular exercise can help manage mild anxiety.");
    } else {
      feedback.content.push(`Your anxiety score (${gad7Score}) suggests minimal symptoms.`);
    }
    
    if (phq9[8] >= 2 || gad7Score >= 15 || phq9Score >= 20) {
      feedback.severity = "high";
      feedback.emergency = true;
    }
    
    return feedback;
  };

  const handleSubmit = async () => {
    const currentAnswers = currentModule === 'phq9' ? phq9 : 
                         currentModule === 'gad7' ? gad7 : 
                         currentModule === 'pss' ? pss : 
                         sleepQuality;
    
    if (currentAnswers.includes(null)) {
      toast.error("Please answer all questions in the current section before submitting.");
      return;
    }

    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    setIsSubmitting(true);

    const assessmentData = {
      phq9: currentModule === 'phq9' ? phq9 : Array(9).fill(null),
      gad7: currentModule === 'gad7' ? gad7 : Array(7).fill(null),
      pss: currentModule === 'pss' ? pss : Array(10).fill(null),
      sleepQuality: currentModule === 'sleep' ? sleepQuality : Array(4).fill(null),
      mood,
      sleep,
      energy,
      appetite,
      social,
      notes,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        "https://mindguardaibackend.onrender.com/api/assessment",
        assessmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success("Assessment submitted successfully.");
      fetchAssessments();
      
      const feedback = generateFeedback();
      setFeedbackContent(feedback);
      setShowFeedback(true);
      
      checkStreak();
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting your assessment.");
    }

    setIsSubmitting(false);
  };

  const renderScale = (question, index, setter, values, tooltip = "") => (
    <motion.div
      key={index}
      className="mb-4 p-4 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-md"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start">
        <label className="font-medium text-gray-800 block mb-2 flex-1">
          {index + 1}. {question}
        </label>
        {tooltip && (
          <div className="group relative ml-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">?</span>
            <div className="absolute z-10 hidden group-hover:block bg-white p-2 rounded shadow-lg text-sm w-64">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((val) => (
          <label
            key={val}
            className={`flex flex-col items-center text-sm ${
              values[index] === val ? "text-indigo-600 font-bold" : "text-gray-600"
            }`}
          >
            <input
              type="radio"
              name={`${setter === setPhq9 ? "phq9" : 
                     setter === setGad7 ? "gad7" : 
                     setter === setPss ? "pss" : "sleep"}-${index}`}
              value={val}
              checked={values[index] === val}
              onChange={(e) => handleChange(index, e.target.value, setter)}
              className="mb-1 h-5 w-5 accent-indigo-500"
            />
            {val}
          </label>
        ))}
      </div>
    </motion.div>
  );

  const renderEmojiScale = (label, value, setter, emojis) => (
    <div className="mb-4 p-4 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-md">
      <label className="font-medium text-gray-800 block mb-2">{label}</label>
      <div className="flex justify-between">
        {emojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => setter(i)}
            className={`text-3xl p-2 rounded-full transition-all ${
              value === i ? "scale-125 bg-indigo-100 shadow-inner" : "hover:scale-110"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  const handleViewReports = () => {
    navigate("/dashboard/reports");
  };

  const handleViewResources = () => {
    navigate("/dashboard/Resources");
  };

  const handleViewHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleExportData = async () => {
    try {
      const response = await axios.get("https://mindguardaibackend.onrender.com/api/assessment/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mental_health_assessment.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error exporting data");
    }
  };

  const prepareChartData = () => {
    return assessments.map((assessment, i) => ({
      name: new Date(assessment.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: assessment.mood,
      sleep: assessment.sleep,
      energy: assessment.energy,
      phq9: assessment.phq9.reduce((a, b) => a + (b || 0), 0),
      gad7: assessment.gad7.reduce((a, b) => a + (b || 0), 0),
    })).slice(-7);
  };

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-6">
        <div>
          <h1 className="text-4xl font-bold text-center text-white drop-shadow-lg">
            Mental Health Check-In
          </h1>
          <div className="text-center text-white italic mt-2 text-lg">
            "{currentQuote}"
          </div>
        </div>
        
        {streakCount > 0 && (
          <div className="flex items-center bg-white bg-opacity-90 px-4 py-2 rounded-full shadow-md mt-4 md:mt-0">
            <FaMedal className="text-yellow-500 text-2xl mr-2" />
            <span className="font-bold text-gray-800">{streakCount} day streak</span>
          </div>
        )}
      </div>

      <div className="fixed top-6 right-6 flex flex-col space-y-4 z-30">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="tooltip"
          data-tip="View Reports"
        >
          <button
            onClick={handleViewReports}
            className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg text-indigo-600 text-xl hover:bg-opacity-100 transition-all"
          >
            <FaChartLine />
          </button>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="tooltip"
          data-tip="Resources"
        >
          <button
            onClick={handleViewResources}
            className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg text-indigo-600 text-xl hover:bg-opacity-100 transition-all"
          >
            <FaBook />
          </button>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="tooltip"
          data-tip="History"
        >
          <button
            onClick={handleViewHistory}
            className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg text-indigo-600 text-xl hover:bg-opacity-100 transition-all"
          >
            <FaHistory />
          </button>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="tooltip"
          data-tip="Export Data"
        >
          <button
            onClick={handleExportData}
            className="bg-white bg-opacity-90 p-3 rounded-full shadow-lg text-indigo-600 text-xl hover:bg-opacity-100 transition-all"
          >
            <FaDownload />
          </button>
        </motion.div>
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="bg-white bg-opacity-90 p-4 rounded-full shadow-lg text-indigo-600 text-2xl hover:bg-opacity-100 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaComments />
        </motion.button>
      </div>

      {isChatbotOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center p-4">
          <motion.div 
            className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setIsChatbotOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <Chatbot />
          </motion.div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex justify-center items-center p-4">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowHistory(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Assessment History</h2>
            
            {assessments.length > 0 ? (
              <div className="space-y-4">
                {assessments.slice().reverse().map((assessment, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-indigo-700">
                        {new Date(assessment.timestamp).toLocaleString()}
                      </h3>
                      <div className="flex space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Mood: {assessment.mood}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Sleep: {assessment.sleep}
                        </span>
                      </div>
                    </div>
                    {assessment.notes && (
                      <p className="text-gray-600 text-sm">{assessment.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No assessment history available
              </div>
            )}
          </motion.div>
        </div>
      )}

      {showFeedback && feedbackContent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-40 flex justify-center items-center p-4">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => setShowFeedback(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">{feedbackContent.title}</h2>
            
            <div className="mb-4 space-y-2">
              {feedbackContent.content.map((line, i) => (
                <p key={i} className="text-gray-700">{line}</p>
              ))}
            </div>
            
            {feedbackContent.suggestions.length > 0 && (
              <div className={`p-4 rounded-lg mb-4 ${
                feedbackContent.severity === "high" ? "bg-red-50 border-l-4 border-red-500" : 
                feedbackContent.severity === "moderate" ? "bg-yellow-50 border-l-4 border-yellow-500" : 
                "bg-green-50 border-l-4 border-green-500"
              }`}>
                <h3 className="font-semibold mb-2 text-gray-800">Suggestions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {feedbackContent.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedbackContent.emergency && (
              <div className="bg-red-50 p-4 rounded-lg mb-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-red-700 mb-2">Important Notice</h3>
                <p className="text-red-700">
                  Your responses indicate you may benefit from speaking with a mental health professional. 
                  Consider reaching out to a counselor or therapist for support.
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowFeedback(false)}
              className="mt-4 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6">
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6"
          >
            <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
              Self Assessment
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "phq9", label: "PHQ-9" },
                { id: "gad7", label: "GAD-7" },
                { id: "pss", label: "PSS" },
                { id: "sleep", label: "Sleep" },
              ].map((module) => (
                <motion.button
                  key={module.id}
                  onClick={() => setCurrentModule(module.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    currentModule === module.id 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {module.label}
                </motion.button>
              ))}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-indigo-700">
                  Progress ({calculateProgress()}%)
                </span>
                <span className="text-sm font-medium text-indigo-700">
                  {currentModule === "phq9" 
                    ? `${phq9.filter(val => val !== null).length}/${phq9.length}` 
                    : currentModule === "gad7" 
                      ? `${gad7.filter(val => val !== null).length}/${gad7.length}`
                      : currentModule === "pss"
                        ? `${pss.filter(val => val !== null).length}/${pss.length}`
                        : `${sleepQuality.filter(val => val !== null).length}/${sleepQuality.length}`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
            
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              {currentModule === "phq9" && phq9Questions.map((q, i) => 
                renderScale(q, i, setPhq9, phq9, "Over the last 2 weeks, how often have you been bothered by this problem?")
              )}
              
              {currentModule === "gad7" && gad7Questions.map((q, i) => 
                renderScale(q, i, setGad7, gad7, "Over the last 2 weeks, how often have you been bothered by this problem?")
              )}
              
              {currentModule === "pss" && pssQuestions.map((q, i) => 
                renderScale(q, i, setPss, pss, "In the last month, how often have you felt this way?")
              )}
              
              {currentModule === "sleep" && (
                <>
                  {sleepQualityQuestions.map((q, i) => 
                    renderScale(q, i, setSleepQuality, sleepQuality, "Rate your experience over the last night")
                  )}
                  
                  {renderEmojiScale(
                    "How refreshed did you feel this morning?",
                    sleepQuality[3] || 0,
                    (val) => {
                      const updated = [...sleepQuality];
                      updated[3] = val;
                      setSleepQuality(updated);
                    },
                    ["😫", "😞", "😐", "🙂", "😊"]
                  )}
                </>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-6"
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Additional Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional thoughts, feelings, or context about your current state..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              rows="4"
            />
          </motion.div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.div
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6"
            whileHover={{ scale: 1.01 }}
          >
            <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
              Daily Factors
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { 
                  label: "Mood", 
                  state: mood, 
                  setter: setMood, 
                  icon: <FaSmile className="text-yellow-500 text-2xl" />,
                  emojis: ["😭", "😞", "😐", "🙂", "😊"],
                  color: "yellow"
                }, 
                { 
                  label: "Sleep", 
                  state: sleep, 
                  setter: setSleep, 
                  icon: <FaBed className="text-blue-500 text-2xl" />,
                  emojis: ["😴", "🛌", "🛏️", "💤", "🌙"],
                  color: "blue"
                }, 
                { 
                  label: "Energy", 
                  state: energy, 
                  setter: setEnergy, 
                  icon: <FaBolt className="text-green-500 text-2xl" />,
                  emojis: ["😴", "😩", "😐", "🙂", "💪"],
                  color: "green"
                }, 
                { 
                  label: "Appetite", 
                  state: appetite, 
                  setter: setAppetite, 
                  icon: <FaUtensils className="text-red-500 text-2xl" />,
                  emojis: ["🤢", "😖", "😐", "🙂", "😋"],
                  color: "red"
                }, 
                { 
                  label: "Social", 
                  state: social, 
                  setter: setSocial, 
                  icon: <FaUsers className="text-purple-500 text-2xl" />,
                  emojis: ["🏠", "😔", "😐", "🙂", "💃"],
                  color: "purple"
                }
              ].map(({ label, state, setter, icon, emojis, color }, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center transition-all duration-300 border-t-4 border-indigo-200 hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center shadow-inner mb-2`}>
                    {icon}
                  </div>
                  <span className="font-semibold mt-2 text-indigo-800">{label}</span>
                  
                  <div className="flex justify-between w-full mt-2">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => setter(idx)}
                        className={`text-lg transition-all ${
                          state === idx ? "scale-125 text-indigo-600" : "hover:scale-110"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={state}
                    onChange={(e) => setter(parseInt(e.target.value))}
                    className="mt-2 w-full accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">{state}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 text-white font-bold rounded-lg transition-all ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : "Submit Assessment"}
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-6 flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Your Trends</h2>
            
            {assessments.length > 0 ? (
              <>
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#4f46e5' }} 
                        tickMargin={10}
                      />
                      <YAxis 
                        tick={{ fill: '#4f46e5' }}
                        tickMargin={10}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderColor: '#4f46e5',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sleep" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="energy" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">PHQ-9 & GAD-7 Scores</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#4f46e5' }} 
                          tickMargin={10}
                        />
                        <YAxis 
                          tick={{ fill: '#4f46e5' }}
                          tickMargin={10}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#fff',
                            borderColor: '#4f46e5',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="phq9" 
                          stroke="#ff6b6b" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="gad7" 
                          stroke="#48dbfb" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">Assessment Heatmap</h3>
                  <AssessmentHeatmap assessments={assessments} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FaCalendarAlt className="text-4xl mb-2" />
                <p>Complete your first assessment to see trends</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessmentPage;
