import { useState, useCallback } from 'react';
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
  message,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    formState: { errors },
  } = useFormContext();

  const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);

  const handleCancel = () => setIsEditing(false);

  const handleEdit = () => setIsEditing(true);

  const handlePasswordClick = useCallback(
    (e) => {
      e.preventDefault();
      onPasswordChange?.();
    },
    [onPasswordChange],
  );

  return (
    <form onSubmit={onSubmit}>
      <div className='mb-4'>
        <InputField label='Email' id='email' readOnly={!isEditing} />
      </div>
      <div className='mb-4'>
        <InputField label='Username' id='username' readOnly={!isEditing} />
      </div>

      {isEditing && (
        <>
          <div className='mb-4'>
            <PasswordField
              label='Password'
              id='password'
              isPasswordVisible={isPasswordVisible}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </div>
          <div className='mb-4'>
            <PasswordField
              label='Confirm Password'
              id='confirmPassword'
              isPasswordVisible={isPasswordVisible}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </div>

          {message && <p className={'my-2 text-red-500'}>{message.text}</p>}
        </>
      )}

      <div className='flex space-x-4'>
        {isEditing ? (
          <>
            <SubmitButton disabled={Object.keys(errors).length > 0}>
              Save
            </SubmitButton>
            <ActionButton
              variant={ButtonVariant.GRAY_DARK}
              onClick={handleCancel}
            >
              Cancel
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton onClick={handleEdit}>Edit</ActionButton>
            <ActionButton
              variant={ButtonVariant.GRAY_DARK}
              onClick={handlePasswordClick}
            >
              Change Password
            </ActionButton>
          </>
        )}
      </div>
    </form>
  );
};
