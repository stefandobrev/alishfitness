import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile } from './helpersUser';

const initialState = {
  profile: {
    first_name: '',
    last_name: '',
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
