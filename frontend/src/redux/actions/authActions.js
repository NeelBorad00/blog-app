import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set auth token in headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register user
export const register = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: response.data,
    });
    setAuthToken(response.data.token);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Registration failed';
    dispatch({
      type: 'REGISTER_FAIL',
      payload: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

// Login user
export const login = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: response.data,
    });
    setAuthToken(response.data.token);
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Login failed';
    dispatch({
      type: 'LOGIN_FAIL',
      payload: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

// Logout user
export const logout = () => (dispatch) => {
  setAuthToken(null);
  dispatch({
    type: 'LOGOUT',
  });
};

// Update user profile
export const updateUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/profile`,
      userData
    );
    dispatch({
      type: 'UPDATE_USER',
      payload: response.data,
    });
    return response.data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Profile update failed';
    dispatch({
      type: 'UPDATE_USER_FAIL',
      payload: errorMessage,
    });
    throw new Error(errorMessage);
  }
}; 