import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const BreathingAnimation = ({ pattern }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseName, setPhaseName] = useState("Inhale");

  const phases = pattern.split("-").map(Number);
  const labels = ["Inhale", "Hold", "Exhale", "Hold"]; // supports up to 4 phases

  useEffect(() => {
    let timeout;
    const updatePhase = () => {
      setPhaseName(labels[phaseIndex % labels.length]);
      timeout = setTimeout(() => {
        setPhaseIndex((prev) => (prev + 1) % phases.length);
      }, phases[phaseIndex % phases.length] * 1000);
    };

    updatePhase(); // initial
    return () => clearTimeout(timeout);
  }, [phaseIndex, pattern]);

  // Size animation for Inhale/Exhale
  const scale =
    phaseName === "Inhale" ? 1.6 : phaseName === "Exhale" ? 0.8 : 1;

  // Define colors for different phases with higher contrast
  const phaseColors = {
    Inhale: "#FF7043",  // Bright orange-red for inhale
    Hold: "#FFEB3B",    // Bright yellow for hold
    Exhale: "#4CAF50",  // Green for exhale
  };

  // Set emoji color based on phase
  const emojiColor =
    phaseName === "Inhale" ? phaseColors.Inhale :
    phaseName === "Hold" ? phaseColors.Hold :
    phaseName === "Exhale" ? phaseColors.Exhale : "#000"; // Default color

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 2,
        p: 2,
        width: "100%",
        maxWidth: 320,  // Max width to ensure it remains compact on larger screens
        margin: "auto",
        textAlign: "center",
      }}
    >
      <motion.div
        animate={{ scale }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          fontSize: "2.5rem", // Reduced emoji size further
          marginBottom: 12,
          color: emojiColor,  // Change the color of the emoji based on phase
        }}
      >
        {/* Breathing Emoji */}
        {phaseName === "Inhale" && "😮‍💨"} {/* Inhale phase emoji */}
        {phaseName === "Hold" && "😯"}        {/* Hold phase emoji */}
        {phaseName === "Exhale" && "😌"}      {/* Exhale phase emoji */}
      </motion.div>
      
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: "#37474F", // Darker color for better readability
          mb: 1,
          textTransform: "capitalize", // Makes the phase names more readable
        }}
      >
        {phaseName}
      </Typography>
    </Box>
  );
};

export default BreathingAnimation;