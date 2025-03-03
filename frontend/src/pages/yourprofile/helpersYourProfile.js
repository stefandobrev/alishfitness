import api from '../../utils/api';

export const updateUserProfile = async (profileData) => {
  return await api('user/profile/', 'PUT', profileData);
};
