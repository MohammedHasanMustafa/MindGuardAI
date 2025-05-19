import React, { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { useNavigate } from "react-router-dom"; 

import { loadSlim } from "tsparticles-slim";
import {
  Typography,
  Grid,
  Box,
  Container,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Filter,
  Volume2,
  Heart,
  Share2,
  Bookmark,
  Clock,
  User,
  Award,
  X,
} from "lucide-react";

const GuidedMeditation = () => {
  const navigate = useNavigate();
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [audioElement, setAudioElement] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const audioRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const audio = new Audio(
      "https://soundbible.com/mp3/Zen_Bell-SoundBible.com-2070036981.mp3"
    );
    audio.loop = true;
    setAudioElement(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, []);

  const handleMeditationSelect = (meditation) => {
    navigate(`/dashboard/guided-meditation/${meditation.id}`, { state: { meditation } });
  };

  const handlePlayAudio = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(432, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, 2000);

        audioElement
          .play()
          .catch((e) => console.log("Audio playback prevented by browser", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const meditationData = [
  // Morning (10 sessions)
  {
    id: 1,
    title: "Morning Serenity",
    duration: "15 min",
    level: "Beginner",
    description: "Start your day with clarity and purpose. This gentle meditation helps you set positive intentions for the day ahead.",
    image: "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg",
    category: "Morning",
    popularity: 4.8,
    totalListeners: "12.5k",
  },
  {
    id: 2,
    title: "Sunrise Meditation",
    duration: "10 min",
    level: "Beginner",
    description: "Greet the new day with this uplifting sunrise meditation to energize your morning.",
    image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    category: "Morning",
    popularity: 4.7,
    totalListeners: "9.8k",
  },
  {
    id: 3,
    title: "Morning Clarity",
    duration: "12 min",
    level: "Beginner",
    description: "Clear your mind and focus your thoughts for a productive day ahead.",
    image: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg",
    category: "Morning",
    popularity: 4.6,
    totalListeners: "8.2k",
  },
  {
    id: 4,
    title: "Energizing Morning",
    duration: "8 min",
    level: "Beginner",
    description: "A short burst of energy to start your morning feeling refreshed.",
    image: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
    category: "Morning",
    popularity: 4.5,
    totalListeners: "7.5k",
  },
  {
    id: 5,
    title: "Morning Gratitude",
    duration: "10 min",
    level: "Beginner",
    description: "Begin your day by cultivating gratitude and appreciation.",
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    category: "Morning",
    popularity: 4.9,
    totalListeners: "14.3k",
  },
  {
    id: 6,
    title: "Mindful Morning",
    duration: "15 min",
    level: "Intermediate",
    description: "Bring mindfulness to your morning routine with this practice.",
    image: "https://images.pexels.com/photos/268134/pexels-photo-268134.jpeg",
    category: "Morning",
    popularity: 4.7,
    totalListeners: "10.1k",
  },
  {
    id: 7,
    title: "Morning Stretch Meditation",
    duration: "18 min",
    level: "Intermediate",
    description: "Combine gentle stretching with meditation to awaken your body.",
    image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
    category: "Morning",
    popularity: 4.6,
    totalListeners: "8.7k",
  },
  {
    id: 8,
    title: "Morning Focus",
    duration: "10 min",
    level: "Intermediate",
    description: "Sharpen your focus for the day ahead with this concentration practice.",
    image: "https://images.pexels.com/photos/5904932/pexels-photo-5904932.jpeg",
    category: "Morning",
    popularity: 4.5,
    totalListeners: "7.9k",
  },
  {
    id: 9,
    title: "Morning Breathwork",
    duration: "12 min",
    level: "Advanced",
    description: "Energizing breathing techniques to start your day with vitality.",
    image: "https://images.pexels.com/photos/4098224/pexels-photo-4098224.jpeg",
    category: "Morning",
    popularity: 4.4,
    totalListeners: "6.8k",
  },
  {
    id: 10,
    title: "Sun Salutation Meditation",
    duration: "20 min",
    level: "Advanced",
    description: "Combine yoga sun salutations with meditation for a complete morning practice.",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
    category: "Morning",
    popularity: 4.7,
    totalListeners: "9.5k",
  },

  // Relaxation (10 sessions)
  {
    id: 11,
    title: "Deep Relaxation",
    duration: "20 min",
    level: "Intermediate",
    description: "Release tension and find deep relaxation with this guided practice designed to calm your nervous system.",
    image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg",
    category: "Relaxation",
    popularity: 4.9,
    totalListeners: "18.3k",
  },
  {
    id: 12,
    title: "Progressive Relaxation",
    duration: "15 min",
    level: "Beginner",
    description: "Systematically relax each part of your body from head to toe.",
    image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
    category: "Relaxation",
    popularity: 4.7,
    totalListeners: "12.6k",
  },
  {
    id: 13,
    title: "Ocean Waves Relaxation",
    duration: "25 min",
    level: "Beginner",
    description: "Let the sound of ocean waves carry you into deep relaxation.",
    image: "https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg",
    category: "Relaxation",
    popularity: 4.8,
    totalListeners: "15.2k",
  },
  {
    id: 14,
    title: "Forest Bathing Meditation",
    duration: "18 min",
    level: "Intermediate",
    description: "Immerse yourself in the calming energy of the forest.",
    image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    category: "Relaxation",
    popularity: 4.6,
    totalListeners: "10.4k",
  },
  {
    id: 15,
    title: "Tension Release",
    duration: "12 min",
    level: "Beginner",
    description: "Specifically designed to release physical tension and stress.",
    image: "https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg",
    category: "Relaxation",
    popularity: 4.5,
    totalListeners: "9.1k",
  },
  {
    id: 16,
    title: "Floating Cloud Relaxation",
    duration: "15 min",
    level: "Intermediate",
    description: "Visualize yourself floating on clouds for deep relaxation.",
    image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    category: "Relaxation",
    popularity: 4.7,
    totalListeners: "11.8k",
  },
  {
    id: 17,
    title: "Body Scan Relaxation",
    duration: "20 min",
    level: "Intermediate",
    description: "A guided journey through your body to release tension.",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
    category: "Relaxation",
    popularity: 4.8,
    totalListeners: "13.5k",
  },
  {
    id: 18,
    title: "Quick Relaxation",
    duration: "5 min",
    level: "Beginner",
    description: "A short but effective relaxation for busy moments.",
    image: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
    category: "Relaxation",
    popularity: 4.4,
    totalListeners: "8.3k",
  },
  {
    id: 19,
    title: "Deep Calm",
    duration: "30 min",
    level: "Advanced",
    description: "An extended practice for profound relaxation and calm.",
    image: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg",
    category: "Relaxation",
    popularity: 4.9,
    totalListeners: "16.7k",
  },
  {
    id: 20,
    title: "Peaceful Sanctuary",
    duration: "22 min",
    level: "Intermediate",
    description: "Create an inner sanctuary of peace and tranquility.",
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    category: "Relaxation",
    popularity: 4.7,
    totalListeners: "12.1k",
  },

  // Mindfulness (10 sessions)
  {
    id: 21,
    title: "Mindful Awareness",
    duration: "10 min",
    level: "All Levels",
    description: "Cultivate present moment awareness with this mindfulness practice that helps you stay grounded throughout your day.",
    image: "https://images.pexels.com/photos/268134/pexels-photo-268134.jpeg",
    category: "Mindfulness",
    popularity: 4.7,
    totalListeners: "9.2k",
  },
  {
    id: 22,
    title: "Breath Awareness",
    duration: "8 min",
    level: "Beginner",
    description: "A simple yet powerful practice of observing your breath to cultivate mindfulness.",
    image: "https://images.pexels.com/photos/4098224/pexels-photo-4098224.jpeg",
    category: "Mindfulness",
    popularity: 4.6,
    totalListeners: "8.5k",
  },
  {
    id: 23,
    title: "Mindful Walking",
    duration: "15 min",
    level: "Intermediate",
    description: "Bring mindfulness to movement with this guided walking meditation.",
    image: "https://images.pexels.com/photos/4720306/pexels-photo-4720306.jpeg",
    category: "Mindfulness",
    popularity: 4.5,
    totalListeners: "7.8k",
  },
  {
    id: 24,
    title: "Mindful Eating",
    duration: "10 min",
    level: "Beginner",
    description: "Bring full awareness to the experience of eating.",
    image: "https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg",
    category: "Mindfulness",
    popularity: 4.4,
    totalListeners: "6.9k",
  },
  {
    id: 25,
    title: "Mindful Listening",
    duration: "12 min",
    level: "Intermediate",
    description: "Develop deeper listening skills through mindfulness.",
    image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
    category: "Mindfulness",
    popularity: 4.3,
    totalListeners: "6.2k",
  },
  {
    id: 26,
    title: "Mindful Body Scan",
    duration: "20 min",
    level: "Intermediate",
    description: "Scan through your body with mindful awareness.",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
    category: "Mindfulness",
    popularity: 4.7,
    totalListeners: "10.3k",
  },
  {
    id: 27,
    title: "Mindful Pause",
    duration: "5 min",
    level: "Beginner",
    description: "A short mindfulness break for busy days.",
    image: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
    category: "Mindfulness",
    popularity: 4.5,
    totalListeners: "8.1k",
  },
  {
    id: 28,
    title: "Mindful Observation",
    duration: "10 min",
    level: "Beginner",
    description: "Practice observing your surroundings with full attention.",
    image: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg",
    category: "Mindfulness",
    popularity: 4.4,
    totalListeners: "7.4k",
  },
  {
    id: 29,
    title: "Mindful Emotions",
    duration: "15 min",
    level: "Intermediate",
    description: "Learn to observe your emotions with mindfulness.",
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    category: "Mindfulness",
    popularity: 4.6,
    totalListeners: "9.3k",
  },
  {
    id: 30,
    title: "Mindful Thoughts",
    duration: "12 min",
    level: "Intermediate",
    description: "Observe your thought patterns without judgment.",
    image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    category: "Mindfulness",
    popularity: 4.5,
    totalListeners: "8.6k",
  },

  // Sleep (10 sessions)
  {
    id: 31,
    title: "Healing Sleep",
    duration: "30 min",
    level: "All Levels",
    description: "Drift into restorative sleep with this calming meditation designed to release the day and prepare for deep rest.",
    image: "https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg",
    category: "Sleep",
    popularity: 4.9,
    totalListeners: "22.1k",
  },
  {
    id: 32,
    title: "Deep Sleep",
    duration: "45 min",
    level: "All Levels",
    description: "An extended meditation to guide you into deep, restorative sleep.",
    image: "https://images.pexels.com/photos/3802666/pexels-photo-3802666.jpeg",
    category: "Sleep",
    popularity: 4.8,
    totalListeners: "18.7k",
  },
  {
    id: 33,
    title: "Sleep Stories",
    duration: "25 min",
    level: "Beginner",
    description: "Gentle stories to lull you into peaceful sleep.",
    image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    category: "Sleep",
    popularity: 4.7,
    totalListeners: "15.3k",
  },
  {
    id: 34,
    title: "Insomnia Relief",
    duration: "20 min",
    level: "Intermediate",
    description: "Specifically designed to help with insomnia and sleep difficulties.",
    image: "https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg",
    category: "Sleep",
    popularity: 4.6,
    totalListeners: "13.8k",
  },
  {
    id: 35,
    title: "Power Nap",
    duration: "15 min",
    level: "Beginner",
    description: "A short meditation for a refreshing power nap.",
    image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
    category: "Sleep",
    popularity: 4.5,
    totalListeners: "12.1k",
  },
  {
    id: 36,
    title: "Sleep Reset",
    duration: "18 min",
    level: "Intermediate",
    description: "Reset your sleep patterns with this guided practice.",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
    category: "Sleep",
    popularity: 4.7,
    totalListeners: "14.6k",
  },
  {
    id: 37,
    title: "Ocean Sleep",
    duration: "35 min",
    level: "All Levels",
    description: "Fall asleep to the soothing sounds of ocean waves.",
    image: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
    category: "Sleep",
    popularity: 4.8,
    totalListeners: "17.2k",
  },
  {
    id: 38,
    title: "Sleep Sanctuary",
    duration: "25 min",
    level: "Intermediate",
    description: "Create an inner sanctuary for peaceful sleep.",
    image: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg",
    category: "Sleep",
    popularity: 4.6,
    totalListeners: "13.5k",
  },
  {
    id: 39,
    title: "Rainfall Sleep",
    duration: "40 min",
    level: "All Levels",
    description: "Gentle rainfall sounds to help you fall asleep naturally.",
    image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
    category: "Sleep",
    popularity: 4.9,
    totalListeners: "19.4k",
  },
  {
    id: 40,
    title: "Evening Wind Down",
    duration: "20 min",
    level: "Beginner",
    description: "Transition from day to night with this calming practice.",
    image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
    category: "Sleep",
    popularity: 4.7,
    totalListeners: "15.1k",
  },

  // Energy (10 sessions)
  {
    id: 41,
    title: "Chakra Balancing",
    duration: "25 min",
    level: "Advanced",
    description: "Harmonize your energy centers with this powerful chakra meditation that promotes overall wellbeing and vitality.",
    image: "https://images.pexels.com/photos/8474400/pexels-photo-8474400.jpeg",
    category: "Energy",
    popularity: 4.6,
    totalListeners: "7.8k",
  },
  {
    id: 42,
    title: "Energy Boost",
    duration: "10 min",
    level: "Beginner",
    description: "Quick energy boost for when you're feeling drained.",
    image: "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg",
    category: "Energy",
    popularity: 4.5,
    totalListeners: "7.1k",
  },
  {
    id: 43,
    title: "Solar Plexus Activation",
    duration: "15 min",
    level: "Intermediate",
    description: "Activate your core energy center for confidence and power.",
    image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg",
    category: "Energy",
    popularity: 4.4,
    totalListeners: "6.5k",
  },
  {
    id: 44,
    title: "Grounding Energy",
    duration: "12 min",
    level: "Beginner",
    description: "Connect with earth energy for stability and balance.",
    image: "https://images.pexels.com/photos/268134/pexels-photo-268134.jpeg",
    category: "Energy",
    popularity: 4.3,
    totalListeners: "5.9k",
  },
  {
    id: 45,
    title: "Reiki Energy Flow",
    duration: "20 min",
    level: "Advanced",
    description: "Channel healing energy through your body's energy system.",
    image: "https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg",
    category: "Energy",
    popularity: 4.7,
    totalListeners: "8.3k",
  },
  {
    id: 46,
    title: "Crystal Energy Meditation",
    duration: "18 min",
    level: "Intermediate",
    description: "Harness the energy of crystals in your meditation practice.",
    image: "https://images.pexels.com/photos/3802666/pexels-photo-3802666.jpeg",
    category: "Energy",
    popularity: 4.5,
    totalListeners: "7.2k",
  },
  {
    id: 47,
    title: "Meridian Activation",
    duration: "22 min",
    level: "Advanced",
    description: "Activate your body's energy meridians for optimal flow.",
    image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg",
    category: "Energy",
    popularity: 4.6,
    totalListeners: "7.9k",
  },
  {
    id: 48,
    title: "Pranic Breathing",
    duration: "15 min",
    level: "Intermediate",
    description: "Breathwork techniques to increase your vital energy.",
    image: "https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg",
    category: "Energy",
    popularity: 4.4,
    totalListeners: "6.7k",
  },
  {
    id: 49,
    title: "Aura Cleansing",
    duration: "20 min",
    level: "Advanced",
    description: "Cleanse and strengthen your energetic aura.",
    image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg",
    category: "Energy",
    popularity: 4.5,
    totalListeners: "7.3k",
  },
  {
    id: 50,
    title: "Energy Protection",
    duration: "12 min",
    level: "Intermediate",
    description: "Create energetic boundaries and protection.",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg",
    category: "Energy",
    popularity: 4.6,
    totalListeners: "8.1k",
  }
];

  const categories = [...new Set(meditationData.map((item) => item.category))];


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const filteredMeditations = selectedCategory
    ? meditationData.filter((item) => item.category === selectedCategory)
    : meditationData;

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredMeditations.length / itemsPerPage);
  const paginatedMeditations = filteredMeditations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const particlesOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.2,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(10px)",
            color: "white",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "white" }}
          >
            <X size={20} />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        <List>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Meditations" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Categories" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="My Library" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        <Box sx={{ p: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
          >
            Categories
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => {
                  handleCategorySelect(category);
                  setDrawerOpen(false);
                }}
                sx={{
                  bgcolor:
                    selectedCategory === category
                      ? "#a78bfa"
                      : "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  "&:hover": {
                    bgcolor:
                      selectedCategory === category
                        ? "#9061f9"
                        : "rgba(255, 255, 255, 0.2)",
                  },
                }}
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: 2,
              background: "linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 20px rgba(167, 139, 250, 0.3)",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Guided Meditation Journey
          </Typography>

          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 6,
              maxWidth: "800px",
              mx: "auto",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: { xs: "1.1rem", md: "1.5rem" },
            }}
          >
            Discover peace, clarity, and balance through our expertly crafted
            meditation experiences
          </Typography>
        </motion.div>

        {selectedMeditation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                mb: 8,
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                background: "rgba(15, 23, 42, 0.7)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Box
                    component="img"
                    src={selectedMeditation.image}
                    alt={selectedMeditation.title}
                    sx={{
                      width: "100%",
                      height: { xs: 200, md: 300 },
                      objectFit: "cover",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Clock size={16} />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {selectedMeditation.duration}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <User size={16} />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {selectedMeditation.totalListeners} listeners
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Award size={16} />
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {selectedMeditation.popularity}/5
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="overline" sx={{ color: "#a78bfa" }}>
                    {selectedMeditation.category} • {selectedMeditation.level}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    {selectedMeditation.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    {selectedMeditation.description}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      startIcon={<Heart size={18} />}
                      sx={{
                        bgcolor: "rgba(167, 139, 250, 0.2)",
                        color: "#a78bfa",
                        "&:hover": { bgcolor: "rgba(167, 139, 250, 0.3)" },
                      }}
                    >
                      Favorite
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Share2 size={18} />}
                      sx={{
                        bgcolor: "rgba(96, 165, 250, 0.2)",
                        color: "#60a5fa",
                        "&:hover": { bgcolor: "rgba(96, 165, 250, 0.3)" },
                      }}
                    >
                      Share
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Bookmark size={18} />}
                      sx={{
                        bgcolor: "rgba(248, 113, 113, 0.2)",
                        color: "#f87171",
                        "&:hover": { bgcolor: "rgba(248, 113, 113, 0.3)" },
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}

        <Box sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  position: "relative",
                  display: "inline-block",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "40%",
                    height: 3,
                    background:
                      "linear-gradient(90deg, #a78bfa 0%, transparent 100%)",
                    borderRadius: 4,
                  },
                }}
              >
                Featured Meditations
              </Typography>

              {!isMobile && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      ml: 2,
                    }}
                  >
                    <IconButton
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        "&.Mui-disabled": {
                          color: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      <ChevronLeft size={20} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      {currentPage} / {totalPages}
                    </Typography>
                    <IconButton
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        "&.Mui-disabled": {
                          color: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      <ChevronRight size={20} />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          </motion.div>

          <Grid container spacing={2}>
            <AnimatePresence>
              {paginatedMeditations.map((meditation, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2.4}
                  key={meditation.id}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    style={{ width: "100%" }}
                    onClick={() => handleMeditationSelect(meditation)}
                    >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: 230,
                        background: "rgba(30, 41, 59, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        minHeight: 360,
                        cursor: "pointer",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={meditation.image}
                        alt={meditation.title}
                        sx={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Box
                          sx={{
                            display: "inline-block",
                            bgcolor: "rgba(167, 139, 250, 0.15)",
                            color: "#a78bfa",
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: "0.65rem",
                            fontWeight: 500,
                            mb: 1,
                          }}
                        >
                          {meditation.category}
                        </Box>
                        <Typography
                          gutterBottom
                          variant="subtitle2"
                          component="div"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "white",
                          }}
                        >
                          {meditation.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          {meditation.description}
                        </Typography>
                        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255, 255, 255, 0.6)",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Volume2 size={14} /> {meditation.level}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {isMobile && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&.Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  <ChevronLeft size={20} />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {currentPage} / {totalPages}
                </Typography>
                <IconButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&.Mui-disabled": {
                      color: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  <ChevronRight size={20} />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: 600,
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "40%",
                  height: 3,
                  background:
                    "linear-gradient(90deg, #a78bfa 0%, transparent 100%)",
                  borderRadius: 4,
                },
              }}
            >
              Browse by Category
            </Typography>
          </motion.div>

          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={4} md={3} key={category}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      textAlign: "center",
                      background:
                        "linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(96, 165, 250, 0.2) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(96, 165, 250, 0.3) 100%)",
                      },
                    }}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "white",
                      }}
                    >
                      {category}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        mt: 1,
                      }}
                    >
                      {
                        meditationData.filter(
                          (item) => item.category === category
                        ).length
                      }{" "}
                      sessions
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default GuidedMeditation;
