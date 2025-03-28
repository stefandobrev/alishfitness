import { useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { PasswordField } from '../../../components/inputs';
import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '../../../components/buttons';

export const PasswordForm = ({ onSubmit, onCancel }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { watch } = useFormContext();

  const newPassword = watch('new_password');
  const confirmPassword = watch('confirm_password');

  const isPasswordInvalid = () => {
    return newPassword && confirmPassword && newPassword !== confirmPassword;
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='mb-4'>
        <PasswordField
          label='Current Password'
          id='current_password'
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>
      <div className='mb-4'>
        <PasswordField
          label='New Password'
          id='new_password'
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>
      <div className='mb-4'>
        <PasswordField
          label='Confirm New Password'
          id='confirm_password'
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>

      {isPasswordInvalid() && (
        <p className='text-red-500'>Passwords don't match!</p>
      )}

      <div className='flex space-x-4'>
        <SubmitButton disabled={isPasswordInvalid()}>Save</SubmitButton>
        <ActionButton variant={ButtonVariant.GRAY_DARK} onClick={onCancel}>
          Cancel
        </ActionButton>
      </div>
    </form>
  );
};
