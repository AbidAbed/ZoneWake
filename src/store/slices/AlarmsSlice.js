import {createSlice} from '@reduxjs/toolkit';

const AlarmsSlice = createSlice({
  name: 'AlarmsSlice',
  initialState: [],
  reducers: {
    addSingleAlarm(state, action) {
      return [...state, {...action.payload}];
    },
    initialAlarms(state, action) {
      return [...action.payload];
    },
    updateAlarm(state, action) {
      const notUpdatedAlarms = state.filter(
        alarm => alarm.id !== action.payload.id,
      );

      return [...notUpdatedAlarms, {...action.payload}];
    },
    deleteAlarm(state, action) {
      const notDeletedAlarms = state.filter(
        alarm => alarm.id !== action.payload.id,
      );
      return [...notDeletedAlarms];
    },
  },
});

const {addSingleAlarm, initialAlarms, updateAlarm, deleteAlarm} =
  AlarmsSlice.actions;
export {AlarmsSlice, addSingleAlarm, initialAlarms, updateAlarm, deleteAlarm};
