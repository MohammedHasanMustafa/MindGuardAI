import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardActionArea, CardMedia, Grid, Button } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { motion } from "framer-motion";

const YOUTUBE_API_KEY = "AIzaSyDzY3usd4TBfcJMlV9jQT3wjAQB7wNYRL0";
const NEWSAPI_KEY = "1bdf8787bffa4420bb8c1b477d2490ca";

const Resourses = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);

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

  return (
    <Box
      sx={{
        p: 5,
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #297194, #D1E1F7, #E7F2F7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          mb: 4,
          color: "white",
          textAlign: "center",
          fontSize: "2.5rem",
          letterSpacing: "1px",
        }}
      >
        Inner Peace Resources
      </Typography>

      {/* News Articles Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "white",
          fontSize: "1.25rem",
        }}
      >
        <ArticleIcon sx={{ color: "white", fontSize: 30 }} />
        Latest Mental Health News
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {articles.slice(0, 6).map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                component={motion.div}
                sx={{
                  maxWidth: 345,
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    scale: 1.05,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    rotate: 3,
                  },
                }}
              >
                <CardActionArea component="a" href={article.url} target="_blank">
                  <CardMedia
                    component="img"
                    height="180"
                    image={article.urlToImage || "https://via.placeholder.com/300"}
                    alt="News Thumbnail"
                    sx={{
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#2C3E50", fontSize: "1rem" }}
                    >
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                      {article.source.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        mt: 2,
                        borderRadius: "50px",
                        fontWeight: "bold",
                        textTransform: "none",
                        backgroundColor: "#1E88E5",
                        "&:hover": {
                          backgroundColor: "#1565C0",
                        },
                      }}
                      href={article.url}
                      target="_blank"
                    >
                      Read More
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* YouTube Videos Section */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mt: 5,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#333",
          fontSize: "1.25rem",
        }}
      >
        <PlayCircleOutlineIcon color="primary" sx={{ fontSize: 30 }} /> Mental Health Videos
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {videos.slice(0, 6).map((video, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                component={motion.div}
                sx={{
                  maxWidth: 345,
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": {
                    scale: 1.05,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    rotate: 3,
                  },
                }}
              >
                <CardActionArea
                  component="a"
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={video.snippet.thumbnails.high.url}
                    alt="Video Thumbnail"
                    sx={{
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#2C3E50", fontSize: "1rem" }}
                    >
                      {video.snippet.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                      {video.snippet.channelTitle}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{
                        mt: 2,
                        borderRadius: "50px",
                        fontWeight: "bold",
                        textTransform: "none",
                        backgroundColor: "#D32F2F",
                        "&:hover": {
                          backgroundColor: "#C2185B",
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
  );
};

export default Resourses;
