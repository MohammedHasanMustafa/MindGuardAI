import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ReportsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/chatbot/self-assessment/reports", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });

        setConversations(response.data.reports); 
      } catch (err) {
        setError("Failed to load conversations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]">
        <motion.div
          className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-600"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7]">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#297194] via-[#D1E1F7] to-[#E7F2F7] p-6">
      <motion.h1
        className="text-4xl font-bold text-center text-white mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        View Reports
      </motion.h1>

      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {conversations.length === 0 ? (
          <p className="text-center text-lg text-gray-500">No conversations found.</p>
        ) : (
          conversations.map((conversation, index) => (
            <motion.div
              key={index}
              className="mb-6 p-4 border rounded-lg shadow-sm hover:shadow-xl transform transition-all duration-500 ease-in-out hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-[#297194]">
                Conversation from {new Date(conversation.createdAt).toLocaleString()}
              </h3>

              {/* Display messages */}
              <div className="mt-4 space-y-4">
                {conversation.messages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start transition-all duration-300 ease-in-out transform"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {/* User Message */}
                    {message.role === "user" && (
                      <motion.div
                        className="flex-1 bg-blue-100 p-4 rounded-lg shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-semibold text-blue-700">You:</p>
                        <p>{message.content}</p>
                      </motion.div>
                    )}

                    {/* Chatbot Reply */}
                    {message.role === "assistant" && (
                      <motion.div
                        className="flex-1 bg-gray-100 p-4 rounded-lg shadow-sm ml-8"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="font-semibold text-gray-700">Chatbot:</p>
                        <p>{message.content}</p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default ReportsPage;
