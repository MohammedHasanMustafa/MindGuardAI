import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const shapes = [
    // Star
    "M10 0 L13 7 L20 7 L14 11 L17 18 L10 14 L3 18 L6 11 L0 7 L7 7 Z",
    // Leaf
    "M10 0 C12 5, 20 5, 10 20 C0 5, 8 5, 10 0 Z",
    // Cloud
    "M6 10 A4 4 0 0 1 10 6 A4 4 0 0 1 14 10 A4 4 0 0 1 18 14 H4 A4 4 0 0 1 6 10 Z",
    // Burst
    "M10 0 L13 7 L20 7 L14 11 L17 18 L10 14 L3 18 L6 11 L0 7 L7 7 Z",
    // Infinity
    "M5 10 C5 5, 10 5, 10 10 C10 15, 15 15, 15 10 C15 5, 10 5, 10 10",
  ];

  const items = [...Array(30)].map((_, i) => ({
    id: `shape-${i}`,
    path: shapes[i % shapes.length],
    left: `${Math.random() * 100}vw`,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shape Animation */}
      {items.map((item) => (
        <motion.svg
          key={item.id}
          className="absolute fill-current text-amber-300 opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          style={{
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
          }}
          animate={{
            y: ["-10vh", "110vh"],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <path d={item.path} />
        </motion.svg>
      ))}

      {/* Main Content Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full">
        {/* Left Side - Images */}
        <motion.div
          className="relative flex justify-center items-center w-[380px] h-[270px] mt-30"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Back Image */}
          <motion.img
            src="./ab2.jpg"
            className="absolute top-0 left-20 w-[290px] h-[190px] rounded-lg shadow-lg mt-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Front Image */}
          <motion.img
            src="./ab1.jpg"
            className="relative w-[320px] h-[220px] rounded-lg shadow-xl mt-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          />
        </motion.div>

        {/* Right Side - Text */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Heading Section */}
          <h1 className="text-4xl font-bold text-black">About</h1>
          <div className="w-20 h-1 bg-purple-700 mt-5 mb-8"></div>

          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed pt-10">
            The{" "}
            <span className="text-blue-400 font-semibold">
              Neuro-Linguistic Psychometric Adversarial Prognosis (NL-PAP)
              Framework
            </span>{" "}
            is an AI-powered system designed to predict and monitor mental
            health trends. By analyzing neuro-linguistic patterns and
            psychometric data, it provides data-driven insights for early
            detection of mood disorders.
          </p>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Using cutting-edge machine learning & deep learning models, NL-PAP
            detects sentiment volatility, emotional fluctuations, and mental
            health risks. With explainable AI insights, users and mental health
            professionals can track emotional patterns and intervene
            proactively.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
