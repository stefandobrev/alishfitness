import { api } from '@/utils';

export const registerUser = async (userData) => {
  const transformedData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    confirm_password: userData.confirmPassword,
  };

  try {
    const response = await api('user/create-user/', 'POST', transformedData);

    if (!response.ok) {
      const errorData = await response.json();

      let errorMessage = 'Something went wrong';
      if (errorData.username || errorData.email) {
        errorMessage = 'Username/Email unavailable';
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
