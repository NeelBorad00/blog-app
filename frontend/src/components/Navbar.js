import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
} from '@mui/material';
import {
  Add as AddIcon,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [desktopMenuAnchor, setDesktopMenuAnchor] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleDesktopMenuOpen = (event) => {
    setDesktopMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMenuAnchor(null);
    setDesktopMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          BlogApp
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMenuClose}
              TransitionComponent={Grow}
            >
              {isAuthenticated ? (
                <>
                  <MenuItem onClick={() => handleNavigation('/create')}>
                    <AddIcon sx={{ mr: 1 }} /> New Blog
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/saved')}>
                    <BookmarkIcon sx={{ mr: 1 }} /> Saved
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => handleNavigation('/login')}>Login</MenuItem>
                  <MenuItem onClick={() => handleNavigation('/register')}>Register</MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Grow in={true}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleNavigation('/create')}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s',
                      },
                    }}
                  >
                    New Blog
                  </Button>
                </Grow>
                <Grow in={true}>
                  <Button
                    component={RouterLink}
                    to="/saved"
                    startIcon={<BookmarkIcon />}
                    color="inherit"
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 3,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s',
                      },
                    }}
                  >
                    Saved
                  </Button>
                </Grow>
                <Tooltip title="Account">
                  <IconButton
                    onClick={handleDesktopMenuOpen}
                    sx={{ color: 'text.primary' }}
                  >
                    {user?.avatar ? (
                      <Avatar src={user.avatar} alt={user.name} />
                    ) : (
                      <Avatar>{user?.name?.charAt(0)}</Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={desktopMenuAnchor}
                  open={Boolean(desktopMenuAnchor)}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={() => handleNavigation('/profile')}>
                    <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ color: 'text.primary' }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 