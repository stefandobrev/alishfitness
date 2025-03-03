import api from '../../utils/api';

export const loginUser = async (userData) => {
  try {
    const response = await api('user/login/', 'POST', userData);

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 401) {
        return {
          type: 'error',
          text: 'Invalid username or password',
        };
      }

      return {
        type: 'error',
        text: errorData?.error || 'Server error',
      };
    }

    const data = await response.json();
    return {
      type: 'success',
      text: data,
    };
  } catch (error) {
    return {
      type: 'error',
      text: 'Login failed',
    };
  }
};
