import {createSlice} from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'User',
  initialState: {longitude: -100.4324, latitude: 30.78825},
  reducers: {
    changeUserLocation(state, action) {
      return {
        ...state,
        longitude: action.payload.longitude,
        latitude: action.payload.latitude,
      };
    },
  },
});
const {changeUserLocation} = UserSlice.actions;
export {UserSlice, changeUserLocation};
