import { api } from '@/utils';
import { store } from '@/store/store';

export const fetchUserSettings = async () => {
  const response = await api('user/settings/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch settings.');
  return response.json();
};

export const updateUserSettings = async (data) => {
  return api('user/settings/', 'PUT', data);
};

export const updateUserPassword = async (data) => {
  const refreshToken = store.getState().auth.refreshToken;
  const requestData = {
    ...data,
    refresh: refreshToken,
  };

  const response = await api('user/settings/password/', 'PUT', requestData);

  if (!response.ok) {
    const errorData = await response.json();
    throw { response: errorData };
  }

  return response.json();
};
