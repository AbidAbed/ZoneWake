import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {
  AlarmsSlice,
  addSingleAlarm,
  initialAlarms,
  updateAlarm,
  deleteAlarm,
} from './slices/AlarmsSlice';
import {
  ConfigSlice,
  changePath,
  popHistory,
  pushHistory,
} from './slices/ConfigSlice';
import {UserSlice, changeUserLocation} from './slices/UserSlice';

const Store = configureStore({
  reducer: {
    alarms: AlarmsSlice.reducer,
    config: ConfigSlice.reducer,
    user: UserSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});
setupListeners(Store.dispatch);

export {
  Store,
  changePath,
  popHistory,
  pushHistory,
  changeUserLocation,
  addSingleAlarm,
  initialAlarms,
  updateAlarm,
  deleteAlarm,
};
