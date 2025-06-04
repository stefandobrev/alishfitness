import { api, camelToSnake } from '@/utils';
import { store } from '@/store/store';

export const fetchUserSettings = async () => {
  const response = await api('users/settings/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch settings.');
  return response.json();
};

export const updateUserSettings = async (data) => {
  const transformedData = camelToSnake(data);
  try {
    const response = await api(
      'users/settings/update/',
      'PATCH',
      transformedData,
    );

    if (!response.ok) {
      const errorData = await response.json();

      const key = Object.keys(errorData)[0];
      const errorMessage = errorData[key]?.[0] || 'Something went wrong';
      return {
        type: 'error',
        text: errorMessage,
      };
    }
    return {
      type: 'success',
      text: 'Settings updated successfully!',
    };
  } catch (error) {
    console.log(error);
    return { type: 'error', text: 'Something went wrong.' };
  }
};

export const updateUserPassword = async (data) => {
  const transformedData = camelToSnake(data);
  const refreshToken = store.getState().auth.refreshToken;
  const requestData = {
    ...transformedData,
    refresh: refreshToken,
  };

  const response = await api('users/settings/password/', 'PUT', requestData);

  if (!response.ok) {
    const errorData = await response.json();
    throw { response: errorData };
  }

  return response.json();
};
