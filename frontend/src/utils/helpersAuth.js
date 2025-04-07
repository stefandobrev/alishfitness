import { makeRequest } from '@/utils/api';

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await makeRequest('user/refresh-token/', 'POST', {
      refresh: refreshToken,
    });

    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to refresh token');
  }
};

export const blacklistToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await makeRequest('user/blacklist-token/', 'POST', {
      refresh: refreshToken,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to blacklist token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Blacklist token error:', error);
    throw error;
  }
};
