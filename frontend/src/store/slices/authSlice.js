import { createSlice } from '@reduxjs/toolkit';
import { blacklistToken } from './helpersAuth';

const initialState = {
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const logoutWithBlacklist = () => async (dispatch, getState) => {
  const { refreshToken } = getState().auth;
  if (refreshToken) {
    try {
      await blacklistToken(refreshToken);
    } catch (error) {
      console.error('Failed to blacklist token:', error);
    }
  }
  dispatch(logout());
};

export const { setUser, setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
