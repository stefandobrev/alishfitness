import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { updateUserProfile } from './helpersMyProfile';
import { setLoading } from '@/store/slices/loadingSlice';
import { fetchProfileData } from '@/store/slices/userSlice';
import { useTitle } from '@/hooks/useTitle.hook';
import { MyProfileForm } from './MyProfileForm';

export const MyProfilePage = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const [isEditing, setIsEditing] = useState(false);
  useTitle('Edit Profile');

  useEffect(() => {
    dispatch(fetchProfileData());
  }, [dispatch]);

  useEffect(() => {
    reset(profile);
  }, [profile, reset, isEditing]);

  const handleSave = async (profileData) => {
    try {
      dispatch(setLoading(true));
      await updateUserProfile(profileData);
      dispatch(fetchProfileData());
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className='flex h-[calc(100vh-108px)] items-center justify-center'>
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
  );
};
