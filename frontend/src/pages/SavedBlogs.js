import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Box,
  CircularProgress,
  Fade,
  Button,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SavedBlogs = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedBlogs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch saved blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBlogs();
  }, [token]);

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(
        `${API_URL}/blogs/${blogId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedBlogs((prev) =>
        prev.map((blog) => (blog._id === blogId ? response.data : blog))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like blog');
    }
  };

  const handleSave = async (blogId) => {
    try {
      const response = await axios.post(
        `${API_URL}/blogs/${blogId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedBlogs((prev) =>
        prev.filter((blog) => blog._id !== blogId)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={true}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Go Back
        </Button>

        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Saved Blogs
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {savedBlogs.length === 0 ? (
          <Typography variant="h6" color="text.secondary" align="center">
            No saved blogs yet
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {savedBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  {blog.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.image}
                      alt={blog.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {blog.content.replace(/<[^>]+>/g, '')}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      By {blog.author.name} •{' '}
                      {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      onClick={() => handleLike(blog._id)}
                      color={blog.likes.includes(blog.author._id) ? 'primary' : 'default'}
                      sx={{
                        transition: 'transform 0.2s',
                        '&:active': {
                          transform: 'scale(1.2)',
                        },
                      }}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {blog.likes.length}
                    </Typography>
                    <IconButton
                      onClick={() => handleSave(blog._id)}
                      color="primary"
                      sx={{
                        transition: 'transform 0.2s',
                        '&:active': {
                          transform: 'scale(1.2)',
                        },
                      }}
                    >
                      <BookmarkIcon />
                    </IconButton>
                    <Button
                      size="small"
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      sx={{ ml: 'auto' }}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Fade>
  );
};

export default SavedBlogs; 