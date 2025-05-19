import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardActionArea, CardMedia, Grid, Button, Link, IconButton, Dialog, DialogContent, DialogTitle, Chip, Divider } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MicIcon from "@mui/icons-material/Mic";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ImageIcon from "@mui/icons-material/Image";
import CalculateIcon from "@mui/icons-material/Calculate";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const YOUTUBE_API_KEY = "AIzaSyDzY3usd4TBfcJMlV9jQT3wjAQB7wNYRL0";
const NEWSAPI_KEY = "1bdf8787bffa4420bb8c1b477d2490ca";

const Resources = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const fetchResources = () => {
    fetch(
      `https://newsapi.org/v2/everything?q=mental+health&language=en&sortBy=publishedAt&apiKey=${NEWSAPI_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []))
      .catch((err) => console.error("Error fetching news articles:", err));

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=mental+health&type=video&maxResults=8&key=${YOUTUBE_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setVideos(data.items || []))
      .catch((err) => console.error("Error fetching YouTube videos:", err));
  };

  useEffect(() => {
    fetchResources();
    const interval = setInterval(fetchResources, 600000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const guides = [
    {
      title: "How to Start a Fitness Routine",
      description: "Step-by-step guide to building a sustainable fitness habit",
      type: "guide",
      download: "https://resources.finalsite.net/images/v1647292567/davisk12utus/scngtoh9ngtpcjzusovv/StartinganExerciseRoutine_4StepGuide.pdf"
    },
    {
      title: "Dealing with Anxiety",
      description: "Practical strategies for managing anxiety in daily life",
      type: "guide",
      download: "https://www.mcgill.ca/counselling/files/counselling/anxiety_moodjuice_self_help_guide.pdf"
    },
    {
      title: "Mindfulness Techniques",
      description: "Illustrated walkthrough of mindfulness exercises",
      type: "guide",
      download: "https://uploads-ssl.webflow.com/60e4eec45f2723b891728a20/6131173e4809a81b3e21ccfd_73-mindfulness-exercises.pdf"
    }
  ];

  const podcasts = [
    {
      title: "Daily Wellness Podcast",
      description: "10-minute daily tips for mental and physical health",
      link: "https://podcasts.apple.com/us/podcast/daily-wellness-podcast/id1651051841"
    },
    {
      title: "Guided Meditation Series",
      description: "20-minute guided meditations for stress relief",
      link: "https://www.youtube.com/watch?v=MIr3RsUWrdo"
    },
    {
      title: "Fitness Audio Coaching",
      description: "Audio instructions for home workouts",
      link: "https://obefitness.com/blog/audio-workout-types"
    }
  ];

  const ebooks = [
    {
      title: "30-Day Workout Plan",
      description: "Complete month-long fitness program",
      download: "https://darebee.com/pdf/programs/30-days-of-change.pdf"
    },
    {
      title: "Mindfulness Journal",
      description: "Daily prompts for reflection and growth",
      download: "https://youthrex.com/wp-content/uploads/2020/04/7-Day-Mindfulness-Journal.pdf"
    },
    {
      title: "Nutrition Tracking Templates",
      description: "Printable meal planning sheets",
      download: "https://www.cdc.gov/healthyweight/pdf/food_diary_cdc.pdf"
    }
  ];

  const planners = [
    {
      title: "Workout Schedule",
      description: "Personalized weekly exercise planner",
      download: "https://www.printabulls.com/wp-content/uploads/2022/12/Printable-Goal-Planner-Pages-1-Full-Size.pdf"
    },
    {
      title: "Goal-Setting Planner",
      description: "Daily/weekly goal tracking sheets",
      download: "https://www.lssu.edu/wp-content/uploads/2021/09/SMART-Goals-Worksheet-1.pdf"
    },
    {
      title: "Wellness Reminders",
      description: "Hydration, stretching, mindfulness alerts",
      download: "https://ie.pinterest.com/pin/840202874225756503/"
    }
  ];

  const infographics = [
    {
      title: "Nutrition Guide",
      description: "Visual guide to balanced eating",
      image: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd280NmRrZnMzZGhkZXNsc3hiczZzZHU1cDljeWpiNXc0ajA3ZXR0ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ElL0NsFdtSMETMRtGV/giphy.gif"
    },
    {
      title: "Exercise Postures",
      description: "Proper form for common exercises",
      image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
    },
    {
      title: "Coping Strategies",
      description: "Mind map of emotional triggers and responses",
      image: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg"
    }
  ];

  const tools = [
    {
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index",
      link: "https://www.calculator.net/bmi-calculator.html"
    },
    {
      title: "Calorie Calculator",
      description: "Determine your daily calorie needs",
      link: "https://www.calculator.net/calorie-calculator.html"
    },
    {
      title: "Sleep Score Tool",
      description: "Assess your sleep quality",
      link: "https://www.sleepfoundation.org/sleep-calculator"
    }
  ];

  const exerciseDemos = [
    {
      title: "Yoga Flow",
      description: "Step-by-step animated guide",
      gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmxwMm9ueG02NjlrMWd5aXc0eTVqc2sxbWQ1NDd1cjl0a2U3eHN5YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fVE8soBAWSgqjoC1kS/giphy.gif"
    },
    {
      title: "Proper Squat Form",
      description: "Animated demonstration",
      gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHY3MWxjcDdxMDBxZHR5aTF1azhwbm5vaHNjb2dnMHYxazRuNmlhMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MdRI2tmI5e7HX7P76U/giphy.gif"
    },
    {
      title: "Stretching Routine",
      description: "Daily mobility exercises",
      gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjMyZXA0cTU1NDlvamhiZzdyN2tteHZjbWgyZ2JvMjUwNGpleGs0ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gsrnofq3K6WuETu/giphy.gif"
    }
  ];

  const downloads = [
    {
      title: "Positive Affirmations",
      description: "Desktop wallpapers with motivational quotes",
      download: "https://www.etsy.com/listing/1748491810/motivational-affirmations-desktop"
    },
    {
      title: "Habit Tracker",
      description: "Printable monthly habit tracker",
      download: "https://worldofprintables.com/habit-tracker-pdf/"
    },
    {
      title: "Motivational Posters",
      description: "Printable inspirational posters",
      download: "https://www.postermywall.com/index.php/l/motivational-posters"
    }
  ];

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderResourceCard = (resource, icon, color) => (
    <Grid item xs={12} sm={6} md={4} key={resource.title}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
      >
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            "&:hover": {
              boxShadow: `0 12px 24px ${color}40`,
            },
          }}
        >
          <CardActionArea 
            onClick={() => handleResourceClick(resource)}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              p: 2
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ 
                backgroundColor: `${color}20`,
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
              </Box>
              <Chip 
                label={resource.download ? "PDF" : resource.link ? "Link" : "Resource"} 
                size="small" 
                sx={{ 
                  backgroundColor: `${color}20`, 
                  color: color,
                  fontWeight: 600
                }} 
              />
            </Box>
            
            <Typography
              gutterBottom
              variant="h6"
              fontWeight="600"
              sx={{ 
                color: "#2C3E50", 
                fontSize: "1.1rem",
                lineHeight: 1.3,
                mb: 1
              }}
            >
              {resource.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: "0.875rem",
                mb: 2,
                flexGrow: 1
              }}
            >
              {resource.description}
            </Typography>
            
            <Button
              variant="contained"
              size="small"
              sx={{
                width: '100%',
                borderRadius: "8px",
                fontWeight: "600",
                textTransform: "none",
                backgroundColor: color,
                "&:hover": {
                  backgroundColor: color,
                  opacity: 0.9,
                  boxShadow: `0 4px 12px ${color}80`
                },
              }}
            >
              {resource.download ? "Download" : resource.link ? "View" : "Open"}
            </Button>
          </CardActionArea>
        </Card>
      </motion.div>
    </Grid>
  );

  const SectionHeader = ({ icon, title, subtitle }) => (
    <Box sx={{ 
      textAlign: 'center', 
      mb: 4,
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Box sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        width: 60,
        height: 60,
        mb: 2
      }}>
        {React.cloneElement(icon, { 
          sx: { 
            color: 'white', 
            fontSize: 30 
          } 
        })}
      </Box>
      <Typography
        variant="h4"
        fontWeight="700"
        sx={{
          color: "white",
          fontSize: "1.8rem",
          letterSpacing: "0.5px",
          mb: 1
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1rem",
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #297194, #D1E1F7, #E7F2F7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: { xs: 2, md: 4 },
        mb: 4,
        maxWidth: '800px'
      }}>
        <Typography
          variant="h1"
          fontWeight="800"
          sx={{
            mb: 3,
            color: "white",
            fontSize: { xs: "2.2rem", md: "3rem" },
            letterSpacing: "0.5px",
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Discover Wellness Resources
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: { xs: "1rem", md: "1.2rem" },
            fontWeight: 400,
            mb: 3
          }}
        >
          Curated collection of tools, guides, and materials to support your mental and physical health journey
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Chip label="Mental Health" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="Fitness Guides" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          <Chip label="Wellness Tools" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
        </Box>
      </Box>

      {/* Articles and Guides Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<MenuBookIcon />} 
          title="Articles and Guides" 
          subtitle="Expert-written resources to help you on your wellness journey"
        />
        <Grid container spacing={3} justifyContent="center">
          {guides.map((guide) => renderResourceCard(guide, <MenuBookIcon />, "#4CAF50"))}
        </Grid>
      </Box>

      {/* News Articles Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<ArticleIcon />} 
          title="Latest Mental Health News" 
          subtitle="Stay updated with the latest research and developments"
        />
        <Grid container spacing={3} justifyContent="center">
          {articles.slice(0, 3).map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    "&:hover": {
                      boxShadow: "0 12px 24px rgba(30, 136, 229, 0.2)",
                    },
                  }}
                >
                  <CardActionArea
                    component="a"
                    href={article.url}
                    target="_blank"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={article.urlToImage || "https://via.placeholder.com/300"}
                      alt="News Thumbnail"
                      sx={{
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Chip 
                        label="News" 
                        size="small" 
                        sx={{ 
                          backgroundColor: "rgba(30, 136, 229, 0.1)", 
                          color: "#1E88E5",
                          fontWeight: 600,
                          mb: 1.5
                        }} 
                      />
                      <Typography
                        gutterBottom
                        variant="h6"
                        fontWeight="600"
                        sx={{ 
                          color: "#2C3E50", 
                          fontSize: "1.1rem",
                          lineHeight: 1.3,
                          mb: 1
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: "0.875rem",
                          mb: 2
                        }}
                      >
                        {article.source?.name || "Unknown source"}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          width: '100%',
                          borderRadius: "8px",
                          fontWeight: "600",
                          textTransform: "none",
                          backgroundColor: "#1E88E5",
                          "&:hover": {
                            backgroundColor: "#1565C0",
                            boxShadow: "0 4px 12px rgba(30, 136, 229, 0.4)"
                          },
                        }}
                        href={article.url}
                        target="_blank"
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Podcasts Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<MicIcon />} 
          title="Podcasts & Audio Sessions" 
          subtitle="Listen and learn from wellness experts on the go"
        />
        <Grid container spacing={3} justifyContent="center">
          {podcasts.map((podcast) => renderResourceCard(podcast, <MicIcon />, "#9C27B0"))}
        </Grid>
      </Box>

      {/* E-books Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<MenuBookIcon />} 
          title="E-books & PDFs" 
          subtitle="Downloadable resources for deeper learning"
        />
        <Grid container spacing={3} justifyContent="center">
          {ebooks.map((ebook) => renderResourceCard(ebook, <MenuBookIcon />, "#FF9800"))}
        </Grid>
      </Box>

      {/* Planners Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<CalendarTodayIcon />} 
          title="Interactive Planners" 
          subtitle="Tools to help you organize your wellness journey"
        />
        <Grid container spacing={3} justifyContent="center">
          {planners.map((planner) => renderResourceCard(planner, <CalendarTodayIcon />, "#2196F3"))}
        </Grid>
      </Box>

      {/* Infographics Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<ImageIcon />} 
          title="Infographics & Visual Aids" 
          subtitle="Visual resources for quick learning"
        />
        <Grid container spacing={3} justifyContent="center">
          {infographics.map((infographic) => renderResourceCard(infographic, <ImageIcon />, "#00BCD4"))}
        </Grid>
      </Box>

      {/* Tools Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<CalculateIcon />} 
          title="Tools & Calculators" 
          subtitle="Interactive tools to track your progress"
        />
        <Grid container spacing={3} justifyContent="center">
          {tools.map((tool) => renderResourceCard(tool, <CalculateIcon />, "#607D8B"))}
        </Grid>
      </Box>

      {/* Exercise Demos Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<FitnessCenterIcon />} 
          title="Exercise Demos" 
          subtitle="Visual guides for proper form and technique"
        />
        <Grid container spacing={3} justifyContent="center">
          {exerciseDemos.map((demo) => renderResourceCard(demo, <FitnessCenterIcon />, "#F44336"))}
        </Grid>
      </Box>

      {/* Downloads Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<DownloadIcon />} 
          title="Downloadable Resources" 
          subtitle="Printables and materials for offline use"
        />
        <Grid container spacing={3} justifyContent="center">
          {downloads.map((download) => renderResourceCard(download, <DownloadIcon />, "#795548"))}
        </Grid>
      </Box>

      {/* YouTube Videos Section */}
      <Box sx={{ width: '100%', maxWidth: '1400px' }}>
        <SectionHeader 
          icon={<PlayCircleOutlineIcon />} 
          title="Mental Health Videos" 
          subtitle="Engaging video content from trusted sources"
        />
        <Grid container spacing={3} justifyContent="center">
          {videos.slice(0, 3).map((video, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: "12px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    "&:hover": {
                      boxShadow: "0 12px 24px rgba(211, 47, 47, 0.2)",
                    },
                  }}
                >
                  <CardActionArea
                    component="a"
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={video.snippet.thumbnails.high.url}
                      alt="Video Thumbnail"
                      sx={{
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Chip 
                        label="Video" 
                        size="small" 
                        sx={{ 
                          backgroundColor: "rgba(211, 47, 47, 0.1)", 
                          color: "#D32F2F",
                          fontWeight: 600,
                          mb: 1.5
                        }} 
                      />
                      <Typography
                        gutterBottom
                        variant="h6"
                        fontWeight="600"
                        sx={{ 
                          color: "#2C3E50", 
                          fontSize: "1.1rem",
                          lineHeight: 1.3,
                          mb: 1
                        }}
                      >
                        {video.snippet.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: "0.875rem",
                          mb: 2
                        }}
                      >
                        {video.snippet.channelTitle}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          width: '100%',
                          borderRadius: "8px",
                          fontWeight: "600",
                          textTransform: "none",
                          backgroundColor: "#D32F2F",
                          "&:hover": {
                            backgroundColor: "#B71C1C",
                            boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)"
                          },
                        }}
                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                        target="_blank"
                      >
                        Watch Now
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Resource Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          pb: 2
        }}>
          <Typography variant="h5" fontWeight="600">
            {selectedResource?.title}
          </Typography>
          <IconButton 
            onClick={handleCloseDialog}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedResource?.image && (
            <Box sx={{ 
              mb: 3,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={selectedResource.image} 
                alt={selectedResource.title} 
                style={{ width: "100%", display: 'block' }} 
              />
            </Box>
          )}
          {selectedResource?.gif && (
            <Box sx={{ 
              mb: 3,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={selectedResource.gif} 
                alt={selectedResource.title} 
                style={{ width: "100%", display: 'block' }} 
              />
            </Box>
          )}
          <Typography variant="body1" sx={{ 
            mb: 3,
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'rgba(0,0,0,0.8)'
          }}>
            {selectedResource?.description}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {selectedResource?.download && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                href={selectedResource.download}
                download
                sx={{ 
                  borderRadius: '8px',
                  fontWeight: '600',
                  px: 3,
                  py: 1
                }}
              >
                Download Resource
              </Button>
            )}
            {selectedResource?.link && (
              <Button
                variant="contained"
                color="primary"
                href={selectedResource.link}
                target="_blank"
                sx={{ 
                  borderRadius: '8px',
                  fontWeight: '600',
                  px: 3,
                  py: 1
                }}
              >
                Open Resource
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Resources;
