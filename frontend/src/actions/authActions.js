import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  UPDATE_USER,
  UPDATE_USER_FAIL
} from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: AUTH_ERROR });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(`${API_URL}/auth/me`, config);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response?.data?.message || 'Authentication failed',
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, formData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        token: res.data.token,
        user: res.data.user
      },
    });
    dispatch(loadUser());
    return res.data;
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.message || 'Registration failed',
    });
    throw err;
  }
};

// Login User
export const login = (formData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, formData);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: res.data.token,
        user: res.data.user
      },
    });
    dispatch(loadUser());
    return res.data;
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || 'Login failed',
    });
    throw err;
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Update user profile
export const updateUser = (userData) => async (dispatch) => {
  try {
    // First update the user in Redux state
    dispatch({
      type: UPDATE_USER,
      payload: userData
    });

    // Then reload the user to ensure we have the latest data
    await dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: err.response?.data?.message || 'Failed to update profile'
    });
  }
}; 