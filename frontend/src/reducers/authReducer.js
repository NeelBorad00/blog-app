import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_ERROR,
  USER_LOADED,
  UPDATE_USER,
  UPDATE_USER_FAIL
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  console.log('Auth reducer action:', { type, payload });

  switch (type) {
    case USER_LOADED:
    case UPDATE_USER:
      console.log('User loaded/updated:', payload);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        error: null
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      console.log('Login/Register success:', payload);
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false,
        user: payload.user,
        error: null
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case UPDATE_USER_FAIL:
    case LOGOUT:
      console.log('Auth error/Logout:', payload);
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload
      };
    default:
      return state;
  }
} 