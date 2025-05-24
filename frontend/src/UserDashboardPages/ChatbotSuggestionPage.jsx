import React, { useState, useEffect } from "react";
import {
  Check,
  Clock,
  AlertCircle,
  PlusCircle,
  Brain,
  Activity,
  Flame,
  ThermometerSun,
  Zap,
  Star,
  Heart,
  Shield,
  Sparkles,
  Target,
  Award,
  Lightbulb,
  Bookmark,
  RefreshCw,
  Trophy,
  Play,
  Loader2,
  Trash2,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

  // Exercise recommendations data
  const exerciseRecommendations = {
  Depression: {
    "High Risk": [
      {
        type: "Relaxation",
        suggestion: "Try 10 minutes of deep breathing 🧘",
        content1: "Find a quiet space and focus on slow, rhythmic breaths",
        content2: "Reduces stress hormones and calms the nervous system",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
        youtubeLink: "https://www.youtube.com/watch?v=VUjiXcfKBn8&t=2s"
      },
      {
        type: "Activity",
        suggestion: "Go for a 15-minute walk in nature 🏃",
        content1: "Walk in a park or green space, observing trees and birds",
        content2: "Boosts serotonin and vitamin D exposure",
        image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f",
        youtubeLink: "https://www.youtube.com/watch?v=uelJ5LtmrV0"
      },
      {
        type: "Habit",
        suggestion: "Practice guided meditation 🔄",
        content1: "Use apps like Headspace or YouTube for guided sessions",
        content2: "Enhances mindfulness and emotional balance",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
        youtubeLink: "https://www.youtube.com/watch?v=WLTkxWoQt-4"
      }
    ],
    "Moderate Risk": [
      {
        type: "Habit",
        suggestion: "Write down 3 things you’re grateful for 📝",
        content1: "Reflect on small joys (e.g., sunshine, a friend’s smile)",
        content2: "Shifts focus from negativity to positivity",
        image: "https://images.unsplash.com/photo-1518655048521-f130df041f66",
        youtubeLink: "https://www.youtube.com/watch?v=eiRCuujt8P0"
      },
      {
        type: "Activity",
        suggestion: "Do light stretching or yoga for 10 minutes 🧘",
        content1: "Try gentle poses like child’s pose or seated forward bend",
        content2: "Releases muscle tension and improves circulation",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        youtubeLink: "https://www.youtube.com/watch?v=3X0hEHop8ec"
      },
      {
        type: "Relaxation",
        suggestion: "Listen to calming music 🎵",
        content1: "Choose instrumental or nature sounds (e.g., piano, rain)",
        content2: "Lowers cortisol levels and induces relaxation",
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        youtubeLink: "https://www.youtube.com/watch?v=TKeU1bLlAcc&list=PL_DaWb6RFQc39EDKQ-P3iEtg7osX8jfb-"
      }
    ],
    "Low Risk": [
      {
        type: "Activity",
        suggestion: "Engage in a hobby you enjoy 🎨",
        content1: "Drawing, gardening, or playing music",
        content2: "Provides a sense of accomplishment",
        image: "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea",
        youtubeLink: "https://www.youtube.com/watch?v=o5dY2Pnww6A"
      },
      {
        type: "Habit",
        suggestion: "Call a friend and have a short chat 📞",
        content1: "Share a light conversation or memory",
        content2: "Strengthens social connections",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        youtubeLink: "https://www.youtube.com/watch?v=fR7wUgpFnds&t=25s"
      },
      {
        type: "Relaxation",
        suggestion: "Do a 5-minute mindfulness exercise 🧠",
        content1: "Focus on your breath or a sensory object (e.g., a candle)",
        content2: "Grounds you in the present moment",
        image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
        youtubeLink: "https://www.youtube.com/watch?v=ssss7V1_eyA"
      }
    ]
  },
  Anxiety: {
    "High Risk": [
      {
        type: "Relaxation",
        suggestion: "Try progressive muscle relaxation 💆",
        content1: "Tense and release muscles from toes to head",
        content2: "Reduces physical symptoms of anxiety",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        youtubeLink: "https://www.youtube.com/watch?v=SNqYG95j_UQ&t=2s"
      },
      {
        type: "Activity",
        suggestion: "Use the 4-7-8 breathing technique 🌬️",
        content1: "Inhale for 4s, hold for 7s, exhale for 8s",
        content2: "Activates the parasympathetic nervous system",
        image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460",
        youtubeLink: "https://www.youtube.com/watch?v=LiUnFJ8P4gM&t=2s"
      },
      {
        type: "Habit",
        suggestion: "Write down your thoughts to clear your mind 📔",
        content1: "Journal intrusive thoughts without judgment",
        content2: "Creates mental distance from worries",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=_5YooSxz1tM"
      }
    ],
    "Moderate Risk": [
      {
        type: "Relaxation",
        suggestion: "Listen to nature sounds or white noise 🌊",
        content1: "Rain, forest, or ocean soundscapes",
        content2: "Masks anxiety-inducing background noise",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969",
        youtubeLink: "https://www.youtube.com/watch?v=eNUpTV9BGac&t=2s"
      },
      {
        type: "Activity",
        suggestion: "Take a 15-minute break from screens 📵",
        content1: "Step away from phones/computers",
        content2: "Reduces sensory overload",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        youtubeLink: "https://www.youtube.com/watch?v=WRJ1E2FTUNE&t=25s"
      },
      {
        type: "Habit",
        suggestion: "Try a short visualization exercise 🌅",
        content1: "Imagine a peaceful place (e.g., beach, mountains)",
        content2: "Redirects focus from anxiety triggers",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        youtubeLink: "https://www.youtube.com/watch?v=Z4_ahk-2MZc&t=27s"
      }
    ],
    "Low Risk": [
      {
        type: "Relaxation",
        suggestion: "Practice slow, deep breathing for 5 minutes 🌿",
        content1: "Belly breathing with hand on abdomen",
        content2: "Slows heart rate and promotes calm",
        image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
        youtubeLink: "https://www.youtube.com/watch?v=DbDoBzGY3vo"
      },
      {
        type: "Activity",
        suggestion: "Drink herbal tea and relax ☕",
        content1: "Chamomile, peppermint, or lavender tea",
        content2: "Natural calming properties",
        image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9",
        youtubeLink: "https://www.youtube.com/watch?v=U3xiIRnTahI&t=2s"
      },
      {
        type: "Habit",
        suggestion: "Read a book for 10 minutes 📖",
        content1: "Fiction or inspirational content",
        content2: "Distracts from anxious thoughts",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        youtubeLink: "https://www.youtube.com/watch?v=zluGYFV0c20&t=38s"
      }
    ]
  },
  Bipolar: {
    "High Risk": [
      {
        type: "Relaxation",
        suggestion: "Engage in grounding techniques like 5-4-3-2-1 🧘",
        content1: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste",
        content2: "Anchors you to the present moment",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        youtubeLink: "https://www.youtube.com/watch?v=30VMIEmA114"
      },
      {
        type: "Activity",
        suggestion: "Try slow-paced walking in a quiet area 🚶",
        content1: "Walk mindfully, noticing each step",
        content2: "Stabilizes mood and energy levels",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b",
        youtubeLink: "https://www.youtube.com/watch?v=9LOBQ50gUAA"
      },
      {
        type: "Habit",
        suggestion: "Listen to calm instrumental music 🎼",
        content1: "Choose slow-tempo classical or ambient music",
        content2: "Regulates emotional responses",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        youtubeLink: "https://www.youtube.com/watch?v=xxhnfcC_4B8"
      }
    ],
    "Moderate Risk": [
      {
        type: "Activity",
        suggestion: "Do a 10-minute gentle yoga session 🧘",
        content1: "Focus on restorative poses (e.g., legs up the wall)",
        content2: "Promotes relaxation without overstimulation",
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e",
        youtubeLink: "https://www.youtube.com/watch?v=6bq2uUN-oSY"
      },
      {
        type: "Habit",
        suggestion: "Keep a mood journal for self-awareness 📓",
        content1: "Track mood swings, triggers, and sleep patterns",
        content2: "Identifies early warning signs of episodes",
        image: "https://images.unsplash.com/photo-1517842645767-c639042777db",
        youtubeLink: "https://www.youtube.com/watch?v=f60QFL9rJd0"
      },
      {
        type: "Relaxation",
        suggestion: "Practice self-affirmations 💬",
        content1: "Repeat positive statements (e.g., 'I am stable')",
        content2: "Counters negative thought patterns",
        image: "https://images.unsplash.com/photo-1491897554428-130a60dd4757",
        youtubeLink: "https://www.youtube.com/watch?v=yo1pJ_D-H3M"
      }
    ],
    "Low Risk": [
      {
        type: "Activity",
        suggestion: "Engage in light exercise like jogging 🏃",
        content1: "Start with 10-15 minutes at a comfortable pace",
        content2: "Balances energy levels naturally",
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
        youtubeLink: "https://www.youtube.com/watch?v=v6gxmBerTeM"
      },
      {
        type: "Habit",
        suggestion: "Practice mindful eating for a meal 🍽️",
        content1: "Eat slowly, savoring each bite without distractions",
        content2: "Improves relationship with food and body",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        youtubeLink: "https://www.youtube.com/watch?v=u1jRaHrpokA&t=113s"
      },
      {
        type: "Relaxation",
        suggestion: "Do deep breathing exercises 🌬️",
        content1: "Inhale for 4s, exhale for 6s",
        content2: "Regulates the nervous system",
        image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
        youtubeLink: "https://www.youtube.com/watch?v=acUZdGd_3Dg"
      }
    ]
  },
  OCD: {
    "High Risk": [
      {
        type: "Habit",
        suggestion: "Use exposure-response prevention techniques 🛑",
        content1: "Delay compulsions gradually (start with 5 minutes)",
        content2: "Reduces anxiety over time",
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
        youtubeLink: "https://www.youtube.com/watch?v=JlVID74KTOM"
      },
      {
        type: "Relaxation",
        suggestion: "Try 5 minutes of guided meditation 🧘",
        content1: "Focus on a mantra (e.g., 'This too shall pass')",
        content2: "Creates mental space from intrusive thoughts",
        image: "https://images.unsplash.com/photo-1513366208864-87536b8bd7b4",
        youtubeLink: "https://www.youtube.com/watch?v=Lf6FpYcsziw"
      },
      {
        type: "Activity",
        suggestion: "Write down intrusive thoughts and challenge them 📝",
        content1: "Ask: 'Is this thought factual or exaggerated?'",
        content2: "Builds cognitive flexibility",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=V3vhXQy48jo"
      }
    ],
    "Moderate Risk": [
      {
        type: "Activity",
        suggestion: "Take a short break from triggers 🚶",
        content1: "Step away from triggering situations temporarily",
        content2: "Prevents compulsive responses",
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e4c2",
        youtubeLink: "https://www.youtube.com/watch?v=l3i8SfOk5FU"
      },
      {
        type: "Relaxation",
        suggestion: "Practice progressive relaxation 💆",
        content1: "Tense and relax muscles one group at a time",
        content2: "Reduces physical tension linked to anxiety",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        youtubeLink: "https://www.youtube.com/watch?v=SNqYG95j_UQ&t=4s"
      },
      {
        type: "Habit",
        suggestion: "Engage in a calming activity like drawing 🎨",
        content1: "Doodle, color, or sketch freely",
        content2: "Redirects focus from compulsions",
        image: "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea",
        youtubeLink: "https://www.youtube.com/watch?v=GMSC95hEj2w"
      }
    ],
    "Low Risk": [
      {
        type: "Relaxation",
        suggestion: "Practice deep breathing with slow exhales 🌬️",
        content1: "Extend exhales longer than inhales (e.g., 4s in, 6s out)",
        content2: "Activates the body’s relaxation response",
        image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460",
        youtubeLink: "https://www.youtube.com/watch?v=JJfYqWSAMCg"
      },
      {
        type: "Habit",
        suggestion: "Listen to soft music and relax 🎵",
        content1: "Choose instrumental or nature sounds",
        content2: "Soothes the mind without overstimulation",
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        youtubeLink: "https://www.youtube.com/watch?v=qsEBaIMCKl4"
      },
      {
        type: "Activity",
        suggestion: "Try focusing on one simple task at a time 🎯",
        content1: "Complete a small task (e.g., folding laundry) mindfully",
        content2: "Trains the brain to resist multitasking urges",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        youtubeLink: "https://www.youtube.com/watch?v=mMIK5u4xdh8"
      }
    ]
  },
  PTSD: {
    "High Risk": [
      {
        type: "Relaxation",
        suggestion: "Try grounding techniques (hold an object, describe it) ✋",
        content1: "Hold a cold object or describe your surroundings aloud",
        content2: "Anchors you to the present moment",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        youtubeLink: "https://www.youtube.com/watch?v=5a88mUAzNLk"
      },
      {
        type: "Activity",
        suggestion: "Do 4-7-8 breathing for relaxation 🌬️",
        content1: "Inhale for 4s, hold for 7s, exhale for 8s",
        content2: "Calms the nervous system quickly",
        image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460",
        youtubeLink: "https://www.youtube.com/watch?v=kpSkoXRrZnE"
      },
      {
        type: "Habit",
        suggestion: "Write in a trauma journal 📔",
        content1: "Express emotions safely on paper",
        content2: "Processes traumatic memories gradually",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=dcfNwx5vfR0"
      }
    ],
    "Moderate Risk": [
      {
        type: "Relaxation",
        suggestion: "Practice mindfulness for 5 minutes 🧘",
        content1: "Focus on your breath or a sensory object",
        content2: "Reduces hypervigilance",
        image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
        youtubeLink: "https://www.youtube.com/watch?v=I-SFdhVwrVA"
      },
      {
        type: "Activity",
        suggestion: "Engage in slow, rhythmic movement (walking, stretching) 🚶",
        content1: "Sync movement with breath (e.g., step on inhale/exhale)",
        content2: "Regulates the nervous system",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b",
        youtubeLink: "https://www.youtube.com/watch?v=62-KAP9mDI8"
      },
      {
        type: "Habit",
        suggestion: "Listen to soothing music 🎵",
        content1: "Choose familiar, calming tracks",
        content2: "Provides emotional safety",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        youtubeLink: "https://www.youtube.com/watch?v=SdcAN3dobz4&list=RDQM5Auu_J59opM&start_radio=1"
      }
    ],
    "Low Risk": [
      {
        type: "Activity",
        suggestion: "Try positive visualization techniques 🌈",
        content1: "Imagine a safe, peaceful place in detail",
        content2: "Counters traumatic imagery",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        youtubeLink: "https://www.youtube.com/watch?v=erWCdK_S5Bc"
      },
      {
        type: "Relaxation",
        suggestion: "Engage in light exercise or stretching 🧘",
        content1: "Gentle yoga or tai chi",
        content2: "Releases stored tension",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        youtubeLink: "https://www.youtube.com/watch?v=FI51zRzgIe4"
      },
      {
        type: "Habit",
        suggestion: "Spend time in a quiet, safe space 🏡",
        content1: "Create a comforting environment (e.g., soft lighting)",
        content2: "Promotes feelings of security",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
        youtubeLink: "https://www.youtube.com/watch?v=reMKNFTxXBw"
      }
    ]
  },
  "Suicide Watch": {
    "High Risk": [
      {
        type: "Emergency",
        suggestion: "Immediately reach out to a mental health professional 🆘",
        content1: "Call your therapist, crisis hotline, or trusted provider",
        content2: "Professional support can provide immediate safety planning",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        youtubeLink: "https://www.youtube.com/watch?v=InDEc1sDfE4"
      },
      {
        type: "Support",
        suggestion: "Call a trusted friend or family member 📞",
        content1: "Reach out to someone who understands your struggle",
        content2: "Social connection reduces isolation during crisis",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        youtubeLink: "https://www.youtube.com/watch?v=-hKUHiIwbrM"
      },
      {
        type: "Grounding",
        suggestion: "Try a sensory grounding exercise ✋",
        content1: "Hold ice cubes or splash cold water on your face",
        content2: "Activates the dive reflex to calm nervous system",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        youtubeLink: "https://www.youtube.com/watch?v=o-peeAE80C0"
      }
    ],
    "Moderate Risk": [
      {
        type: "Reflection",
        suggestion: "Write a letter to your future self 📝",
        content1: "Describe hopes for your future self to read later",
        content2: "Creates connection with your future wellbeing",
        image: "https://images.unsplash.com/photo-1518655048521-f130df041f66",
        youtubeLink: "https://www.youtube.com/watch?v=lq2AGr0gRhs"
      },
      {
        type: "Sensory",
        suggestion: "Listen to uplifting music 🎵",
        content1: "Choose songs with positive memories or lyrics",
        content2: "Music can shift emotional states",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        youtubeLink: "https://www.youtube.com/watch?v=tkql_yvuSK0&list=PLvx1Z92uzO9PhwqcXbMml-14j-ALCkXVY"
      },
      {
        type: "Self-Care",
        suggestion: "Practice comforting self-care 🛁",
        content1: "Take a warm bath with soothing scents",
        content2: "Physical comfort can ease emotional pain",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
        youtubeLink: "https://www.youtube.com/watch?v=cjfofAuxibQ"
      }
    ],
    "Low Risk": [
      {
        type: "Motivation",
        suggestion: "Watch an inspirational video 🌟",
        content1: "Find stories of people who overcame struggles",
        content2: "Provides hope and perspective",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
        youtubeLink: "https://www.youtube.com/watch?v=KgX3aK0gX9c"
      },
      {
        type: "Expression",
        suggestion: "Journal your emotions 📔",
        content1: "Write freely without filtering thoughts",
        content2: "Externalizes and processes difficult feelings",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=WI-j39vOqmk"
      },
      {
        type: "Connection",
        suggestion: "Spend time with loved ones 👨‍👩‍👧‍👦",
        content1: "Be physically present with supportive people",
        content2: "Counteracts feelings of isolation",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
        youtubeLink: "https://www.youtube.com/watch?v=SC0tl8wD31s"
      }
    ]
  },
  "ADHD": {
    "High Risk": [
      {
        type: "Structure",
        suggestion: "Create a step-by-step daily routine 📅",
        content1: "Break tasks into 15-30 minute blocks with breaks",
        content2: "Provides external structure for focus",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
        youtubeLink: "https://www.youtube.com/watch?v=9dsjGQnl4H0"
      },
      {
        type: "Focus",
        suggestion: "Use the Pomodoro technique ⏱️",
        content1: "Work for 25 minutes, then 5-minute break",
        content2: "Manages attention in manageable chunks",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        youtubeLink: "https://www.youtube.com/watch?v=1pADI_eZ_-U"
      },
      {
        type: "Movement",
        suggestion: "Do short bursts of physical activity 🏃",
        content1: "Try jumping jacks or dancing for 2-3 minutes",
        content2: "Channels excess energy productively",
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
        youtubeLink: "https://www.youtube.com/watch?v=nMV_xkndnWk"
      }
    ],
    "Moderate Risk": [
      {
        type: "Exercise",
        suggestion: "Try quick exercise breaks 💪",
        content1: "Stretching, pushups, or yoga flows",
        content2: "Regulates dopamine and norepinephrine",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        youtubeLink: "https://www.youtube.com/watch?v=hb_dempqaJo"
      },
      {
        type: "Sensory",
        suggestion: "Use fidget tools 🧩",
        content1: "Stress balls, putty, or spinner rings",
        content2: "Provides tactile stimulation for focus",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
        youtubeLink: "https://www.youtube.com/watch?v=Uh7cI5roSFM"
      },
      {
        type: "Meditation",
        suggestion: "Try moving meditation 🧘",
        content1: "Walking meditation or tai chi",
        content2: "Combines movement with mindfulness",
        image: "https://images.unsplash.com/photo-1548602088-9d12a4f9c839",
        youtubeLink: "https://www.youtube.com/watch?v=5kdfJAU7ihA"
      }
    ],
    "Low Risk": [
      {
        type: "Breathing",
        suggestion: "Practice box breathing 🌬️",
        content1: "Inhale 4s, hold 4s, exhale 4s, hold 4s",
        content2: "Calms the nervous system",
        image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
        youtubeLink: "https://www.youtube.com/watch?v=ZfMA0YA1IVA"
      },
      {
        type: "Music",
        suggestion: "Listen to focus-enhancing music 🎼",
        content1: "Binaural beats or lo-fi instrumental",
        content2: "Supports sustained attention",
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        youtubeLink: "https://www.youtube.com/watch?v=tdzSYc5HmSU"
      },
      {
        type: "Organization",
        suggestion: "Declutter your workspace 🗑️",
        content1: "Clear visual distractions from work area",
        content2: "Reduces competing stimuli",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38",
        youtubeLink: "https://www.youtube.com/watch?v=rXCxnk6ANDk"
      }
    ]
  },
  "BPD": {
    "High Risk": [
      {
        type: "Therapy",
        suggestion: "Try TIPP skill (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation) 🧊",
        content1: "Hold ice, do jumping jacks, then deep breathing",
        content2: "DBT technique for emotional regulation",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
        youtubeLink: "https://www.youtube.com/watch?v=Yf64blB4Du8"
      },
      {
        type: "Grounding",
        suggestion: "Practice 5-4-3-2-1 technique 🌍",
        content1: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste",
        content2: "Brings focus to present moment",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        youtubeLink: "https://www.youtube.com/watch?v=30VMIEmA114&t=9s"
      },
      {
        type: "Comfort",
        suggestion: "Use a weighted blanket 🛏️",
        content1: "15-20 minutes under 10% of body weight",
        content2: "Deep pressure calms nervous system",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
        youtubeLink: "https://www.youtube.com/watch?v=UhuOoDgevCE"
      }
    ],
    "Moderate Risk": [
      {
        type: "Expression",
        suggestion: "Write then analyze emotions 📝",
        content1: "Describe feelings then challenge extreme thoughts",
        content2: "Creates emotional distance",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=_DukOlChQQQ"
      },
      {
        type: "Creativity",
        suggestion: "Engage in art therapy 🎨",
        content1: "Paint/draw emotions abstractly",
        content2: "Non-verbal emotional expression",
        image: "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea",
        youtubeLink: "https://www.youtube.com/watch?v=N0prIN3PCB4"
      },
      {
        type: "Audio",
        suggestion: "Listen to calming podcasts 🎧",
        content1: "Choose mental health or mindfulness topics",
        content2: "Provides distraction and education",
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
        youtubeLink: "https://www.youtube.com/watch?v=C9np6f1PgMY"
      }
    ],
    "Low Risk": [
      {
        type: "Distraction",
        suggestion: "Watch lighthearted movies 🎬",
        content1: "Choose comedies or nostalgic favorites",
        content2: "Temporarily shifts emotional state",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
        youtubeLink: "https://www.youtube.com/watch?v=dD95Ve5VWu4"
      },
      {
        type: "Breathing",
        suggestion: "Do 4-7-8 breathing 🌬️",
        content1: "Inhale 4s, hold 7s, exhale 8s",
        content2: "Regulates autonomic nervous system",
        image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460",
        youtubeLink: "https://www.youtube.com/watch?v=737vA-okV5E"
      },
      {
        type: "Connection",
        suggestion: "Brief check-in with friend 📱",
        content1: "Short text/voice message exchange",
        content2: "Maintains social connection",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        youtubeLink: "https://www.youtube.com/watch?v=ur48jVNNlKk"
      }
    ]
  },
  "Autism": {
    "High Risk": [
      {
        type: "Sensory",
        suggestion: "Use deep pressure therapy 🛌",
        content1: "Weighted blanket or firm hug from trusted person",
        content2: "Regulates proprioceptive input",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
        youtubeLink: "https://www.youtube.com/watch?v=BTFDy-coni4"
      },
      {
        type: "Environment",
        suggestion: "Wear noise-canceling headphones 🎧",
        content1: "Block overwhelming auditory stimuli",
        content2: "Reduces sensory overload",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
        youtubeLink: "https://www.youtube.com/watch?v=_tSIeZYEeCM"
      },
      {
        type: "Stimming",
        suggestion: "Engage in safe stimming 🤸",
        content1: "Rocking, hand-flapping with safe space",
        content2: "Self-regulates nervous system",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        youtubeLink: "https://www.youtube.com/watch?v=F5H17FHYa-k"
      }
    ],
    "Moderate Risk": [
      {
        type: "Movement",
        suggestion: "Try repetitive physical activity 🔄",
        content1: "Pacing, swinging, or rocking chair",
        content2: "Provides predictable sensory input",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b",
        youtubeLink: "https://www.youtube.com/watch?v=0jxuJMXd2KI"
      },
      {
        type: "Breathing",
        suggestion: "Structured breathing exercises 🧘",
        content1: "Follow visual breathing guide (square pattern)",
        content2: "Creates predictable routine",
        image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
        youtubeLink: "https://www.youtube.com/watch?v=bF_1ZiFta-E"
      },
      {
        type: "Cognitive",
        suggestion: "Solve puzzles or memory games 🧩",
        content1: "Jigsaw puzzles, matching games",
        content2: "Provides structured mental focus",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
        youtubeLink: "https://www.youtube.com/watch?v=f06l3-Gujo4"
      }
    ],
    "Low Risk": [
      {
        type: "Environment",
        suggestion: "Spend time in quiet space 🤫",
        content1: "Low-stimulation area with comfort items",
        content2: "Allows nervous system to reset",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
        youtubeLink: "https://www.youtube.com/watch?v=JDpULX1MnPI"
      },
      {
        type: "Audio",
        suggestion: "Listen to familiar music 🎵",
        content1: "Preferred songs at low volume",
        content2: "Predictable auditory input",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        youtubeLink: "https://www.youtube.com/watch?v=nCNqPgXDYhY"
      },
      {
        type: "Routine",
        suggestion: "Follow structured schedule 📅",
        content1: "Visual timetable of daily activities",
        content2: "Reduces anxiety about uncertainty",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
        youtubeLink: "https://www.youtube.com/watch?v=7jexR_hd6L8"
      }
    ]
  },
  "Schizophrenia": {
    "High Risk": [
      {
        type: "Support",
        suggestion: "Contact trusted support person immediately 🆘",
        content1: "Reach out to therapist/case manager",
        content2: "Professional guidance during symptoms",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        youtubeLink: "https://www.youtube.com/watch?v=PURvJV2SMso"
      },
      {
        type: "Reality",
        suggestion: "Use reality testing techniques ✔️",
        content1: "Ask trusted person to verify experiences",
        content2: "Grounds in consensual reality",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        youtubeLink: "https://www.youtube.com/watch?v=ou14N8Ica6c"
      },
      {
        type: "Distraction",
        suggestion: "Engage in simple puzzles 🧩",
        content1: "Crossword, sudoku, or word searches",
        content2: "Focuses mind on concrete tasks",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
        youtubeLink: "https://www.youtube.com/watch?v=GFgTnag6270"
      }
    ],
    "Moderate Risk": [
      {
        type: "Movement",
        suggestion: "Gentle physical activity 🚶",
        content1: "Walking or stretching with supervision",
        content2: "Regulates body without overstimulation",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b",
        youtubeLink: "https://www.youtube.com/watch?v=UfEvXIvCm-c"
      },
      {
        type: "Audio",
        suggestion: "Listen to calming nature sounds 🌊",
        content1: "Rain, ocean waves, or forest sounds",
        content2: "Soothing non-verbal audio",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969",
        youtubeLink: "https://www.youtube.com/watch?v=xRcWlA1I9z0"
      },
      {
        type: "Journal",
        suggestion: "Write thoughts in symptom journal 📓",
        content1: "Track experiences without judgment",
        content2: "Creates record for treatment team",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=7CcZ7gyFXv0"
      }
    ],
    "Low Risk": [
      {
        type: "Reading",
        suggestion: "Read familiar book 📖",
        content1: "Choose well-known comforting text",
        content2: "Provides predictable mental focus",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        youtubeLink: "https://www.youtube.com/watch?v=2kKvTi4Ta4Y"
      },
      {
        type: "Breathing",
        suggestion: "5-minute breathing exercise 🌬️",
        content1: "Count breaths up to 10, then repeat",
        content2: "Anchors to physical sensations",
        image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
        youtubeLink: "https://www.youtube.com/watch?v=enJyOTvEn4M"
      },
      {
        type: "Relaxation",
        suggestion: "Progressive muscle relaxation 💆",
        content1: "Tense/release muscle groups sequentially",
        content2: "Reduces physical tension",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        youtubeLink: "https://www.youtube.com/watch?v=SNqYG95j_UQ&t=2s"
      }
    ]
  },
  "Eating Disorders": {
    "High Risk": [
      {
        type: "Emergency",
        suggestion: "Seek professional help immediately 🆘",
        content1: "Contact treatment team or crisis line",
        content2: "Prevents medical complications",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        youtubeLink: "https://www.youtube.com/watch?v=Rc11eZdZQ8o"
      },
      {
        type: "Affirmation",
        suggestion: "Repeat body-neutral affirmations 💬",
        content1: "My worth isn't defined by my body",
        content2: "Counters disorder thoughts",
        image: "https://images.unsplash.com/photo-1491897554428-130a60dd4757",
        youtubeLink: "https://www.youtube.com/watch?v=GRNkLuOyfdE"
      },
      {
        type: "Nutrition",
        suggestion: "Follow meal plan with support 🍽️",
        content1: "Use prescribed eating schedule",
        content2: "Restores biological regularity",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        youtubeLink: "https://www.youtube.com/watch?v=RY9PylaHPEA"
      }
    ],
    "Moderate Risk": [
      {
        type: "Mindful",
        suggestion: "Practice mindful eating 🥄",
        content1: "Focus on flavors/textures without judgment",
        content2: "Rebuilds healthy food relationship",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        youtubeLink: "https://www.youtube.com/watch?v=-eFKykI1bJs"
      },
      {
        type: "Emotional",
        suggestion: "Journal pre-meal emotions 📔",
        content1: "Identify triggers for disordered behaviors",
        content2: "Increases self-awareness",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=jpHLFW5e80k"
      },
      {
        type: "Movement",
        suggestion: "Gentle post-meal stretching 🧘",
        content1: "Avoid intense exercise after eating",
        content2: "Promotes digestion without compensation",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        youtubeLink: "https://www.youtube.com/watch?v=Y08trWq4J1w"
      }
    ],
    "Low Risk": [
      {
        type: "Walking",
        suggestion: "Gentle walk with companion 🚶",
        content1: "10-15 minutes at conversational pace",
        content2: "Non-punitive movement",
        image: "https://images.unsplash.com/photo-1470004914212-05527e49370b",
        youtubeLink: "https://www.youtube.com/watch?v=nRLgcm5uX8o"
      },
      {
        type: "Audio",
        suggestion: "Listen to recovery podcasts 🎧",
        content1: "Stories of eating disorder recovery",
        content2: "Provides hope and perspective",
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
        youtubeLink: "https://www.youtube.com/watch?v=dfyi_U1-N1o"
      },
      {
        type: "Gratitude",
        suggestion: "Write body gratitude list 🙏",
        content1: "Thank your body for functions (e.g., walking)",
        content2: "Shifts focus from appearance",
        image: "https://images.unsplash.com/photo-1491897554428-130a60dd4757",
        youtubeLink: "https://www.youtube.com/watch?v=MxPfeAlKDw4"
      }
    ]
  },
  "Mental Health": {
    "High Risk": [
      {
        type: "Crisis",
        suggestion: "Contact mental health professional immediately 🆘",
        content1: "Therapist, psychiatrist, or crisis line",
        content2: "Professional support during acute distress",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        youtubeLink: "https://www.youtube.com/watch?v=nSzacnM1f1g"
      },
      {
        type: "Relaxation",
        suggestion: "Deep relaxation techniques 🧘",
        content1: "Progressive muscle relaxation or guided imagery",
        content2: "Counters fight-or-flight response",
        image: "https://images.unsplash.com/photo-1548602088-9d12a4f9c839",
        youtubeLink: "https://www.youtube.com/watch?v=0k9RiH3DMFI"
      },
      {
        type: "Support",
        suggestion: "Attend support group meeting 👥",
        content1: "In-person or online peer support",
        content2: "Reduces isolation with shared experience",
        image: " https://images.unsplash.com/photo-1529333166437-7750a6dd5a70",
        youtubeLink: "https://www.youtube.com/watch?v=KigdfV1fu0A"
      }
    ],
    "Moderate Risk": [
      {
        type: "Journal",
        suggestion: "Daily mood journaling 📓",
        content1: "Track emotions, triggers, and coping strategies",
        content2: "Identifies patterns and progress",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        youtubeLink: "https://www.youtube.com/watch?v=TA4-qQ5wEns"
      },
      {
        type: "Meditation",
        suggestion: "Guided meditation practice 🧘",
        content1: "10-minute body scan or loving-kindness",
        content2: "Builds mindfulness skills",
        image: "https://images.unsplash.com/photo-1548602088-9d12a4f9c839",
        youtubeLink: "https://www.youtube.com/watch?v=vj0JDwQLof4"
      },
      {
        type: "Movement",
        suggestion: "Gentle walking outside 🚶",
        content1: "15-20 minutes in nature if possible",
        content2: "Combines exercise with sunlight exposure",
        image: "https://images.unsplash.com/photo-1476231682828-37e571bc172f",
        youtubeLink: "https://www.youtube.com/watch?v=Fe2AsbGUWW4"
      }
    ],
    "Low Risk": [
      {
        type: "Breathing",
        suggestion: "Diaphragmatic breathing 🌬️",
        content1: "Belly breathing for 5 minutes",
        content2: "Activates parasympathetic nervous system",
        image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
        youtubeLink: "https://www.youtube.com/watch?v=Mg2ar-7_HfA"
      },
      {
        type: "Media",
        suggestion: "Watch uplifting content 📺",
        content1: "Inspirational talks or comedy",
        content2: "Temporarily boosts mood",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
        youtubeLink: "https://www.youtube.com/watch?v=W6wVU5b5nQk"
      },
      {
        type: "Social",
        suggestion: "Brief social connection 📱",
        content1: "Text/call a supportive friend",
        content2: "Maintains important relationships",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        youtubeLink: "https://www.youtube.com/watch?v=x1EYcVpQeeE"
      }
    ]
  }
};


function ChatbotSuggestionPage() {
  // State management
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("");
  const [habitData, setHabitData] = useState({});
  const [showAddAnimation, setShowAddAnimation] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoLink, setCurrentVideoLink] = useState("");
  const [apiResults, setApiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedRecommendations, setCompletedRecommendations] = useState([]);
  const [activeRecommendations, setActiveRecommendations] = useState([]);
  const [userId, setUserId] = useState(null);


  // Fetch latest results from API
  function ChatbotSuggestionPage() {
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("");
  const [habitData, setHabitData] = useState({});
  const [showAddAnimation, setShowAddAnimation] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoLink, setCurrentVideoLink] = useState("");
  const [apiResults, setApiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedRecommendations, setCompletedRecommendations] = useState([]);
  const [activeRecommendations, setActiveRecommendations] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Verify session and redirect if not authenticated
  const verifySession = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserId(response.data.userId);
    } catch (error) {
      console.error("Session verification failed:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Fetch latest results from API with auth token
  const fetchLatestResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/chatbot/results", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data) {
        throw new Error("Failed to fetch results");
      }
      
      const data = response.data;
      setApiResults(data);
      
      // Set condition and risk level from API results
      if (data.disorder && data.risk_level) {
        setSelectedCondition(data.disorder);
        setSelectedRiskLevel(data.risk_level);
      }
      
      // Parse recommendations if they're a string
      const recommendations = typeof data.recommendations === 'string' 
        ? JSON.parse(data.recommendations) 
        : data.recommendations || [];
      
      setActiveRecommendations(recommendations);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's completed recommendations
  const fetchCompletedRecommendations = async () => {
    if (!userId) return;
    
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `http://localhost:5000/api/suggestions/completed`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            userId: userId
          }
        }
      );
      
      if (response.data && response.data.completed) {
        setCompletedRecommendations(response.data.completed);
      }
    } catch (error) {
      console.error("Error fetching completed recommendations:", error);
    }
  };

  // Mark a recommendation as completed
  const markRecommendationCompleted = async (recommendationId) => {
    if (!userId) return;
    
    try {
      const token = getAuthToken();
      await axios.post(
        "http://localhost:5000/api/suggestions/complete",
        {
          userId,
          recommendationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await fetchCompletedRecommendations();
    } catch (error) {
      console.error("Error marking recommendation as completed:", error);
    }
  };

  // Remove a recommendation
  const removeRecommendation = async (recommendationId) => {
    if (!userId) return;
    
    try {
      const token = getAuthToken();
      await axios.post(
        "http://localhost:5000/api/suggestions/remove",
        {
          userId,
          recommendationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await fetchLatestResults();
    } catch (error) {
      console.error("Error removing recommendation:", error);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await verifySession();
      await fetchCompletedRecommendations();
      await fetchLatestResults();
      
      // Load habit data from localStorage
      const storedData = localStorage.getItem("habitTrackerData");
      if (storedData) {
        setHabitData(JSON.parse(storedData));
      }
    };
    
    initializeData();
  }, [userId]);

  // Save habit data to localStorage
  useEffect(() => {
    localStorage.setItem("habitTrackerData", JSON.stringify(habitData));
  }, [habitData]);

  // Get recommendations based on selected condition and risk level
  const getRecommendations = () => {
    if (
      selectedCondition &&
      selectedRiskLevel &&
      exerciseRecommendations[selectedCondition] &&
      exerciseRecommendations[selectedCondition][selectedRiskLevel]
    ) {
      return exerciseRecommendations[selectedCondition][selectedRiskLevel];
    }
    
    // If no selection, try to use API results
    if (apiResults && apiResults.disorder && apiResults.risk_level) {
      const condition = apiResults.disorder;
      const risk = apiResults.risk_level;
      
      if (exerciseRecommendations[condition] && exerciseRecommendations[condition][risk]) {
        return exerciseRecommendations[condition][risk];
      }
    }
    
    return [];
  };
}

  // Save habit data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("habitTrackerData", JSON.stringify(habitData));
  }, [habitData]);

  const handleOpenVideo = (link) => {
    setCurrentVideoLink(link);
    setShowVideoModal(true);
  };

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    setCurrentVideoLink("");
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
    setSelectedRiskLevel("");
  };

  const handleRiskLevelChange = (e) => {
    setSelectedRiskLevel(e.target.value);
  };

  const getHabitStatus = (index) => {
    const key = `${selectedCondition}-${selectedRiskLevel}-${index}`;
    return habitData[key]?.status || "pending";
  };

  const getCompletedCount = (index) => {
    const key = `${selectedCondition}-${selectedRiskLevel}-${index}`;
    return habitData[key]?.completedCount || 0;
  };

  const getStreak = (index) => {
    const key = `${selectedCondition}-${selectedRiskLevel}-${index}`;
    return habitData[key]?.streak || 0;
  };

  const handleStatusChange = (index, status) => {
    const key = `${selectedCondition}-${selectedRiskLevel}-${index}`;
    setHabitData((prevData) => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        status,
        lastUpdated: new Date().toISOString(),
        streak: status === "completed" ? (prevData[key]?.streak || 0) + 1 : 0
      },
    }));
    
    // If marking as completed, update the backend
    if (status === "completed") {
      const recommendation = getSuggestions()[index];
      if (recommendation && recommendation.id) {
        markRecommendationCompleted(recommendation.id);
      }
    }
  };

  const handleAddCount = (index) => {
    const key = `${selectedCondition}-${selectedRiskLevel}-${index}`;
    const currentCount = habitData[key]?.completedCount || 0;

    setHabitData((prevData) => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        status: "completed",
        completedCount: currentCount + 1,
        lastUpdated: new Date().toISOString(),
        streak: (prevData[key]?.streak || 0) + 1
      },
    }));

    setShowAddAnimation(index);
    setTimeout(() => {
      setShowAddAnimation(null);
    }, 1000);
    
    // Update the backend
    const recommendation = getSuggestions()[index];
    if (recommendation && recommendation.id) {
      markRecommendationCompleted(recommendation.id);
    }
  };

  const handleRemoveRecommendation = (index) => {
    const recommendation = getSuggestions()[index];
    if (recommendation && recommendation.id) {
      removeRecommendation(recommendation.id);
    }
  };

  // Get appropriate background and text color for each type
  const getTypeStyles = (type) => {
    switch (type) {
      case "Relaxation":
        return "bg-gradient-to-r from-blue-500 to-cyan-400 text-white";
      case "Activity":
        return "bg-gradient-to-r from-green-500 to-emerald-400 text-white";
      case "Habit":
        return "bg-gradient-to-r from-purple-500 to-fuchsia-400 text-white";
      case "Emergency":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "Support":
        return "bg-gradient-to-r from-orange-500 to-amber-400 text-white";
      case "Therapy":
        return "bg-gradient-to-r from-teal-500 to-emerald-400 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-400 text-white";
    }
  };

  // Get appropriate icon for each type
  const getTypeIcon = (type) => {
    switch (type) {
      case "Relaxation":
        return <Brain className="w-4 h-4" />;
      case "Activity":
        return <Activity className="w-4 h-4" />;
      case "Habit":
        return <Flame className="w-4 h-4" />;
      case "Emergency":
        return <AlertCircle className="w-4 h-4" />;
      case "Support":
        return <Heart className="w-4 h-4" />;
      case "Therapy":
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Get appropriate button styles based on status and current button
  const getButtonStyles = (currentStatus, buttonStatus) => {
    if (currentStatus === buttonStatus) {
      if (buttonStatus === "completed")
        return "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md";
      if (buttonStatus === "skipped")
        return "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md";
      if (buttonStatus === "pending")
        return "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md";
    }

    return "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 hover:from-gray-300 hover:to-gray-400 transition-colors";
  };

  // Get suggestions based on selected options
  const getSuggestions = () => {
    if (
      selectedCondition &&
      selectedRiskLevel &&
      exerciseRecommendations[selectedCondition] &&
      exerciseRecommendations[selectedCondition][selectedRiskLevel]
    ) {
      return exerciseRecommendations[selectedCondition][selectedRiskLevel];
    }
    return [];
  };

  // Get condition icon
  const getConditionIcon = (condition) => {
    switch (condition) {
      case "Depression":
        return <Heart className="w-5 h-5 mr-1 text-pink-600" />;
      case "Anxiety":
        return <Zap className="w-5 h-5 mr-1 text-yellow-500" />;
      case "Bipolar":
        return <RefreshCw className="w-5 h-5 mr-1 text-purple-600" />;
      case "OCD":
        return <Clock className="w-5 h-5 mr-1 text-blue-600" />;
      case "PTSD":
        return <Shield className="w-5 h-5 mr-1 text-red-600" />;
      case "Schizophrenia":
        return <Brain className="w-5 h-5 mr-1 text-indigo-600" />;
      case "ADHD":
        return <Flame className="w-5 h-5 mr-1 text-orange-500" />;
      case "BPD":
        return <Activity className="w-5 h-5 mr-1 text-teal-600" />;
      case "Eating Disorders":
        return <AlertCircle className="w-5 h-5 mr-1 text-amber-600" />;
      default:
        return <Lightbulb className="w-5 h-5 mr-1 text-gray-600" />;
    }
  };

  // Get risk level icon
  const getRiskLevelIcon = (riskLevel) => {
    switch (riskLevel) {
      case "High Risk":
        return <ThermometerSun className="w-5 h-5 mr-1 text-red-500" />;
      case "Moderate Risk":
        return <ThermometerSun className="w-5 h-5 mr-1 text-yellow-500" />;
      case "Low Risk":
        return <ThermometerSun className="w-5 h-5 mr-1 text-green-500" />;
      default:
        return <ThermometerSun className="w-5 h-5 mr-1 text-gray-500" />;
    }
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "High Risk":
        return "bg-gradient-to-r from-red-100 to-rose-100 border-red-300";
      case "Moderate Risk":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 border-yellow-300";
      case "Low Risk":
        return "bg-gradient-to-r from-emerald-100 to-green-100 border-green-300";
      default:
        return "bg-white border-gray-300";
    }
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    const suggestions = getSuggestions();
    if (suggestions.length === 0) return 0;
    
    let completedCount = 0;
    suggestions.forEach((_, index) => {
      if (getHabitStatus(index) === "completed" || getCompletedCount(index) > 0) {
        completedCount++;
      }
    });
    
    return Math.round((completedCount / suggestions.length) * 100);
  };

  // Get longest streak
  const getLongestStreak = () => {
    const suggestions = getSuggestions();
    if (suggestions.length === 0) return 0;
    
    let maxStreak = 0;
    suggestions.forEach((_, index) => {
      const streak = getStreak(index);
      if (streak > maxStreak) {
        maxStreak = streak;
      }
    });
    
    return maxStreak;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading your personalized recommendations...</h2>
          <p className="text-gray-500 mt-2">Analyzing your mental health assessment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Error loading recommendations</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl overflow-hidden w-full max-w-4xl">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideoLink.split('v=')[1].split('&')[0]}`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Exercise Video"
                ></iframe>
              </div>
              <div className="p-4 flex justify-end">
                <button
                  onClick={handleCloseVideo}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 pb-2">
              Mental Health Habit Tracker
            </h1>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Based on your assessment, here are personalized recommendations to support your mental well-being
          </p>
        </div>

        {/* API Results Summary */}
        {apiResults && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Bookmark className="mr-2 h-5 w-5 text-indigo-600" />
              Your Assessment Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Condition</h3>
                </div>
                <p className="text-lg font-bold text-indigo-800 mt-1">{apiResults.disorder || "Not specified"}</p>
                <p className="text-sm text-indigo-600">Confidence: {apiResults.disorder_confidence ? `${apiResults.disorder_confidence}%` : "N/A"}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-center">
                  <ThermometerSun className="h-5 w-5 text-amber-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Risk Level</h3>
                </div>
                <p className="text-lg font-bold text-amber-800 mt-1">{apiResults.risk_level || "Not specified"}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-700">Sentiment</h3>
                </div>
                <p className="text-lg font-bold text-green-800 mt-1">{apiResults.sentiment || "Not analyzed"}</p>
                <p className="text-sm text-green-600">Confidence: {apiResults.sentiment_confidence ? `${apiResults.sentiment_confidence}%` : "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Stats */}
        {selectedCondition && selectedRiskLevel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                  <p className="text-2xl font-bold text-indigo-600">{calculateCompletionRate()}%</p>
                </div>
                <div className="w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray={`${calculateCompletionRate()}, 100`}
                    />
                    <text x="18" y="20.5" textAnchor="middle" fill="#4F46E5" fontSize="10" fontWeight="bold">
                      {calculateCompletionRate()}%
                    </text>
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
                <p className="text-2xl font-bold text-green-600">{getLongestStreak()} days</p>
              </div>
              <div className="mt-2">
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(7, getLongestStreak()) }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Activities</h3>
                <p className="text-2xl font-bold text-purple-600">{getSuggestions().length}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {getSuggestions().filter((_, i) => getHabitStatus(i) === "completed" || getCompletedCount(i) > 0).length} completed
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selection Dropdowns */}
        <div className="bg-white p-7 rounded-2xl shadow-xl mb-10 border border-gray-200 transform transition-all hover:shadow-2xl backdrop-blur-sm bg-opacity-90">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Target className="mr-2 h-5 w-5 text-indigo-600" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Personalize Your Recommendations
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <Brain className="mr-1 h-4 w-4 text-indigo-600" />
                Mental Health Condition
              </label>
              <div className="relative group">
                <select
                  id="condition"
                  value={selectedCondition}
                  onChange={handleConditionChange}
                  className="w-full pl-12 rounded-xl border-2 border-indigo-100 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:border-transparent shadow-md group-hover:border-indigo-300 appearance-none"
                >
                  <option value="" disabled>
                    Select a condition
                  </option>
                  {Object.keys(exerciseRecommendations).map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="p-1.5 rounded-full bg-indigo-100">
                    {selectedCondition ? (
                      getConditionIcon(selectedCondition)
                    ) : (
                      <Brain className="w-5 h-5 text-indigo-500" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="riskLevel"
                className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
              >
                <ThermometerSun className="mr-1 h-4 w-4 text-indigo-600" />
                Risk Level
              </label>
              <div className="relative group">
                <select
                  id="riskLevel"
                  value={selectedRiskLevel}
                  onChange={handleRiskLevelChange}
                  className="w-full pl-12 rounded-xl border-2 border-indigo-100 p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:border-transparent shadow-md group-hover:border-indigo-300 appearance-none"
                  disabled={!selectedCondition}
                >
                  <option value="" disabled>
                    Select risk level
                  </option>
                  {selectedCondition &&
                    exerciseRecommendations[selectedCondition] &&
                    Object.keys(exerciseRecommendations[selectedCondition]).map(
                      (riskLevel) => (
                        <option key={riskLevel} value={riskLevel}>
                          {riskLevel}
                        </option>
                      )
                    )}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="p-1.5 rounded-full bg-indigo-100">
                    {selectedRiskLevel ? (
                      getRiskLevelIcon(selectedRiskLevel)
                    ) : (
                      <ThermometerSun className="w-5 h-5 text-indigo-500" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habit Cards */}
        {selectedCondition && selectedRiskLevel && (
          <div className="mb-8">
            <div
              className={`rounded-xl p-5 mb-6 ${getRiskLevelColor(
                selectedRiskLevel
              )} border shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getConditionIcon(selectedCondition)}
                  <h2 className="text-2xl font-bold text-gray-800 mr-6">
                    {selectedCondition}
                  </h2>
                  <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                    {getRiskLevelIcon(selectedRiskLevel)}
                    <span className="font-semibold">{selectedRiskLevel}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="px-4 py-1.5 bg-white rounded-full shadow-sm text-sm">
                    <Bookmark className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                    <span className="font-medium text-gray-700">
                      Personalized Recommendations
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mt-3 ml-7">
                These habits are tailored to help manage your specific condition
                and risk level. Track your progress daily for the best results.
              </p>
            </div>

            <div className="grid grid-flow-col auto-cols-max gap-5 overflow-x-auto pb-6 hide-scrollbar pr-4">
              {getSuggestions().map((suggestion, index) => {
                const status = getHabitStatus(index);
                const completedCount = getCompletedCount(index);
                const streak = getStreak(index);

                return (
                  <div
                    key={`${selectedCondition}-${selectedRiskLevel}-${index}`}
                    className="flex-shrink-0 bg-white rounded-2xl shadow-lg overflow-hidden w-96 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={suggestion.image}
                        alt={suggestion.suggestion}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-40"></div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${getTypeStyles(
                            suggestion.type
                          )} shadow-md`}
                        >
                          {getTypeIcon(suggestion.type)}
                          <span>{suggestion.type}</span>
                        </span>
                      </div>
                      {status === "completed" && (
                        <div className="absolute bottom-3 right-3 bg-green-500 rounded-full p-1.5 shadow-lg">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                      
                      {/* Video Play Button */}
                      <button
                        onClick={() => handleOpenVideo(suggestion.youtubeLink)}
                        className="absolute bottom-3 left-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
                        aria-label="Play video"
                        title="Watch Video"
                      >
                        <Play className="h-5 w-5 fill-current" />
                      </button>
                    </div>

                    <div className="p-4 relative">
                      {showAddAnimation === index && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="h-20 w-20 text-yellow-400 animate-sparkle" />
                        </div>
                      )}
                      <div className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 via-purple-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>

                        <h4
                          className="text-lg font-bold bg-gradient-to-r from-gray-800 via-indigo-900 to-gray-800 bg-clip-text text-transparent mb-3 line-clamp-2 h-12 hover:text-indigo-700 transition-colors duration-300 animate-fadeIn relative z-10"
                          title={suggestion.suggestion}
                        >
                          {suggestion.suggestion}
                        </h4>

                        <div className="text-sm text-gray-600 mb-2">
                          • {suggestion.content1}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          • {suggestion.content2}
                        </div>

                        <div className="mt-3 animate-slideUp">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600 flex items-center">
                              <Activity className="h-4 w-4 mr-1.5 text-indigo-500" />
                              Status:
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                className={`rounded-full ${getButtonStyles(
                                  status,
                                  "pending"
                                )} hover:scale-110 transition-all duration-300 flex items-center justify-center w-9 h-9 shadow-sm hover:shadow-md`}
                                onClick={() =>
                                  handleStatusChange(index, "pending")
                                }
                                aria-label="Mark as pending"
                                title="Pending"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                              <button
                                className={`rounded-full ${getButtonStyles(
                                  status,
                                  "completed"
                                )} hover:scale-110 transition-all duration-300 flex items-center justify-center w-9 h-9 shadow-sm hover:shadow-md`}
                                onClick={() =>
                                  handleStatusChange(index, "completed")
                                }
                                aria-label="Mark as completed"
                                title="Completed"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                className={`rounded-full ${getButtonStyles(
                                  status,
                                  "skipped"
                                )} hover:scale-110 transition-all duration-300 flex items-center justify-center w-9 h-9 shadow-sm hover:shadow-md`}
                                onClick={() =>
                                  handleStatusChange(index, "skipped")
                                }
                                aria-label="Mark as skipped"
                                title="Skipped"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-3">
                              <div className="relative group">
                                <div className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-colors duration-300 rounded-lg px-3 py-1.5 text-indigo-800 shadow-sm border border-indigo-100 group-hover:border-indigo-300">
                                  <Award className="h-4 w-4 mr-1.5 text-yellow-500 animate-pulse" />
                                  <span className="text-sm font-bold">
                                    {completedCount}{" "}
                                    {completedCount === 1 ? "time" : "times"}
                                  </span>
                                </div>
                              </div>
                              {streak > 0 && (
                                <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                  <span className="text-sm font-bold text-green-800 flex items-center">
                                    <Flame className="h-4 w-4 mr-1 text-orange-500" />
                                    {streak} day{streak !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <button
                                className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center text-sm font-medium px-3 py-1.5 rounded-lg hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg group"
                                onClick={() => handleAddCount(index)}
                                title="Add to completion count"
                              >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-gradient-x"></span>
                                <PlusCircle className="h-4 w-4 mr-1.5 group-hover:animate-ping" />
                                <span className="relative z-10">Add Count</span>
                              </button>
                              <button
                                className="relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white flex items-center text-sm font-medium px-3 py-1.5 rounded-lg hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg group"
                                onClick={() => handleRemoveRecommendation(index)}
                                title="Remove this recommendation"
                              >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500/20 to-rose-500/20 animate-gradient-x"></span>
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                <span className="relative z-10">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Recommendations Section */}
        {completedRecommendations.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Completed Recommendations
            </h2>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <ul className="space-y-2">
                {completedRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-green-100">
                    <span className="text-gray-700">{rec}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Completed
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <style>
          {`
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.6;
                transform: scale(1.2);
              }
            }
            
            @keyframes sparkle {
              0% {
                opacity: 0;
                transform: scale(0.8) rotate(0deg);
              }
              25% {
                opacity: 1;
                transform: scale(1.2) rotate(45deg);
              }
              50% {
                opacity: 1;
                transform: scale(1.4) rotate(90deg);
              }
              75% {
                opacity: 0.8;
                transform: scale(1.2) rotate(135deg);
              }
              100% {
                opacity: 0;
                transform: scale(0.8) rotate(180deg);
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-5px);
              }
            }
            
            @keyframes ping {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              75%, 100% {
                transform: scale(1.5);
                opacity: 0;
              }
            }
            
            @keyframes gradient-x {
              0%, 100% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
            }
            
            @keyframes shine {
              from {
                background-position: -100% 0;
              }
              to {
                background-position: 200% 0;
              }
            }
            
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
              50% {
                transform: translateY(-10px);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }
            
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out;
            }
            
            .animate-slideUp {
              animation: slideUp 0.8s ease-out;
            }
            
            .animate-float {
              animation: float 2s ease-in-out infinite;
            }
            
            .animate-sparkle {
              animation: sparkle 1s ease-in-out;
            }
            
            .animate-pulse {
              animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            .animate-ping {
              animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
            
            .animate-bounce {
              animation: bounce 1s infinite;
            }
            
            .animate-gradient-x {
              animation: gradient-x 3s ease infinite;
              background-size: 200% 200%;
            }
            
            .animate-shine {
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
              background-size: 200% 100%;
              animation: shine 2s infinite;
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default ChatbotSuggestionPage;
