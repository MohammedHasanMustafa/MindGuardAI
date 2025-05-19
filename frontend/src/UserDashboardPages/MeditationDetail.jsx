import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ChevronLeft,
  Volume2,
  Heart,
  Share2,
  Bookmark,
  Clock,
  User,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const MeditationDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const meditation = state?.meditation;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const iframeRefs = useRef([]);

  useEffect(() => {
    if (meditation) {
      fetchYouTubeVideos(meditation.title);
    }
  }, [meditation]);

  const fetchYouTubeVideos = async (query) => {
    try {
      setLoading(true);
      const API_KEY = "AIzaSyDzY3usd4TBfcJMlV9jQT3wjAQB7wNYRL0";
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
          `${query} meditation`
        )}&type=video&key=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      
      const data = await response.json();
      const videoItems = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
      
      setVideos(videoItems);
      setActiveVideo(videoItems[0]?.id || null);
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
      setError(err.message);
      // Fallback to default videos if API fails
      const fallbackVideos = [
        {
          id: "inpok4MKVLM",
          title: "Guided Meditation for Beginners",
          thumbnail: "https://i.ytimg.com/vi/inpok4MKVLM/mqdefault.jpg",
        },
      ];
      setVideos(fallbackVideos);
      setActiveVideo(fallbackVideos[0]?.id || null);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (videoId, index) => {
    setActiveVideo(videoId);
    // Force reload the iframe
    if (iframeRefs.current[index]) {
      iframeRefs.current[index].src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
  };

  if (!meditation) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5">Meditation not found</Typography>
        <Button onClick={() => navigate("/dashboard/guided-meditation")} sx={{ mt: 2 }}>
          Back to Meditations
        </Button>
      </Box>
    );
  }

  // Emoji sequences for different meditation types
  const emojiSequences = {
    Morning: ["☀️", "🌄", "🌅", "🌞", "🧘", "💪", "✨"],
    Relaxation: ["🌊", "🍃", "🌙", "🕊️", "🧘", "😌", "💆"],
    Mindfulness: ["🌱", "🌍", "🌀", "👁️", "🧠", "🔄", "✨"],
    Sleep: ["🌙", "⭐", "🌠", "🛌", "😴", "💤", "🌜"],
    Energy: ["🌀", "⚡", "🔥", "🌈", "💫", "🧘", "✨"],
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        p: { xs: 2, md: 4 },
      }}
    >
      <IconButton onClick={() => navigate(-1)} sx={{ color: "white", mb: 2 }}>
        <ChevronLeft size={24} />
      </IconButton>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={meditation.image}
              alt={meditation.title}
              sx={{
                width: "100%",
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            />

            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                {meditation.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "rgba(255, 255, 255, 0.8)" }}
              >
                {meditation.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Chip
                  icon={<Clock size={16} />}
                  label={meditation.duration}
                  sx={{ color: "white", bgcolor: "rgba(167, 139, 250, 0.2)" }}
                />
                <Chip
                  icon={<User size={16} />}
                  label={`${meditation.totalListeners} listeners`}
                  sx={{ color: "white", bgcolor: "rgba(96, 165, 250, 0.2)" }}
                />
                <Chip
                  icon={<Award size={16} />}
                  label={`${meditation.popularity}/5 rating`}
                  sx={{ color: "white", bgcolor: "rgba(74, 222, 128, 0.2)" }}
                />
              </Box>

              <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<Volume2 size={18} />}
                  sx={{
                    bgcolor: "#a78bfa",
                    "&:hover": { bgcolor: "#9061f9" },
                  }}
                >
                  Start Meditation
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Heart size={18} />}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "&:hover": { borderColor: "white" },
                  }}
                >
                  Favorite
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share2 size={18} />}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "&:hover": { borderColor: "white" },
                  }}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Visual Guide
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Emoji Sequence for {meditation.category} Meditation
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                {emojiSequences[meditation.category]?.map((emoji, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: index * 0.3,
                    }}
                    style={{ fontSize: "2rem" }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", fontStyle: "italic" }}
              >
                Follow these emojis as visual anchors during your meditation
                practice.
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Related Videos
            </Typography>
            
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}

            {activeVideo && (
              <Box sx={{ mb: 4 }}>
                <Box
                  component="iframe"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                  sx={{
                    width: "100%",
                    height: { xs: 200, md: 400 },
                    border: "none",
                    borderRadius: 2,
                    mb: 2,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Active meditation video"
                />
              </Box>
            )}

            <Grid container spacing={2}>
              {videos.map((video, index) => (
                <Grid item xs={12} sm={6} key={video.id}>
                  <Box
                    onClick={() => handleVideoSelect(video.id, index)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: activeVideo === video.id ? "rgba(167, 139, 250, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        bgcolor: "rgba(167, 139, 250, 0.1)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={video.thumbnail}
                      alt={video.title}
                      sx={{
                        width: 120,
                        height: 90,
                        borderRadius: 1,
                        objectFit: "cover",
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {video.title}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default MeditationDetail;
