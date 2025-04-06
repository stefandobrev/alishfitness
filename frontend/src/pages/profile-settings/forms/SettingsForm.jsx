import { useFormContext } from 'react-hook-form';

import { InputField, PasswordField } from '@/components/inputs';
import {
  ActionButton,
  ButtonVariant,
  SubmitButton,
} from '@/components/buttons';

export const SettingsForm = ({
  isEditing,
  setIsEditing,
  onSubmit,
  onPasswordChange,
}) => {
  const { watch } = useFormContext();

  const password = watch('password');
  const confirm_password = watch('confirm_password');

  const isPasswordInvalid = () => {
    return password && confirm_password && password !== confirm_password;
  };

  return (
    <form onSubmit={onSubmit}>
      <>
        <div className='mb-4'>
          <InputField label='Email' id='email' readOnly={!isEditing} />
        </div>
        <div className='mb-4'>
          <InputField label='Username' id='username' readOnly={!isEditing} />
        </div>
        {isEditing && (
          <>
            <div className='mb-4'>
              <PasswordField label='Password' id='password' />
            </div>
            <div className='mb-4'>
              <PasswordField label='Confirm Password' id='confirm_password' />
            </div>

            {/* Password feedback */}
            {isPasswordInvalid() && (
              <p className='text-red-500'>Passwords don't match!</p>
            )}
          </>
        )}
        <div className='flex space-x-4'>
          {isEditing ? (
            <>
              <SubmitButton disabled={isPasswordInvalid()}>Save</SubmitButton>
              <ActionButton
                variant={ButtonVariant.GRAY_DARK}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton onClick={() => setIsEditing(true)}>
                Edit
              </ActionButton>
              <ActionButton
                variant={ButtonVariant.GRAY_DARK}
                onClick={(e) => {
                  e.preventDefault();
                  if (onPasswordChange) {
                    onPasswordChange();
                  }
                }}
              >
                Change Password
              </ActionButton>
            </>
          )}
        </div>
      </>
    </form>
  );
};
