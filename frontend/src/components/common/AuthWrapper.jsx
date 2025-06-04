import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setTokens } from '@/store/slices/authSlice';
import api from '@/utils/api';

export const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken && refreshToken) {
      const refreshTokens = async () => {
        try {
          const response = await api('users/refresh-token/', 'POST', {
            refresh: refreshToken,
          });

          if (response.ok) {
            const data = await response.json();
            dispatch(setTokens(data));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          dispatch(logout());
        }
      };

      refreshTokens();
    }
  }, [dispatch, accessToken, refreshToken]);

  return children;
};
