import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile } from '@/pages/my-profile/helpersMyProfile';

const initialState = {
  profile: {
    firstName: '',
    lastName: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = { ...action.payload };
    },
    clearProfile: () => {
      return initialState;
    },
  },
});

export const fetchProfileData = () => async (dispatch) => {
  const profile = await fetchUserProfile();
  dispatch(setProfile(profile));
};

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
