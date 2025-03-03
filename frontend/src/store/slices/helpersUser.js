import api from '../../utils/api';

export const fetchUserProfile = async () => {
  try {
    const response = await api('user/profile/', 'GET');
    if (!response.ok) {
      console.log('Response not ok:', response.status);
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  } catch (error) {
    console.log('Error in fetchUserProfile:', error);
    throw error;
  }
};
