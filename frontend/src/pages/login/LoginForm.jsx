import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { InputField, PasswordField } from '@/components/inputs';
import { SubmitButton } from '@/components/buttons';

const LoginForm = ({ loginUserData }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { handleSubmit } = useFormContext();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={handleSubmit(loginUserData)} className='space-y-3'>
      <InputField label='Username' id='loginUsername' />
      <PasswordField
        label='Password'
        id='loginPassword'
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      <div className='flex flex-col items-center justify-center space-y-2'>
        <SubmitButton>Sign In</SubmitButton>
        <Link to='/register' className='text-gray-900 hover:underline'>
          Don't have an account? Register
        </Link>
      </div>
    </form>
  );
};
export default LoginForm;
