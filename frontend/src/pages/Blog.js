import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
  TextField,
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
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import ReadProgress from '../components/ReadProgress';
import { toast } from 'react-toastify';
import { logout } from '../features/auth/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'color', 'background',
  'link', 'image'
];

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
  const [editedTitle, setEditedTitle] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs/${id}`, {
        headers: isAuthenticated ? { Authorization: `Bearer ${user.token}` } : {}
      });
      setBlog(response.data);
      setEditedContent(response.data.content);
      setEditedTitle(response.data.title);
      setImagePreview(response.data.image);
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(logout());
        navigate('/login');
      }
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
      if (err.response?.status === 401) {
        dispatch(logout());
        navigate('/login');
      }
      setError('Failed to save blog');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        navigate('/');
        toast.success('Blog deleted successfully');
      } catch (err) {
        console.error('Error deleting blog:', err);
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('content', editedContent);
      if (editedImage) {
        formData.append('image', editedImage);
      }

      const response = await axios.put(
        `${API_URL}/blogs/${id}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setBlog(response.data);
      setIsEditing(false);
      setEditedImage(null);
      setImagePreview(response.data.image);
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

  const isAuthor = isAuthenticated && user && blog.author._id === user._id;
  const isLiked = isAuthenticated && user && blog.likes.includes(user._id);
  const isSaved = isAuthenticated && user && blog.saves.includes(user._id);

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
            {isEditing ? (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload New Image
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 2,
                        mt: 2,
                      }}
                    />
                  )}
                </Box>
                <ReactQuill
                  value={editedContent}
                  onChange={setEditedContent}
                  modules={modules}
                  formats={formats}
                  style={{ height: 400 }}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={() => {
                    setIsEditing(false);
                    setEditedTitle(blog.title);
                    setEditedContent(blog.content);
                    setImagePreview(blog.image);
                    setEditedImage(null);
                  }}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" component="h1">
                    {blog.title}
                  </Typography>
                  {isAuthor && (
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => setIsEditing(true)}>
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
                  />
                )}

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
              </>
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