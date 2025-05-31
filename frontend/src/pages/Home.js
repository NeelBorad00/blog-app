import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Pagination,
  Skeleton,
  Fade,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Delete as DeleteIcon,
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'https://blog-app-backend-0ink.onrender.com/api';

const BlogCardSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={20} width="60%" />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" height={20} width="40%" />
      </Box>
    </CardContent>
  </Card>
);

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);

  // Add debug logging for auth state
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user, token });
  }, [isAuthenticated, user, token]);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching blogs from:', `${API_URL}/blogs?page=${page}`);
      const response = await axios.get(`${API_URL}/blogs?page=${page}`);
      console.log('Blogs response:', response.data);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to fetch blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!token) {
        console.error('No token found in auth state');
        setError('Authentication required. Please log in again.');
        return;
      }

      console.log('Attempting to delete blog with token:', token);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Sending delete request with config:', config);

      const response = await axios.delete(`${API_URL}/blogs/${blogToDelete._id}`, config);
      console.log('Delete response:', response.data);

      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      fetchBlogs(); // Refresh the blog list
    } catch (err) {
      console.error('Delete error:', err.response || err);
      setError(err.response?.data?.message || 'Failed to delete blog. Please try again.');
    }
  };

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(
        `${API_URL}/blogs/${blogId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogs((prev) =>
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
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === blogId ? response.data : blog))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog');
    }
  };

  if (loading) {
    return (
      <Container>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <BlogCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Latest Blogs
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Fade in={true}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
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
                    variant="h5" 
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {blog.author.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {blog.readTime} min read
                    </Typography>
                  </Box>
                </CardContent>
                <Box 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title={isAuthenticated ? "Like" : "Login to like"}>
                        <IconButton
                          onClick={() => handleLike(blog._id)}
                          color={blog.likes?.includes(user?._id) ? 'primary' : 'default'}
                          disabled={!isAuthenticated}
                          size="small"
                          sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              backgroundColor: 'rgba(184, 207, 206, 0.08)',
                            },
                            '&:active': {
                              transform: 'scale(0.95)',
                            },
                          }}
                        >
                          <ThumbUpIcon />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary">
                        {blog.likes?.length || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title={isAuthenticated ? "Save" : "Login to save"}>
                        <IconButton
                          onClick={() => handleSave(blog._id)}
                          color={blog.saves?.includes(user?._id) ? 'primary' : 'default'}
                          disabled={!isAuthenticated}
                          size="small"
                          sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              backgroundColor: 'rgba(184, 207, 206, 0.08)',
                            },
                            '&:active': {
                              transform: 'scale(0.95)',
                            },
                          }}
                        >
                          <BookmarkIcon />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="body2" color="text.secondary">
                        {blog.saves?.length || 0}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      sx={{
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      Read
                    </Button>
                    {isAuthenticated && user && blog.author._id === user.id && (
                      <Tooltip title="Delete Blog">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(blog)}
                          size="small"
                          sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              backgroundColor: 'rgba(255, 107, 107, 0.08)',
                            },
                            '&:active': {
                              transform: 'scale(0.95)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 