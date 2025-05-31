import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post(
        `${API_URL}/blogs`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      navigate(`/blog/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
            Create New Blog
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                disabled={loading}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" disabled={loading}>
                  Upload Cover Image
                </Button>
              </label>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    mt: 2,
                    borderRadius: 1,
                  }}
                />
              )}
            </Box>

            <Box sx={{ mt: 2, mb: 8 }}>
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                style={{ height: 400 }}
                readOnly={loading}
              />
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'background.paper',
                pt: 2,
                mt: 4,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {loading ? 'Creating...' : 'Create Blog'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Fade>
  );
};

export default CreateBlog; 