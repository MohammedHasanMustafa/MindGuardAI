import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Heart, Dumbbell, Brain, Theater, Sparkles, Star, Zap, 
  ArrowRight, Bookmark, ChevronDown, Play, Pencil, 
  Share2, Music, Activity, Shrub, ListChecks, CalendarDays, Headphones 
} from "lucide-react";
import '../CopingStrategies.css';

const categories = [
  {
    label: "Emotional",
    icon: <Heart className="text-rose-500" size={24} />,
    color: "from-rose-500 to-pink-600",
    accent: "#ec4899",
    cardBg: "bg-gradient-to-br from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    strategies: [
      { 
        name: "Practicing Gratitude", 
        description: "Boost positivity by reflecting on things you're thankful for.", 
        icon: "💓",
        detailedDescription: "Focus on positive aspects of life to improve emotional well-being and shift perspective from what's lacking to what you have.",
        steps: [
          "Set aside 5-10 minutes each day",
          "Write down 3 things you're grateful for",
          "Reflect on why you appreciate each one",
          "Notice how this makes you feel"
        ],
        img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Pencil size={16} />,
        actionText: "Gratitude Journal",
        actionLink: "https://penzu.com/gratitude-journal",
        podcastLinks: [
          {
            title: "The Science of Gratitude",
            url: "https://open.spotify.com/episode/5GYvrvQmFQmD77vpsiMn59",
            source: "Spotify"
          },
          {
            title: "Daily Gratitude Practice",
            url: "https://open.spotify.com/show/7sZI7am9RxFkuCz87xDlQ5",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Journaling Thoughts", 
        description: "Express and understand emotions through writing.", 
        icon: "📝",
        detailedDescription: "Write your feelings to gain clarity, identify patterns in your emotions, and reduce stress through self-expression.",
        steps: [
          "Find a quiet space with no distractions",
          "Write freely without filtering",
          "Explore your emotional reactions",
          "Look for patterns over time"
        ],
        img: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Pencil size={16} />,
        actionText: "Start Journaling",
        actionLink: "https://www.reflection.app",
        podcastLinks: [
          {
            title: "The Power of Journaling",
            url: "https://open.spotify.com/show/0WCuhSxhEQo4n6GlQliHlU",
            source: "Spotify"
          },
          {
            title: "Journaling for Mental Health",
            url: "https://open.spotify.com/episode/5wKUOqdzX7wsSkQbsB7Dwo",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Sharing with Others", 
        description: "Relieve emotional burden by talking to someone you trust.", 
        icon: "🗣",
        detailedDescription: "Talking with someone you trust helps process complex emotions, gain new perspectives, and feel understood.",
        steps: [
          "Identify a trusted friend or family member",
          "Choose a comfortable setting",
          "Express your feelings openly",
          "Listen to their perspective"
        ],
        img: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Share2 size={16} />,
        actionText: "Chat Support",
        actionLink: "https://www.7cups.com",
        podcastLinks: [
          {
            title: "The Art of Conversation",
            url: "https://open.spotify.com/episode/4co4Rzy8lidOZ67Kt51A5Y",
            source: "Spotify"
          },
          {
            title: "Sharing through Music",
            url: "https://open.spotify.com/playlist/3VbvmqXtqJcmmQMWHMMVQk",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Music Therapy", 
        description: "Use calming music to regulate emotions and uplift mood.", 
        icon: "🎵",
        detailedDescription: "Music can uplift mood and promote relaxation by helping process emotions through rhythm and melody.",
        steps: [
          "Create playlists for different moods",
          "Listen mindfully without distractions",
          "Notice how different music affects you",
          "Experiment with different genres"
        ],
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Music size={16} />,
        actionText: "Music Player",
        actionLink: "https://open.spotify.com",
        podcastLinks: [
          {
            title: "Music for Mental Health",
            url: "https://open.spotify.com/playlist/4Uq1hlHX9gWoifCrk2y6Pv",
            source: "Spotify"
          },
          {
            title: "Healing Through Sound",
            url: "https://open.spotify.com/playlist/2d36Zpkvk6We2BrsZdxQQ9",
            source: "Spotify"
          }
        ]
      }
    ]
  },
  {
    label: "Physical",
    icon: <Dumbbell className="text-emerald-500" size={24} />,
    color: "from-emerald-500 to-green-600",
    accent: "#10b981",
    cardBg: "bg-gradient-to-br from-emerald-50 to-green-50",
    borderColor: "border-emerald-200",
    strategies: [
      {
        name: "Deep Breathing", 
        description: "Calm your nervous system with guided breathing exercises.", 
        icon: "💨",
        detailedDescription: "Breathe slowly to activate your parasympathetic nervous system, reducing anxiety and promoting calmness.",
        steps: [
          "Find a comfortable seated position",
          "Inhale deeply for 4 seconds",
          "Hold breath for 4 seconds",
          "Exhale slowly for 6 seconds",
          "Repeat for 5-10 cycles"
        ],
        img: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Play size={16} />,
        actionText: "Breathing Guide",
        actionLink: "https://www.calm.com/breathe",
        podcastLinks: [
          {
            title: "Breathing for Stress Relief",
            url: "https://open.spotify.com/episode/07O4wv4BBg8klUPAE1kUPK",
            source: "Spotify"
          },
          {
            title: "Mindful Breathing Techniques",
            url: "https://open.spotify.com/episode/7xFb8Mi4cJFcixXvMsOQHj",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Progressive Relaxation", 
        description: "Reduce muscle tension by tightening and relaxing muscle groups.", 
        icon: "😌",
        detailedDescription: "Systematically tense and release different muscle groups to reduce physical tension and increase body awareness.",
        steps: [
          "Start with your feet and work upward",
          "Tense each muscle group for 5 seconds",
          "Release and notice the difference",
          "Move through all major muscle groups"
        ],
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Play size={16} />,
        actionText: "Audio Guide",
        actionLink: "https://www.headspace.com",
        podcastLinks: [
          {
            title: "Relaxation Techniques",
            url: "https://open.spotify.com/show/0hu9TOC2FKvvBq4UZ5tTIs",
            source: "Spotify"
          },
          {
            title: "Body Scan Meditation",
            url: "https://open.spotify.com/episode/4jLSJi90eErwoH0VblcaT7",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Regular Exercise", 
        description: "Improve your mental health by staying physically active.", 
        icon: "🏃",
        detailedDescription: "Physical activity releases endorphins and reduces stress hormones, improving both physical health and emotional resilience.",
        steps: [
          "Choose activities you enjoy",
          "Start with 10-15 minutes daily",
          "Gradually increase duration/intensity",
          "Notice mood changes after exercise"
        ],
        img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Activity size={16} />,
        actionText: "Workout Plans",
        actionLink: "https://www.fitnessblender.com",
        podcastLinks: [
          {
            title: "Exercise and Mental Health",
            url: "https://open.spotify.com/playlist/6ND5C1i0FLzJVMXuYTUgVW",
            source: "Spotify"
          },
          {
            title: "Movement as Medicine",
            url: "https://open.spotify.com/show/1poNAnuwq64sWTO8qmgz1I",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Yoga Practice", 
        description: "Balance mind and body with gentle movements and mindfulness.", 
        icon: "🧘‍♀️",
        detailedDescription: "Combines gentle movement with mindfulness to improve flexibility, balance, and mental clarity while reducing tension.",
        steps: [
          "Find a quiet space with room to move",
          "Start with simple poses",
          "Focus on breath and movement",
          "End with relaxation"
        ],
        img: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Play size={16} />,
        actionText: "Yoga Videos",
        actionLink: "https://www.youtube.com/yoga",
        podcastLinks: [
          {
            title: "Yoga for Beginners",
            url: "https://open.spotify.com/show/4uUCOD4xOZyoYjPjTg0r0T",
            source: "Spotify"
          },
          {
            title: "Mindful Movement",
            url: "https://open.spotify.com/show/6GWygA1iSoEHBGHuLeBQTZ",
            source: "Spotify"
          }
        ]
      }
    ]
  },
  {
    label: "Cognitive",
    icon: <Brain className="text-amber-500" size={24} />,
    color: "from-amber-500 to-yellow-600",
    accent: "#f59e0b",
    cardBg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    borderColor: "border-amber-200",
    strategies: [
      {
        name: "Positive Affirmations", 
        description: "Reframe your mindset with encouraging self-talk.", 
        icon: "💬",
        detailedDescription: "Replace negative self-talk with empowering statements to build confidence and train your mind toward constructive patterns.",
        steps: [
          "Identify negative thought patterns",
          "Create positive alternatives",
          "Repeat daily, especially when stressed",
          "Believe in the statements you create"
        ],
        img: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Pencil size={16} />,
        actionText: "Affirmation Generator",
        actionLink: "https://www.thinkup.me",
        podcastLinks: [
          {
            title: "The Power of Affirmations",
            url: "https://open.spotify.com/track/41W1qqV2MHqouIPd9eDwpj",
            source: "Spotify"
          },
          {
            title: "Rewiring Your Thoughts",
            url: "https://open.spotify.com/episode/2nKilaLoPYhE4uWPY9uctR",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Thought Challenging", 
        description: "Identify and dispute unhelpful or irrational thoughts.", 
        icon: "🧾",
        detailedDescription: "Identify and question pessimistic thought patterns, looking for evidence that contradicts negative assumptions.",
        steps: [
          "Write down the stressful thought",
          "Identify cognitive distortions",
          "Find evidence for/against the thought",
          "Develop a balanced perspective"
        ],
        img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Pencil size={16} />,
        actionText: "Thought Journal",
        actionLink: "https://www.moodtools.org",
        podcastLinks: [
          {
            title: "Cognitive Behavioral Therapy",
            url: "https://open.spotify.com/episode/19OSn7FsOGACLzUoMUVeth",
            source: "Spotify"
          },
          {
            title: "Challenging Negative Thoughts",
            url: "https://open.spotify.com/episode/5yw7woru1IOCVbR3Lu4etE",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Mindfulness Practice", 
        description: "Stay grounded by focusing on the present moment.", 
        icon: "🧘",
        detailedDescription: "Stay present in the moment without judgment to reduce anxiety about the past or future and improve mental clarity.",
        steps: [
          "Find a quiet place to sit",
          "Focus on your breath",
          "When mind wanders, gently return focus",
          "Start with 5 minutes daily"
        ],
        img: "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Play size={16} />,
        actionText: "Mindfulness Audio",
        actionLink: "https://www.mindful.org/meditation/mindfulness-getting-started/",
        podcastLinks: [
          {
            title: "Mindfulness Meditation",
            url: "https://open.spotify.com/show/50yOGRLSNwrA5mDO2g5gt8",
            source: "Spotify"
          },
          {
            title: "Present Moment Awareness",
            url: "https://open.spotify.com/track/6wSptpp9h3yymtBTHVKyqC",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Cognitive Reframing", 
        description: "Change your perspective to reduce stress and emotional pain.", 
        icon: "🔁",
        detailedDescription: "Look at challenges from different perspectives to find opportunities for growth and learning instead of focusing on difficulties.",
        steps: [
          "Identify the stressful situation",
          "List possible alternative views",
          "Evaluate evidence for each",
          "Adopt the most balanced perspective"
        ],
        img: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Pencil size={16} />,
        actionText: "Reframing Tool",
        actionLink: "https://www.therapistaid.com",
        podcastLinks: [
          {
            title: "Changing Perspectives",
            url: "https://open.spotify.com/show/42vKVf6maZhfO68e3Cbpl9",
            source: "Spotify"
          },
          {
            title: "Reframing Challenges",
            url: "https://open.spotify.com/episode/6dzqhEorTo5rwwAfZafpAT",
            source: "Spotify"
          }
        ]
      }
    ]
  },
  {
    label: "Behavioral",
    icon: <Theater className="text-blue-500" size={24} />,
    color: "from-blue-500 to-indigo-600",
    accent: "#3b82f6",
    cardBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    borderColor: "border-blue-200",
    strategies: [
      {
        name: "Engaging in Hobbies", 
        description: "Boost mood by spending time on creative or enjoyable tasks.", 
        icon: "🎨",
        detailedDescription: "Do something you love regularly to boost mood, creativity, and provide a healthy escape from daily stressors.",
        steps: [
          "Identify activities you enjoy",
          "Schedule regular time for them",
          "Focus completely on the activity",
          "Notice how you feel afterward"
        ],
        img: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <ListChecks size={16} />,
        actionText: "Hobby Ideas",
        actionLink: "https://www.discoverahobby.com",
        podcastLinks: [
          {
            title: "Finding Your Passion",
            url: "https://open.spotify.com/episode/5u9pYafZ0uoih1ERU8S40M",
            source: "Spotify"
          },
          {
            title: "Creative Outlets for Stress",
            url: "https://open.spotify.com/album/1NaSox4x8iuHuHXbODmzLP",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Daily Routines", 
        description: "Create structure to feel more in control and less overwhelmed.", 
        icon: "📅",
        detailedDescription: "Structure your day with consistent patterns to create stability, reduce decision fatigue, and improve productivity.",
        steps: [
          "Identify key activities for each day",
          "Create a realistic schedule",
          "Include self-care activities",
          "Adjust as needed"
        ],
        img: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <CalendarDays size={16} />,
        actionText: "Routine Builder",
        actionLink: "https://clockify.me",
        podcastLinks: [
          {
            title: "Building Healthy Habits",
            url: "https://open.spotify.com/episode/5qMSIwnuG8v6YhCLbh9HoF",
            source: "Spotify"
          },
          {
            title: "The Power of Routine",
            url: "https://open.spotify.com/episode/1HXvaxd4o8oEl9Fiv8AxhN",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Task Breakdown", 
        description: "Simplify big tasks into smaller, manageable steps.", 
        icon: "🧩",
        detailedDescription: "Avoid feeling overwhelmed by dividing large projects into manageable pieces that can be accomplished one at a time.",
        steps: [
          "Write down the main task",
          "Break into smaller subtasks",
          "Prioritize the subtasks",
          "Complete one at a time"
        ],
        img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <ListChecks size={16} />,
        actionText: "Task Planner",
        actionLink: "https://plaky.com",
        podcastLinks: [
          {
            title: "Productivity Hacks",
            url: "https://open.spotify.com/episode/2CGe3BKmkCZCc9MwEJ3vMw",
            source: "Spotify"
          },
          {
            title: "Overcoming Procrastination",
            url: "https://open.spotify.com/episode/0KjXmcW227NjQ5pttTgPle",
            source: "Spotify"
          }
        ]
      },
      {
        name: "Nature Connection", 
        description: "Spend time in nature to reduce stress and clear your mind.", 
        icon: "🌳",
        detailedDescription: "Spend time in natural settings to reduce stress hormones, improve mood, and gain perspective on personal challenges.",
        steps: [
          "Find green spaces near you",
          "Disconnect from technology",
          "Engage your senses outdoors",
          "Make it a regular practice"
        ],
        img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&h=400&q=80",
        actionIcon: <Shrub size={16} />,
        actionText: "Outdoor Activities",
        actionLink: "https://www.alltrails.com",
        podcastLinks: [
          {
            title: "Nature Therapy",
            url: "https://open.spotify.com/show/5jdMRmrbrXt6h5SDWFapqo",
            source: "Spotify"
          },
          {
            title: "Forest Bathing Benefits",
            url: "https://open.spotify.com/track/5clsFpKqy5dH4zkTok14wS",
            source: "Spotify"
          }
        ]
      }
    ]
  }
];

const CopingStrategies = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showIntro, setShowIntro] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    const timer = setTimeout(() => setShowIntro(false), 3500);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isLoaded && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab, isLoaded]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const tiltX = (mousePosition.x - centerX) / 50;
  const tiltY = (mousePosition.y - centerY) / 50;

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

  const handleCardClick = (strategy, index, e) => {
    if (e.target.closest('button, a')) {
      return;
    }
    
    if (expandedCard === index) {
      window.open(strategy.actionLink, '_blank');
    } else {
      setExpandedCard(index);
    }
  };

  const handleActionButtonClick = (e, link) => {
    e.stopPropagation();
    window.open(link, '_blank');
  };

  const toggleFavorite = (strategyName) => {
    if (favorites.includes(strategyName)) {
      setFavorites(favorites.filter(name => name !== strategyName));
    } else {
      setFavorites([...favorites, strategyName]);
    }
  };

  const toggleExpandCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  return (
    <>
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
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply opacity-20 filter blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply opacity-20 filter blur-3xl"></div>
              
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
                  <div className="h-0.5 mt-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full mx-auto w-[60%]" />
                </div>
                
                <motion.p
                  className="text-lg md:text-xl text-slate-700 max-w-xl text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 }}
                >
                  Discover powerful techniques for managing stress and building resilience
                </motion.p>
                
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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSByPSIxIiBjeD0iMjAiIGN5PSIyMCIgZmlsbD0iIzgxOGNmOCIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]"></div>
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
          <div className="light-stars-container">
            <div className="light-stars-small"></div>
            <div className="light-stars-medium"></div>
            <div className="light-stars-large"></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-12 md:py-20 max-w-7xl z-10">
          <motion.div 
            className="text-center mb-20 md:mb-24 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: showIntro ? 3 : 0 }}
            style={{ 
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-6 tracking-wide relative overflow-hidden leading-snug font-[Poppins]">
                <span className="inline-block relative title-gradient-1">
                  Coping
                </span>{" "}
                <span className="inline-block ml-2 relative title-gradient-2">
                  Strategies
                </span>
                <div className="h-0.5 w-20 mt-2 rounded-full underline-gradient opacity-80"></div>
              </h1>
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full light-radial-pulse opacity-40"></div>
            </div>
            <p className="text-base md:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Discover evidence-based techniques to effectively manage stress, build resilience, and enhance your mental wellbeing in everyday life
            </p>
          </motion.div>
          
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
                  className={`group rounded-2xl overflow-hidden h-full shadow-lg border ${categories[activeTab].borderColor} transition-all duration-300 ${categories[activeTab].cardBg} cursor-pointer`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      hoveredCardIndex === index
                        ? `perspective(1000px) rotateX(${(mousePosition.y - centerY) / 30}deg) rotateY(${-(mousePosition.x - centerX) / 30}deg)`
                        : "none",
                    transition: "transform 0.2s ease",
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: `0 20px 30px -10px ${categories[activeTab].accent}25`,
                  }}
                  onClick={(e) => handleCardClick(strategy, index, e)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={strategy.img}
                      alt={strategy.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <button
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        favorites.includes(strategy.name)
                          ? "bg-rose-100/90 text-rose-500"
                          : "bg-white/20 text-white/80 hover:bg-white/30"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(strategy.name);
                      }}
                    >
                      <Bookmark
                        size={16}
                        fill={favorites.includes(strategy.name) ? "currentColor" : "none"}
                      />
                    </button>
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md">
                      <span className="text-lg">{strategy.icon}</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <motion.h3
                        className="font-bold text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-700"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {strategy.name}
                      </motion.h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/80 text-slate-700">
                        {categories[activeTab].label}
                      </span>
                    </div>

                    <motion.p
                      className="text-slate-600 text-sm leading-relaxed mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {strategy.description}
                    </motion.p>

                    <AnimatePresence>
                      {expandedCard === index && (
                        <motion.div
                          className="space-y-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-slate-700">How to practice:</h4>
                            <ul className="text-xs text-slate-600 space-y-2">
                              {strategy.steps.map((step, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="inline-block mr-2">•</span>
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {strategy.podcastLinks && strategy.podcastLinks.length > 0 && (
                            <div>
                              <h4 className="font-medium text-sm mb-2 text-slate-700">Podcasts:</h4>
                              <div className="space-y-2">
                                {strategy.podcastLinks.map((podcast, i) => (
                                  <div 
                                    key={i}
                                    className="flex items-center gap-2 p-2 bg-white/50 rounded-lg hover:bg-white/70 transition"
                                  >
                                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                      podcast.source === 'Spotify' ? 'bg-green-500' : 'bg-pink-500'
                                    }`}>
                                      {podcast.source === 'Spotify' ? (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                                          <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.56 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                        </svg>
                                      ) : (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
                                          <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm0 22.08C6 22.08 1.92 18 1.92 12S6 1.92 12 1.92 22.08 6 22.08 12 18 22.08 12 22.08zm4.56-13.68c-.24-.36-.84-.48-1.2-.24-2.16 1.44-4.8 2.16-7.44 1.92-.6-.12-1.08.36-.96.96.12.6.72 1.08 1.32.96 2.16-.24 4.44.36 6.24-1.2.36-.24.48-.84.24-1.2zm1.2 2.4c-.36-.48-1.08-.6-1.56-.24-2.52 1.68-6.36 2.16-9.24 1.2-.6-.24-1.32.12-1.56.72-.24.6.12 1.32.72 1.56 3.48 1.2 7.8.6 10.68-1.44.48-.36.6-1.08.24-1.56zm.12 2.64c-.48-.6-1.44-.72-2.04-.24-3.12 2.16-8.04 2.4-11.04.72-.72-.36-1.56.12-1.92.84-.36.72.12 1.56.84 1.92 3.72 2.04 9.36 1.68 12.96-.84.6-.36.72-1.32.24-1.92z"/>
                                        </svg>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-slate-800">{podcast.title}</p>
                                      <p className="text-xs text-slate-500">{podcast.source}</p>
                                    </div>
                                    <button 
                                      className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md hover:opacity-90 transition"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(podcast.url, '_blank');
                                      }}
                                    >
                                      Try Podcast
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-auto pt-3 border-t border-slate-200/60 flex justify-between items-center">
                      <motion.button
                        className="group flex items-center gap-1 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                        whileHover={{ x: 3 }}
                        onClick={() => toggleExpandCard(index)}
                      >
                        {expandedCard === index ? "Show less" : "Learn more"}
                        <motion.span
                          animate={{
                            rotate: expandedCard === index ? 180 : 0,
                            transition: { duration: 0.3 },
                          }}
                        >
                          <ChevronDown size={14} className="text-indigo-600" />
                        </motion.span>
                      </motion.button>

                      <motion.button
                        className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm"
                        style={{
                          background: `linear-gradient(to right, ${categories[activeTab].accent}, ${categories[activeTab].accent}99)`,
                          color: "white",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleActionButtonClick(e, strategy.actionLink)}
                      >
                        {strategy.actionIcon}
                        <span>{strategy.actionText}</span>
                      </motion.button>
                    </div>
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
export default CopingStrategies;
