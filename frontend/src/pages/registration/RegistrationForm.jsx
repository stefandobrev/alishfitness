import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { InputField, PasswordField } from '@/components/inputs';
import { SubmitButton } from '@/components/buttons';

const RegistrationForm = ({ registerUser, message }) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={handleSubmit(registerUser)} className='space-y-4'>
      <InputField label='First Name' id='firstName' />
      <InputField label='Last Name' id='lastName' />
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
        id='confirmPassword'
        isPasswordVisible={isPasswordVisible}
        togglePasswordVisibility={togglePasswordVisibility}
      />

      {message && <p className={'text-red-500'}>{message.text}</p>}

      <div className='flex justify-center'>
        <SubmitButton disabled={Object.keys(errors).length > 0}>
          Create User
        </SubmitButton>
      </div>
    </form>
  );
};
export default RegistrationForm;
