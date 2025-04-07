import api from '@/utils/api';

export const fetchUserProfile = async () => {
  try {
    const response = await api('user/my-profile/', 'GET');
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const transformedData = {
    first_name: profileData.firstName,
    last_name: profileData.lastName,
  };
  try {
    const response = await api('user/my-profile/', 'PUT', transformedData);
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};
