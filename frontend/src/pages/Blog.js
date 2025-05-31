import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import ReadProgress from '../components/ReadProgress';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`);
      setBlog(response.data);
      setEditedContent(response.data.content);
    } catch (err) {
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/blogs/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setBlog(response.data);
    } catch (err) {
      setError('Failed to like blog');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/blogs/${id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setBlog(response.data);
    } catch (err) {
      setError('Failed to save blog');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/');
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/blogs/${id}`,
        { content: editedContent },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setBlog(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update blog');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!blog) {
    return null;
  }

  const isAuthor = isAuthenticated && blog.author._id === user.id;
  const isLiked = isAuthenticated && blog.likes.includes(user.id);
  const isSaved = isAuthenticated && blog.saves.includes(user.id);

  return (
    <Fade in={true}>
      <Box>
        <ReadProgress />
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                {blog.title}
              </Typography>
              {isAuthor && (
                <Box>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => setIsEditing(!isEditing)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => setDeleteDialogOpen(true)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                By {blog.author.name}
              </Typography>
              <Chip
                icon={<AccessTimeIcon />}
                label={`${blog.readTime} min read`}
                size="small"
              />
            </Box>

            {blog.image && (
              <Box
                component="img"
                src={blog.image}
                alt={blog.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 3,
                }}
                onError={(e) => {
                  if (!blog.image.startsWith('http')) {
                    e.target.src = `${process.env.REACT_APP_API_URL}${blog.image}`;
                  }
                }}
              />
            )}

            {isEditing ? (
              <Box sx={{ mb: 3 }}>
                <ReactQuill
                  value={editedContent}
                  onChange={setEditedContent}
                  style={{ height: 400 }}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button variant="contained" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  '& .ql-editor': {
                    padding: 0,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                  },
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                <IconButton onClick={handleLike}>
                  {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                {blog.likes.length} likes
              </Typography>
              <Tooltip title={isSaved ? 'Unsave' : 'Save'}>
                <IconButton onClick={handleSave}>
                  {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {blog.linkedBlogs && blog.linkedBlogs.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Related Blogs
                </Typography>
                {blog.linkedBlogs.map((linkedBlog) => (
                  <Button
                    key={linkedBlog._id}
                    onClick={() => navigate(`/blog/${linkedBlog._id}`)}
                    sx={{ mr: 1, mb: 1 }}
                  >
                    {linkedBlog.title}
                  </Button>
                ))}
              </Box>
            )}
          </Paper>
        </Container>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Blog</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this blog? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Blog; 