import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import AirIcon from "@mui/icons-material/Air";
import TimerIcon from "@mui/icons-material/Timer";
import ReplayIcon from "@mui/icons-material/Replay";
import BreathingAnimation from "../components/BreathingAnimation";

const exercises = [
  {
    name: "4-7-8 Breathing",
    duration: "4-7-8",
    color: "#D1E8E4",
    img: "/4-7-8-illustration.png",
  },
  {
    name: "Diaphragmatic Breathing",
    duration: "5-5",
    color: "#FFEBE7",
    img: "/diaphragmatic-breathing-illustration.png",
  },
  {
    name: "Alternate Nostril Breathing",
    duration: "4-4-4-4",
    color: "#E0D7F5",
    img: "/alternate-nostril-breathing-illustration.png",
  },
  {
    name: "Pursed-Lip Breathing",
    duration: "2-4",
    color: "#F7E6C4",
    img: "/pursed-lip-breathing-illustration.png",
  },
  {
    name: "Lion’s Breath",
    duration: "3-3",
    color: "#F8F4E1",
    img: "/lions-breath-illustration.png",
  },
  {
    name: "Humming Bee Breath",
    duration: "4-4",
    color: "#E4C1F9",
    img: "/humming-bee-breath-illustration.png",
  },
];

function calculateDuration(durationString) {
  return durationString
    .split("-")
    .map(Number)
    .reduce((acc, num) => acc + num, 0);
}

export default function BreathingExercise() {
  const [statuses, setStatuses] = useState(
    Array(exercises.length).fill("Pending")
  );
  const [timers, setTimers] = useState(Array(exercises.length).fill(0));
  const [totalTimes, setTotalTimes] = useState(Array(exercises.length).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((time, index) => {
          if (statuses[index] === "Ongoing" && time > 0) {
            return time - 1;
          }
          return time;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [statuses]);

  useEffect(() => {
    timers.forEach((time, index) => {
      if (time === 0 && statuses[index] === "Ongoing") {
        const newStatuses = [...statuses];
        newStatuses[index] = "Completed";
        setStatuses(newStatuses);
      }
    });
  }, [timers, statuses]);

  const handleStart = (index) => {
    const totalDuration = calculateDuration(exercises[index].duration);
    const newStatuses = [...statuses];
    newStatuses[index] = "Ongoing";
    setStatuses(newStatuses);

    const newTimers = [...timers];
    newTimers[index] = totalDuration;
    setTimers(newTimers);

    const newTotalTimes = [...totalTimes];
    newTotalTimes[index] = totalDuration;
    setTotalTimes(newTotalTimes);
  };

  const handleReset = (index) => {
    const newTimers = [...timers];
    newTimers[index] = totalTimes[index]; // Reset timer only
    setTimers(newTimers);

    const newStatuses = [...statuses];
    newStatuses[index] = "Pending"; // Reset status to "Pending"
    setStatuses(newStatuses);
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", maxWidth: 1200, margin: "auto" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, color: "#37474F" }}
        >
          <AirIcon sx={{ fontSize: 40, verticalAlign: "middle", mr: 1 }} />
          Breathing Exercises
        </Typography>
      </motion.div>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: 4,
        }}
      >
        {exercises.map((exercise, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 * index }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                bgcolor: exercise.color,
                borderRadius: "25px",
                p: 4,
                height: 360,
                overflow: "hidden",
                boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: "left" }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#37474F", mb: 1 }}
                >
                  {exercise.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "#455A64" }}>
                  Breathing Pattern: {exercise.duration} s
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, mb: 2, color: "#616161" }}
                >
                  Status: {statuses[index]}
                  {statuses[index] === "Ongoing" && (
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ ml: 1 }}
                      >
                        (Time left: {timers[index]}s)
                      </Typography>
                      <BreathingAnimation pattern={exercise.duration} />
                    </>
                  )}
                  {statuses[index] === "Completed" && (
                    <Typography variant="body2" sx={{ color: "#388E3C" }}>
                      Exercise Completed!
                    </Typography>
                  )}
                </Typography>

                {statuses[index] === "Ongoing" && (
                  <Box sx={{ width: "100%", mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        totalTimes[index] > 0
                          ? ((totalTimes[index] - timers[index]) /
                              totalTimes[index]) *
                            100
                          : 0
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#cfd8dc",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#37474F",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {`${Math.round(
                        ((totalTimes[index] - timers[index]) /
                          totalTimes[index]) *
                          100
                      )}%`}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    aria-label="Start breathing exercise"
                    sx={{
                      bgcolor: "#37474F",
                      borderRadius: "20px",
                      "&:hover": { bgcolor: "#263238" },
                      transition: "background 0.3s ease",
                      mr: 1,
                    }}
                    startIcon={<TimerIcon />}
                    onClick={() => handleStart(index)}
                    disabled={statuses[index] === "Ongoing"}
                  >
                    Start
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#37474F",
                      color: "#37474F",
                      borderRadius: "20px",
                      "&:hover": { bgcolor: "#37474F", color: "#fff" },
                      transition: "background 0.3s ease",
                    }}
                    startIcon={<ReplayIcon />}
                    onClick={() => handleReset(index)}
                    disabled={statuses[index] !== "Ongoing"}
                  >
                    Reset
                  </Button>
                </Box>
              </CardContent>

              <Box
  sx={{
    width: "55%",
    height: "100%",
    backgroundImage: `url(${exercise.img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "0 25px 25px 0",
  }}
/>

            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}