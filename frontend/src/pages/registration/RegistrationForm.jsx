import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import InputField from '../../components/inputs/InputField';
import PasswordField from '../../components/inputs/PasswordField';
import { SaveButton } from '../../components/buttons/EditButtons';

const RegistrationForm = ({ registerUser, message }) => {
  const { handleSubmit, watch } = useFormContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const password = watch('password');
  const confirm_password = watch('confirm_password');

  const isPasswordInvalid =
    password && confirm_password && password !== confirm_password;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={handleSubmit(registerUser)} className='space-y-4'>
      <InputField label='First Name' id='first_name' />
      <InputField label='Last Name' id='last_name' />
      <InputField label='Username' id='username' />
      <InputField label='Email' id='email' />
      <PasswordField
        label='Password'
        id='password'
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <PasswordField
        label='Confirm Password'
        id='confirm_password'
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      {isPasswordInvalid && (
        <p className='text-red-500'>Passwords don't match!</p>
      )}

      {message && <p className={'text-red-500'}>{message.text}</p>}

      <div className='flex justify-center'>
        <SaveButton disabled={isPasswordInvalid}>Add User</SaveButton>
      </div>
    </form>
  );
};
export default RegistrationForm;
