import { api, camelToSnake } from '@/utils';

export const fetchUserProfile = async () => {
  try {
    const response = await api('users/my-profile/', 'GET');
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const transformedData = camelToSnake(profileData);
  try {
    const response = await api(
      'users/my-profile/update/',
      'PATCH',
      transformedData,
    );
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};
