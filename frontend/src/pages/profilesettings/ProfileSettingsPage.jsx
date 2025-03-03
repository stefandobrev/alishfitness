import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
  fetchUserSettings,
  updateUserSettings,
  updateUserPassword,
} from './helpersProfileSettings';
import { setLoading } from '../../store/slices/loadingSlice';
import { logoutWithBlacklist } from '../../store/slices/authSlice';
import { SettingsForm } from './SettingsForm';
import { PasswordForm } from './PasswordForm';
import { useTitle } from '../../hooks/useTitle.hook';
import userValidationResolver from '../../utils/userValidationResolver';
import Spinner from '../../components/Spinner';

export const ProfileSettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});
  const methods = useForm({
    resolver: userValidationResolver,
    context: 'profile',
  });
  const { handleSubmit, reset } = methods;
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  useTitle('Settings');

  useEffect(() => {
    const getUserSettings = async () => {
      const userSettings = await fetchUserSettings();
      setSettings(userSettings);
      reset(userSettings);
    };

    getUserSettings();
  }, [reset]);

  useEffect(() => {
    reset(settings);
  }, [isEditing, reset, settings]);

  const handleSave = async (profileData) => {
    try {
      dispatch(setLoading(true));
      await updateUserSettings(profileData);
      const updatedSettings = await fetchUserSettings();
      setSettings(updatedSettings);
      setIsEditing(false);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePasswordSave = async (passwordData) => {
    try {
      dispatch(setLoading(true));
      await updateUserPassword(passwordData);
      dispatch(logoutWithBlacklist());
      navigate('/login');
      toast.success('Password updated successfully. Please log in again.');
    } catch (error) {
      console.log(error.response);

      const errorMessages = Object.values(error.response || {}).flat();
      const errorMessage =
        errorMessages.length > 0
          ? errorMessages[0]
          : 'Failed to update password';
      toast.error(errorMessage);
      return;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePasswordChange = () => {
    setIsChangingPassword(true);
  };

  const isLoading = Object.keys(settings).length === 0;

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <div className='flex h-[calc(100vh-108px)] items-center justify-center'>
          <div className='w-full max-w-xs'>
            <h1 className='mb-4 text-2xl font-semibold'>Profile Settings</h1>
            <FormProvider {...methods}>
              {isChangingPassword ? (
                <PasswordForm
                  onSubmit={handleSubmit(handlePasswordSave)}
                  onCancel={() => {
                    setIsChangingPassword(false);
                    reset(settings);
                  }}
                />
              ) : (
                <SettingsForm
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  onSubmit={handleSubmit(handleSave)}
                  onPasswordChange={handlePasswordChange}
                />
              )}
            </FormProvider>
          </div>
        </div>
      )}
    </>
  );
};
