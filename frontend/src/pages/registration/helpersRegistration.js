import { api, camelToSnake } from '@/utils';

export const registerUser = async (userData) => {
  const transformedData = camelToSnake(userData);
  try {
    const response = await api('users/create-user/', 'POST', transformedData);

    if (!response.ok) {
      const errorData = await response.json();

      let errorMessage = 'Something went wrong';
      if (errorData.username || errorData.email) {
        errorMessage = 'Username/Email unavailable.';
      }

      return {
        type: 'error',
        text: errorMessage,
      };
    }

    return {
      type: 'success',
      text: 'User created successfully!',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      type: 'error',
      text: 'Something went wrong',
    };
  }
};
