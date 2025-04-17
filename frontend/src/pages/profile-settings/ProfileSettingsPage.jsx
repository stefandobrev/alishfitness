import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  fetchUserSettings,
  updateUserSettings,
  updateUserPassword,
} from './helpersProfileSettings';
import { logoutWithBlacklist } from '@/store/slices/authSlice';
import { PasswordForm, SettingsForm } from './forms';
import { Spinner } from '@/components/common';
import { useTitle } from '@/hooks/useTitle.hook';
import { profileSettings, passwordForm } from '@/schemas';

export const ProfileSettingsPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const settingsFormMethods = useForm({
    resolver: zodResolver(profileSettings),
  });
  const passwordFormMethods = useForm({
    resolver: zodResolver(passwordForm),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useTitle('Settings');

  /* Handles both canceling password change
   and entering into password change mode from within settings) */
  const togglePasswordChange = () => {
    setIsChangingPassword((prev) => !prev);
  };

  const handleSettingsSave = async (profileData) => {
    try {
      setIsLoading(true);
      const { type, text } = await updateUserSettings(profileData);

      if (type === 'error') {
        setMessage({ type, text });
        return;
      }

      if (type === 'success') {
        setIsEditing(false);
        toast.success('Settings updated successfully!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (passwordData) => {
    try {
      setIsLoading(true);
      await updateUserPassword(passwordData);
      dispatch(logoutWithBlacklist());
      navigate('/login');
      toast.success('Password updated. Please log in again.');
    } catch (error) {
      const errorMessages = Object.values(error.response || {}).flat();
      toast.error(errorMessages[0] || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const userSettings = await fetchUserSettings();

        settingsFormMethods.reset(userSettings);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [settingsFormMethods.reset]);

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <div className='flex min-h-[calc(100vh-108px)] items-center justify-center'>
          <div className='w-full max-w-xs'>
            <h1 className='mb-4 text-2xl font-semibold'>Profile Settings</h1>

            {isChangingPassword ? (
              <FormProvider {...passwordFormMethods}>
                <PasswordForm
                  onSubmit={passwordFormMethods.handleSubmit(
                    handlePasswordSave,
                  )}
                  onCancel={togglePasswordChange}
                />
              </FormProvider>
            ) : (
              <FormProvider {...settingsFormMethods}>
                <SettingsForm
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  onSubmit={settingsFormMethods.handleSubmit(
                    handleSettingsSave,
                  )}
                  onPasswordChange={togglePasswordChange}
                  message={message}
                />
              </FormProvider>
            )}
          </div>
        </div>
      )}
    </>
  );
};
