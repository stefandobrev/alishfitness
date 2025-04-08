import { api } from '@/utils';
import { store } from '@/store/store';

export const fetchUserSettings = async () => {
  const response = await api('user/settings/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch settings.');
  return response.json();
};

export const updateUserSettings = async (data) => {
  const transformedData = {
    email: data.email,
    username: data.username,
    password: data.password,
    confirm_password: data.confirmPassword,
  };
  return api('user/settings/', 'PUT', transformedData);
};

export const updateUserPassword = async (data) => {
  const transformedData = {
    current_password: data.currentPassword,
    new_password: data.newPassword,
    confirm_password: data.confirmPassword,
  };
  const refreshToken = store.getState().auth.refreshToken;
  const requestData = {
    ...transformedData,
    refresh: refreshToken,
  };

  const response = await api('user/settings/password/', 'PUT', requestData);

  if (!response.ok) {
    const errorData = await response.json();
    throw { response: errorData };
  }

  return response.json();
};
