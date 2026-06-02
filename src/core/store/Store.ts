import { configureStore } from '@reduxjs/toolkit';
import tunerReducer from '../../modules/Tuner/store/Tuner.Slice';

export const store = configureStore({
  reducer: {
    tuner: tunerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
