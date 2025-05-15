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
  FaFileAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssessmentHeatmap from "./AssessmentHeatmap";
import Chatbot from "./Chatbot";
import { useNavigate } from "react-router-dom"; 

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

const SelfAssessmentPage = () => {
  const [phq9, setPhq9] = useState(Array(9).fill(null));
  const [gad7, setGad7] = useState(Array(7).fill(null));
  const [mood, setMood] = useState(2);
  const [sleep, setSleep] = useState(2);
  const [energy, setEnergy] = useState(2);
  const [appetite, setAppetite] = useState(1);
  const [social, setSocial] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 

  const fetchAssessments = async () => {
    if (!token) return;
    try {
      const response = await axios.get("https://mindguardaibackend.onrender.com/api/assessment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    const updated = [...(setter === setPhq9 ? phq9 : gad7)];
    updated[index] = parseInt(value);
    setter(updated);
  };

  const calculateProgress = () => {
    const total = phq9.length + gad7.length;
    const answered = [...phq9, ...gad7].filter((val) => val !== null).length;
    return Math.round((answered / total) * 100);
  };

  const handleSubmit = async () => {
    if (phq9.includes(null) || gad7.includes(null)) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    setIsSubmitting(true);

    const assessmentData = {
      phq9,
      gad7,
      mood,
      sleep,
      energy,
      appetite,
      social,
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
      console.log(response.data.message);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting your assessment.");
    }

    setIsSubmitting(false);
  };

  const renderScale = (question, index, setter, values) => (
    <motion.div
      key={index}
      className="mb-4 p-4 rounded-lg bg-white shadow"
      whileHover={{ scale: 1.02 }}
    >
      <label className="font-medium text-gray-800 block mb-2">
        {index + 1}. {question}
      </label>
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((val) => (
          <label
            key={val}
            className="flex flex-col items-center text-sm text-gray-600"
          >
            <input
              type="radio"
              name={`${setter === setPhq9 ? "phq9" : "gad7"}-${index}`}
              value={val}
              checked={values[index] === val}
              onChange={(e) => handleChange(index, e.target.value, setter)}
              className="mb-1"
            />
            {val}
          </label>
        ))}
      </div>
    </motion.div>
  );

  const handleViewReportsClick = () => {
    navigate("/dashboard/reports"); // Navigate to the Reports page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] p-6">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Check In With Yourself
      </h1>

      {/* Chatbot Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="bg-[#297194] p-4 rounded-full shadow-lg text-[#297194] text-2xl"
        >
          <FaComments />
        </button>
      </div>

      {/* Show the Chatbot if isChatbotOpen is true */}
      {isChatbotOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50">
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="absolute top-2 right-2 text-gray-500 text-xl"
              >
                &times;
              </button>
              <Chatbot />
            </div>
          </div>
        </div>
      )}

      {/* View Reports Button */}
      <div className="absolute top-7 right-7 flex flex-col items-center">
        <button
          onClick={handleViewReportsClick} // Navigate to Reports page
          className="bg-white p-4 rounded-full shadow-lg text-[#297194] text-2xl mb-2"
        >
          <FaFileAlt className="text-[#297194]" />
        </button>
        <h3 className="text-white font-semibold text-lg">View Reports</h3>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Section: PHQ-9 and GAD-7 */}
        <div className="w-1/2 h-screen overflow-y-auto pr-4">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold text-center text-[#297194] mb-6">
              Self Assessment-Form
            </h1>

            {/* PHQ-9 Section */}
            <h2 className="text-xl font-semibold text-[#297194] mb-2">PHQ-9</h2>
            {phq9Questions.map((q, i) => renderScale(q, i, setPhq9, phq9))}

            {/* GAD-7 Section */}
            <h2 className="text-xl font-semibold text-[#297194] mt-6 mb-2">GAD-7</h2>
            {gad7Questions.map((q, i) => renderScale(q, i, setGad7, gad7))}
          </motion.div>
        </div>

        {/* Right Section: Daily Factors */}
        <div className="w-1/2 flex flex-col justify-end pl-2">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            {/* Daily Factors */}
            <h1 className="text-3xl font-bold text-center text-[#297194] mb-6">
              Daily Factors
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[{ label: "Mood", state: mood, setter: setMood, icon: <FaSmile className="text-yellow-500 text-2xl" /> }, { label: "Sleep", state: sleep, setter: setSleep, icon: <FaBed className="text-blue-500 text-2xl" /> }, { label: "Energy", state: energy, setter: setEnergy, icon: <FaBolt className="text-green-500 text-2xl" /> }, { label: "Appetite", state: appetite, setter: setAppetite, icon: <FaUtensils className="text-red-500 text-2xl" /> }, { label: "Social", state: social, setter: setSocial, icon: <FaUsers className="text-purple-500 text-2xl" /> }].map(({ label, state, setter, icon }, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow flex flex-col items-center transition-all duration-300"
                  whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-[#297194]/30 mb-2">
                    {icon}
                  </div>
                  <span className="font-semibold mt-2 text-[#297194]">{label}</span>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    value={state}
                    onChange={(e) => setter(parseInt(e.target.value))}
                    className="mt-2 w-full accent-[#297194]"
                  />
                  <span className="text-sm text-gray-700 font-medium">{state}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 mt-2 text-white font-bold rounded-lg transition duration-300 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#297194] hover:bg-[#21576f]"}`}
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment"}
          </button>
        </div>
      </div>

      {/* Display the Heatmap */}
      <div className="mt-10">
        <AssessmentHeatmap assessments={assessments} />
      </div>
    </div>
  );
};

export default SelfAssessmentPage;
