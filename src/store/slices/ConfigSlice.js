import {createSlice} from '@reduxjs/toolkit';

const ConfigSlice = createSlice({
  name: 'config',
  initialState: {path: null, history: [], range: 100, speed: 2 * 0.001},
  reducers: {
    changePath(state, action) {
      return {...state, path: action.payload};
    },
    popHistory(state, action) {
      return {
        ...state,
        history: [...state.history.slice(0, state.history.length - 1)],
      };
    },
    pushHistory(state, action) {
      return {...state, history: [...state.history, action.payload]};
    },
  },
});
const {changePath, popHistory, pushHistory} = ConfigSlice.actions;

export {ConfigSlice, changePath, popHistory, pushHistory};
