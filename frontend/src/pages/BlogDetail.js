import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.MuiContainer-root');
      if (!container) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate progress based on how far we've scrolled through the container
      const scrollDistance = scrollTop - containerTop;
      const totalDistance = containerHeight - windowHeight;
      
      const progress = Math.min(
        100,
        Math.max(0, (scrollDistance / totalDistance) * 100)
      );

      setReadingProgress(progress);
    };

    // Add scroll event listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener);
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]); // Re-run when blog content changes

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/blogs/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlog(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like blog');
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/blogs/${id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlog(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete blog');
      }
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Blog not found</Typography>
      </Container>
    );
  }

  return (
    <Fade in={true}>
      <Box sx={{ position: 'relative' }}>
        {/* Reading Progress Bar */}
        <Box
          sx={{
            position: 'fixed',
            top: '64px', // Height of the header
            left: 0,
            right: 0,
            zIndex: 1000,
            height: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            '@media (max-width: 600px)': {
              top: '56px', // Height of the header on mobile
            },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={readingProgress}
            sx={{
              height: '100%',
              '& .MuiLinearProgress-bar': {
                backgroundColor: (theme) => theme.palette.primary.main,
                transition: 'transform 0.1s linear',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
              },
              '& .MuiLinearProgress-bar1Determinate': {
                transition: 'transform 0.1s linear',
              },
            }}
          />
        </Box>

        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
          {/* Go Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Go Back
          </Button>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              {blog.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                By {blog.author?.name || 'Unknown Author'}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mx: 1 }}
              >
                •
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
              </Typography>
            </Box>

            {blog.tags && blog.tags.length > 0 && (
              <Box sx={{ mb: 4 }}>
                {blog.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    sx={{ mr: 1, mb: 1 }}
                    size="small"
                  />
                ))}
              </Box>
            )}

            <Box
              sx={{
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  mt: 3,
                  mb: 2,
                  fontWeight: 600,
                },
                '& p': {
                  mb: 2,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                },
                '& ul, & ol': {
                  mb: 2,
                  pl: 3,
                },
                '& li': {
                  mb: 1,
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  my: 2,
                },
                '& blockquote': {
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  my: 2,
                  backgroundColor: 'action.hover',
                },
                '& pre': {
                  backgroundColor: 'action.hover',
                  p: 2,
                  borderRadius: 1,
                  overflowX: 'auto',
                  my: 2,
                },
                '& code': {
                  backgroundColor: 'action.hover',
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontSize: '0.9em',
                },
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderTop: 1,
                borderColor: 'divider',
                pt: 2,
                mt: 4,
              }}
            >
              <IconButton
                onClick={handleLike}
                color={blog.likes?.includes(user?._id) ? 'primary' : 'default'}
                disabled={!user}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {blog.likes?.length || 0} likes
              </Typography>

              <IconButton
                onClick={handleSave}
                color={blog.saves?.includes(user?._id) ? 'primary' : 'default'}
                disabled={!user}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <BookmarkIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {blog.saves?.length || 0} saves
              </Typography>

              {user && blog.author && user._id === blog.author._id && (
                <>
                  <IconButton
                    onClick={() => navigate(`/edit/${blog._id}`)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default BlogDetail; 