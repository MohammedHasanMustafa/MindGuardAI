import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Dumbbell, Brain, Theater, Sparkles, Star, Zap, ArrowRight } from "lucide-react";
import '../CopingStrategies.css';

// Category data with strategies and real images
const categories = [
  {
    label: "Emotional",
    icon: <Heart className="text-rose-500" size={24} />,
    color: "from-rose-500 to-pink-600",
    accent: "#ec4899",
    cardBg: "bg-gradient-to-br from-rose-50 to-pink-50",
    strategies: [
      { 
        name: "Practicing Gratitude", 
        description: "Focus on positive aspects of life to improve emotional well-being and shift perspective from what's lacking to what you have.", 
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Journaling Thoughts", 
        description: "Write your feelings to gain clarity, identify patterns in your emotions, and reduce stress through self-expression.", 
        img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Sharing with Others", 
        description: "Talking with someone you trust helps process complex emotions, gain new perspectives, and feel understood.", 
        img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Music Therapy", 
        description: "Music can uplift mood and promote relaxation by helping process emotions through rhythm and melody.", 
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&h=400&q=80" 
      },
    ],
  },
  {
    label: "Physical",
    icon: <Dumbbell className="text-emerald-500" size={24} />,
    color: "from-emerald-500 to-green-600",
    accent: "#10b981",
    cardBg: "bg-gradient-to-br from-emerald-50 to-green-50",
    strategies: [
      { 
        name: "Deep Breathing", 
        description: "Breathe slowly to activate your parasympathetic nervous system, reducing anxiety and promoting calmness.", 
        img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Progressive Relaxation", 
        description: "Systematically tense and release different muscle groups to reduce physical tension and increase body awareness.", 
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Regular Exercise", 
        description: "Physical activity releases endorphins and reduces stress hormones, improving both physical health and emotional resilience.", 
        img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Yoga Practice", 
        description: "Combines gentle movement with mindfulness to improve flexibility, balance, and mental clarity while reducing tension.", 
        img: "https://images.unsplash.com/photo-1599447417191-fed577237558?auto=format&fit=crop&w=600&h=400&q=80" 
      },
    ],
  },
  {
    label: "Cognitive",
    icon: <Brain className="text-amber-500" size={24} />,
    color: "from-amber-500 to-yellow-600",
    accent: "#f59e0b",
    cardBg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    strategies: [
      { 
        name: "Positive Affirmations", 
        description: "Replace negative self-talk with empowering statements to build confidence and train your mind toward constructive patterns.", 
        img: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Thought Challenging", 
        description: "Identify and question pessimistic thought patterns, looking for evidence that contradicts negative assumptions.", 
        img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Mindfulness Practice", 
        description: "Stay present in the moment without judgment to reduce anxiety about the past or future and improve mental clarity.", 
        img: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Cognitive Reframing", 
        description: "Look at challenges from different perspectives to find opportunities for growth and learning instead of focusing on difficulties.", 
        img: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?auto=format&fit=crop&w=600&h=400&q=80" 
      },
    ],
  },
  {
    label: "Behavioral",
    icon: <Theater className="text-blue-500" size={24} />,
    color: "from-blue-500 to-indigo-600",
    accent: "#3b82f6",
    cardBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    strategies: [
      { 
        name: "Engaging in Hobbies", 
        description: "Do something you love regularly to boost mood, creativity, and provide a healthy escape from daily stressors.", 
        img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Daily Routines", 
        description: "Structure your day with consistent patterns to create stability, reduce decision fatigue, and improve productivity.", 
        img: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Task Breakdown", 
        description: "Avoid feeling overwhelmed by dividing large projects into manageable pieces that can be accomplished one at a time.", 
        img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&h=400&q=80" 
      },
      { 
        name: "Nature Connection", 
        description: "Spend time in natural settings to reduce stress hormones, improve mood, and gain perspective on personal challenges.", 
        img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&h=400&q=80" 
      },
    ],
  },
];
export default function CopingStrategies() {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showIntro, setShowIntro] = useState(true);
  const scrollRef = useRef(null);
  // Parallax effect for header and mouse tracking
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Hide intro animation after 3.5 seconds
    const timer = setTimeout(() => setShowIntro(false), 3500);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);
  // Smooth scroll to content when tab changes
  useEffect(() => {
    if (isLoaded && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab, isLoaded]);
  // Set loaded state after initial render
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  // Variables for tilt effect based on mouse position
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const tiltX = (mousePosition.x - centerX) / 50;
  const tiltY = (mousePosition.y - centerY) / 50;
  // Function for staggered entrance animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  return (
    <>
      {/* Intro Animation Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
              className="relative p-10 md:p-16 rounded-2xl bg-white/30 backdrop-blur-lg shadow-xl border border-white/50 max-w-3xl w-full mx-4"
            >
              {/* Animated BG */}
              <motion.div 
                className="absolute -z-10 inset-0 rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <motion.rect
                    x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    fill="url(#gradient-pulse)"
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <defs>
                    <motion.linearGradient
                      id="gradient-pulse"
                      x1="0%"
                      y1="0%" 
                      x2="100%" 
                      y2="100%"
                      animate={{
                        x1: ["0%", "100%", "0%"],
                        y1: ["0%", "100%", "0%"],
                        x2: ["100%", "0%", "100%"],
                        y2: ["100%", "0%", "100%"]
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.2" />
                    </motion.linearGradient>
                  </defs>
                </svg>
              </motion.div>
              {/* Light Flare Effect */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply opacity-20 filter blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply opacity-20 filter blur-3xl"></div>
              {/* Main Content */}
              <motion.div 
                className="relative flex flex-col items-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  bounce: 0.4,
                  duration: 1 
                }}
              >
                {/* Icon with electric animation */}
                <motion.div
                  className="relative mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-lg border border-white/50"
                    animate={{ 
                      boxShadow: [
                        "0 10px 25px -5px rgba(124, 58, 237, 0.4)",
                        "0 10px 35px -5px rgba(236, 72, 153, 0.4)",
                        "0 10px 25px -5px rgba(124, 58, 237, 0.4)"
                      ]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 10, -10, 0],
                        scale: [1, 1.1, 1.1, 1.05, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="text-purple-500"
                    >
                      <Sparkles className="w-10 h-10" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Energy bursts */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-3 bg-indigo-400 rounded-full shadow-glow-md"
                      style={{
                        transformOrigin: "center bottom",
                        rotate: i * 60,
                        opacity: 0
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.7, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        repeatDelay: 2
                      }}
                    />
                  ))}
                </motion.div>
                {/* Title - No animation */}
                <div className="text-center mb-6 relative">
                  <div className="mb-2">
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 inline-block">
                      Coping
                    </h1>
                  </div>
                  
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600 inline-block">
                      Strategies
                    </h1>
                  </div>
                  {/* Static underline */}
                  <div
                    className="h-0.5 mt-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full mx-auto w-[60%]"
                  />
                </div>
                {/* Tagline with staggered animation */}
                <motion.p
                  className="text-lg md:text-xl text-slate-700 max-w-xl text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 }}
                >
                  Discover powerful techniques for managing stress and building resilience
                </motion.p>
                {/* Enter Button with pulsing animation */}
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium flex items-center gap-2 shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.6, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 15px 25px -5px rgba(124, 58, 237, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowIntro(false)}
                >
                  <span>Explore Now</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </motion.button>
                {/* Animated Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                        backgroundColor: [
                          '#c4b5fd', '#818cf8', '#a78bfa', '#e879f9', '#8b5cf6', '#d946ef'
                        ][Math.floor(Math.random() * 6)],
                        boxShadow: '0 0 4px currentColor',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -(20 + Math.random() * 30)],
                        x: [0, (Math.random() * 20 - 10)],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="light-modern-coping min-h-screen">
        {/* Enhanced Background with better layering */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50"></div>
          
          {/* Enhanced pattern overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSByPSIxIiBjeD0iMjAiIGN5PSIyMCIgZmlsbD0iIzgxOGNmOCIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
          
          {/* Improved floating elements with blend modes */}
          <motion.div 
            className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-40 blur-3xl mix-blend-multiply animate-float-slow"
            style={{ transform: `translate3d(${tiltX * -2}px, ${tiltY * -2}px, 0)` }}
          ></motion.div>
          <motion.div 
            className="absolute top-60 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-200 to-indigo-200 opacity-40 blur-3xl mix-blend-multiply animate-float-medium"
            style={{ transform: `translate3d(${tiltX * 2}px, ${tiltY * 2}px, 0)` }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-40 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-200 to-amber-200 opacity-40 blur-3xl mix-blend-multiply animate-float-fast"
            style={{ transform: `translate3d(${tiltX * -1.5}px, ${tiltY * -1.5}px, 0)` }}
          ></motion.div>
          
          {/* Enhanced particles */}
          <div className="light-stars-container">
            <div className="light-stars-small"></div>
            <div className="light-stars-medium"></div>
            <div className="light-stars-large"></div>
          </div>
        </div>
        <div className="relative container mx-auto px-4 py-12 md:py-20 max-w-7xl z-10">
          {/* Enhanced Header Section with animated entrance and parallax */}
          <motion.div 
            className="text-center mb-20 md:mb-24 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: showIntro ? 3 : 0 }}
            style={{ 
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
            {/* Enhanced sparkles decoration */}
            <motion.div 
              className="absolute -top-16 left-1/2 transform -translate-x-1/2"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <Sparkles className="text-amber-400 w-12 h-12" />
                <motion.div 
                  className="absolute inset-0 bg-amber-300 rounded-full blur-xl opacity-30"
                  animate={{ 
                    scale: [0.6, 1.2, 0.6],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity 
                  }}
                />
              </div>
            </motion.div>
            
            <div className="relative inline-block mb-6">
              {/* Modern professional title with animated gradient effect */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 tracking-wide relative overflow-hidden leading-snug font-[Poppins]">
                <span className="inline-block relative title-gradient-1">
                  Coping
                </span>{" "}
                <span className="inline-block ml-2 relative title-gradient-2">
                  Strategies
                </span>
                <div className="h-0.5 w-20 mt-2 rounded-full underline-gradient opacity-80"></div>
              </h1>
              
              {/* Enhanced circular glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full light-radial-pulse opacity-40"></div>
            </div>
            
            {/* Modern professional subtitle */}
            <p className="text-base md:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Discover evidence-based techniques to effectively manage stress, build resilience, and enhance your mental wellbeing in everyday life
            </p>
          </motion.div>
          
          {/* Enhanced Category Navigation with improved 3D hover */}
          <div ref={scrollRef} className="perspective-1200 mb-16 md:mb-20">
            <motion.div 
              className="mx-auto flex gap-2 md:gap-4 max-w-3xl overflow-x-auto px-2 py-2 scrollbar-hide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: showIntro ? 3.6 : 0.6 
              }}
            >
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  className={`relative px-4 py-3 rounded-xl min-w-[170px] transition-all duration-300 shadow-md ${
                    activeTab === index 
                      ? `text-white bg-gradient-to-br ${category.color}` 
                      : "text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg"
                  }`}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ 
                    y: -4,
                    rotateX: 5,
                    rotateY: tiltX,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: 0.1 * index
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {category.icon}
                    <span className="font-medium">{category.label}</span>
                  </div>
                  
                  {activeTab === index && (
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-[3px] rounded-full bg-white"
                      layoutId="underline"
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30 
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>
          
          {/* Strategy Cards Grid with Improved Animation and Interactivity */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {categories[activeTab].strategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="relative"
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                >
                  <motion.div 
                    className={`group rounded-2xl overflow-hidden h-full shadow-lg border border-white/30 transition-all duration-300 ${categories[activeTab].cardBg}`}
                    style={{ 
                      transformStyle: "preserve-3d",
                      transform: hoveredCardIndex === index ? 
                        `perspective(1000px) rotateX(${(mousePosition.y - centerY) / 30}deg) rotateY(${-(mousePosition.x - centerX) / 30}deg)` : "none",
                      transition: "transform 0.2s ease"
                    }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: `0 20px 30px -10px ${categories[activeTab].accent}25`,
                    }}
                  >
                    {/* Image with overlay */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img 
                        src={strategy.img} 
                        alt={strategy.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                     
                      {/* Floating icon indicator */}
                      <motion.div 
                        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md"
                        initial={{ opacity: 0, scale: 0, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.2 * index, duration: 0.6, type: "spring" }}
                      >
                        <Star 
                          className="text-white" 
                          size={16} 
                          fill="white" 
                          strokeWidth={0} 
                        />
                      </motion.div>
                    </div>
                    
                    {/* Content with improved spacing and animations */}
                    <div className="p-5 flex flex-col h-full">
                      <motion.h3 
                        className="font-bold text-lg md:text-xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {strategy.name}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-slate-600 text-sm leading-relaxed flex-grow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {strategy.description}
                      </motion.p>
                      
                      {/* Learn more link with animation */}
                      <motion.div 
                        className="mt-4 pt-3 border-t border-slate-200/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.button
                          className="group flex items-center gap-1 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                          whileHover={{ x: 3 }}
                        >
                          Learn more
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              repeatType: "reverse" 
                            }}
                          >
                            <ArrowRight size={14} className="text-indigo-600" />
                          </motion.span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
