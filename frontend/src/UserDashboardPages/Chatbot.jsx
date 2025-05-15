import React, { useState } from "react";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaBrain,
  FaHeartbeat,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data,
      };

      const allMessages = [...updatedMessages, botMessage];
      setMessages(allMessages);

      await fetch("http://localhost:4000/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });
    } catch (error) {
      console.error("Error during chatbot communication:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderAssistantMessage = (data) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-4 rounded-lg shadow-md max-w-md"
    >
      <div className="space-y-3 text-sm text-gray-800">
        {/* Sentiment */}
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-full">
            <FaBrain />
          </div>
          <div>
            <strong>Sentiment:</strong>{" "}
            {data.sentiment} ({Math.round(data.sentiment_confidence)}%)
          </div>
        </div>

        {/* Disorder */}
        <div className="flex items-center space-x-2">
          <div className="bg-purple-600 text-white p-2 rounded-full">
            <FaHeartbeat />
          </div>
          <div>
            <strong>Disorder:</strong>{" "}
            {data.disorder} ({Math.round(data.disorder_confidence)}%)
          </div>
        </div>

        {/* Risk */}
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-500 text-white p-2 rounded-full">
            <FaExclamationTriangle />
          </div>
          <div>
            <strong>Risk Level:</strong> {data.risk}%
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-yellow-100 p-3 rounded-md">
          <strong>Explanation:</strong>
          <p className="text-xs mt-1">{data.lime_explanation}</p>
        </div>

        {/* Suggestions */}
        <div className="bg-green-100 p-3 rounded-md">
          <strong>Suggestions:</strong>
          <ul className="list-disc list-inside text-xs mt-1">
            {data.recommendations.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] text-gray-600 p-4 flex items-center">
        <FaArrowLeft className="cursor-pointer text-xl" onClick={() => navigate(-1)} />
        <h2 className="text-lg font-semibold ml-4">AI Chatbot</h2>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-transparent text-black"
            } p-3 rounded-lg max-w-md`}
          >
            {msg.role === "assistant"
              ? renderAssistantMessage(msg.content)
              : msg.content}
          </div>
        ))}
        {loading && <p className="text-gray-500">AI is typing...</p>}
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white shadow flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
