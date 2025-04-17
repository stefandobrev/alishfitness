import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import { updateUserProfile } from './helpersMyProfile';
import { fetchProfileData } from '@/store/actions';
import { useTitle } from '@/hooks/useTitle.hook';
import { MyProfileForm } from './MyProfileForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/common';
import { myProfile } from '@/schemas';

export const MyProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const methods = useForm({
    resolver: zodResolver(myProfile),
  });
  const { handleSubmit, reset } = methods;

  useTitle('Edit Profile');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        dispatch(fetchProfileData());
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.first_name,
        lastName: profile.last_name,
      });
    }
  }, [profile, reset, isEditing]);

  const handleSave = async (profileData) => {
    try {
      setIsLoading(true);
      await updateUserProfile(profileData);
      dispatch(fetchProfileData());
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner loading={isLoading} className='min-h-[70vh]' />
      ) : (
        <div className='flex min-h-[calc(100vh-108px)] items-center justify-center'>
          <div className='w-full max-w-xs'>
            <h1 className='mb-4 text-2xl font-semibold'>My Profile</h1>
            <FormProvider {...methods}>
              <MyProfileForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSubmit={handleSubmit(handleSave)}
              />
            </FormProvider>
          </div>
        </div>
      )}
    </>
  );
};
