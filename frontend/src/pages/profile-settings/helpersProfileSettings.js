import { api, camelToSnake } from '@/utils';
import { store } from '@/store/store';

export const fetchUserSettings = async () => {
  const response = await api('user/settings/', 'GET');
  if (!response.ok) throw new Error('Failed to fetch settings.');
  return response.json();
};

export const updateUserSettings = async (data) => {
  const transformedData = camelToSnake(data);
  try {
    const response = await api('user/settings/update/', 'PUT', transformedData);

    if (!response.ok) {
      const errorData = await response.json();

      /* Hardcoding the error messages because django handles unique
      with own text. */
      let errorMessage = 'Something went wrong';
      if (errorData.username) {
        errorMessage = 'Username unavailable.';
      }
      if (errorData.email) {
        errorMessage = 'Email unavailable.';
      }
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

  const response = await api('user/settings/password/', 'PUT', requestData);

  if (!response.ok) {
    const errorData = await response.json();
    throw { response: errorData };
  }

  return response.json();
};
