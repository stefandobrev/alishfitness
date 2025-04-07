import { setProfile } from '../slices/userSlice';
import { fetchUserProfile } from '@/pages/my-profile/helpersMyProfile';

export const fetchProfileData = () => async (dispatch) => {
  try {
    const profile = await fetchUserProfile();
    dispatch(setProfile(profile));
  } catch (error) {
    console.error('Error fetching profile data:', error);
  }
};
