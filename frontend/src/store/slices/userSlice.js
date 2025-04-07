import { createSlice } from '@reduxjs/toolkit';

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

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
