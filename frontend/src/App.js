import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './actions/authActions';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import SavedBlogs from './pages/SavedBlogs';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#B8CFCE',
      light: '#EAEFEF',
      dark: '#7F8CAA',
      contrastText: '#333446',
    },
    secondary: {
      main: '#7F8CAA',
      light: '#B8CFCE',
      dark: '#333446',
      contrastText: '#EAEFEF',
    },
    background: {
      default: '#1A1B26',
      paper: '#24283B',
    },
    text: {
      primary: '#EAEFEF',
      secondary: '#B8CFCE',
    },
    divider: 'rgba(234, 239, 239, 0.08)',
    action: {
      active: '#B8CFCE',
      hover: 'rgba(184, 207, 206, 0.08)',
      selected: 'rgba(184, 207, 206, 0.16)',
      disabled: 'rgba(234, 239, 239, 0.3)',
      disabledBackground: 'rgba(234, 239, 239, 0.12)',
    },
    error: {
      main: '#ff6b6b',
      light: '#ff8e8e',
      dark: '#cc5555',
      contrastText: '#EAEFEF',
    },
    warning: {
      main: '#ffd93d',
      light: '#ffe066',
      dark: '#ccad30',
      contrastText: '#333446',
    },
    info: {
      main: '#7F8CAA',
      light: '#B8CFCE',
      dark: '#333446',
      contrastText: '#EAEFEF',
    },
    success: {
      main: '#6bff6b',
      light: '#8eff8e',
      dark: '#55cc55',
      contrastText: '#333446',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
      color: '#EAEFEF',
      background: 'linear-gradient(45deg, #EAEFEF 30%, #B8CFCE 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
      color: '#EAEFEF',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#EAEFEF',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#EAEFEF',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#EAEFEF',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#EAEFEF',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#B8CFCE',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#7F8CAA',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(45deg, #B8CFCE 30%, #7F8CAA 90%)',
          boxShadow: '0 3px 5px 2px rgba(184, 207, 206, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7F8CAA 30%, #B8CFCE 90%)',
            boxShadow: '0 4px 8px 2px rgba(184, 207, 206, .4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          borderColor: '#B8CFCE',
          color: '#B8CFCE',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(184, 207, 206, 0.08)',
            borderColor: '#EAEFEF',
            color: '#EAEFEF',
          },
        },
        text: {
          color: '#B8CFCE',
          '&:hover': {
            backgroundColor: 'rgba(184, 207, 206, 0.08)',
            color: '#EAEFEF',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          backgroundImage: 'none',
          border: '1px solid rgba(184, 207, 206, 0.1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(184, 207, 206, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#B8CFCE',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7F8CAA',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 27, 38, 0.9)',
          backdropFilter: 'blur(8px)',
          color: '#EAEFEF',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(184, 207, 206, 0.1)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          backgroundImage: 'none',
          backgroundColor: '#24283B',
          border: '1px solid rgba(184, 207, 206, 0.1)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          '&:hover': {
            backgroundColor: 'rgba(184, 207, 206, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(127, 140, 170, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(127, 140, 170, 0.24)',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          color: '#B8CFCE',
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: 'rgba(184, 207, 206, 0.08)',
            color: '#EAEFEF',
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8,
            color: '#B8CFCE',
            '&.Mui-selected': {
              background: 'linear-gradient(45deg, #B8CFCE 30%, #7F8CAA 90%)',
              color: '#333446',
              '&:hover': {
                background: 'linear-gradient(45deg, #7F8CAA 30%, #B8CFCE 90%)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(184, 207, 206, 0.08)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(184, 207, 206, 0.08)',
          color: '#B8CFCE',
          border: '1px solid rgba(184, 207, 206, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(184, 207, 206, 0.12)',
          },
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #B8CFCE 30%, #7F8CAA 90%)',
          color: '#333446',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(45deg, #7F8CAA 30%, #B8CFCE 90%)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#B8CFCE',
          textDecoration: 'none',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '1px',
            bottom: -2,
            left: 0,
            backgroundColor: '#B8CFCE',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom right',
            transition: 'transform 0.3s ease-out',
          },
          '&:hover': {
            color: '#EAEFEF',
            '&:after': {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(184, 207, 206, 0.1)',
        },
      },
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  if (loading) {
    return null; // or a loading spinner
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
              <Route
                path="/create"
                element={
                  <PrivateRoute>
                    <CreateBlog />
                  </PrivateRoute>
                }
              />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute>
                    <EditBlog />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/saved" element={<PrivateRoute><SavedBlogs /></PrivateRoute>} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
