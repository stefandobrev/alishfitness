const userValidationResolver = async (data, context) => {
  const errors = {};

  if (context === 'registration' || context === 'profile') {
    if (data.username) {
      if (data.username.length < 3) {
        errors.username = {
          type: 'minLength',
          message: 'Username must be at least 3 characters long',
        };
      }
    } else {
      errors.username = {
        type: 'required',
        message: 'Username is required',
      };
    }

    if (data.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(data.email)) {
        errors.email = {
          type: 'pattern',
          message: 'Invalid email address',
        };
      }
    } else {
      errors.email = {
        type: 'required',
        message: 'Email is required',
      };
    }

    if (data.password) {
      if (data.password.length < 8) {
        errors.password = {
          type: 'minLength',
          message: 'Password must be at least 8 characters long',
        };
      }
    }
  }

  if (context === 'profile') {
    if (data.new_password) {
      if (data.new_password.length < 8) {
        errors.new_password = {
          type: 'minLength',
          message: 'Password must be at least 8 characters long',
        };
      }
    }

    if (data.current_password && !data.current_password.trim()) {
      errors.current_password = {
        type: 'required',
        message: 'Current password is required',
      };
    }
  }

  return {
    values: data,
    errors: Object.keys(errors).length > 0 ? errors : {},
  };
};

export default userValidationResolver;
