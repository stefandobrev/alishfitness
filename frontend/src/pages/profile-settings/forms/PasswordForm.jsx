import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { PasswordField } from '@/components/inputs';
import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '@/components/buttons';

export const PasswordForm = ({ onSubmit, onCancel }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    formState: { errors },
  } = useFormContext();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='mb-4'>
        <PasswordField
          label='Current Password'
          id='currentPassword'
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>
      <div className='mb-4'>
        <PasswordField
          label='New Password'
          id='newPassword'
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>
      <div className='mb-4'>
        <PasswordField
          label='Confirm New Password'
          id='confirmPassword'
          isPasswordVisible={isPasswordVisible}
          togglePasswordVisibility={togglePasswordVisibility}
        />
      </div>

      <div className='flex space-x-4'>
        <SubmitButton disabled={Object.keys(errors).length > 0}>
          Save
        </SubmitButton>
        <ActionButton variant={ButtonVariant.GRAY_DARK} onClick={onCancel}>
          Cancel
        </ActionButton>
      </div>
    </form>
  );
};
