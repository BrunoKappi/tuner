import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InstrumentKey, MicrophoneState } from '../types/Tuner.Types';

interface TunerState {
  selectedInstrumentKey: InstrumentKey;
  microphoneState: MicrophoneState;
  isMuted: boolean;
}

const initialState: TunerState = {
  selectedInstrumentKey: 'acoustic_guitar',
  microphoneState: 'idle',
  isMuted: false,
};

export const tunerSlice = createSlice({
  name: 'tuner',
  initialState,
  reducers: {
    setInstrument: (state, action: PayloadAction<InstrumentKey>) => {
      state.selectedInstrumentKey = action.payload;
    },
    setMicrophoneState: (state, action: PayloadAction<MicrophoneState>) => {
      state.microphoneState = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    resetTunerState: (state) => {
      state.selectedInstrumentKey = 'acoustic_guitar';
      state.microphoneState = 'idle';
      state.isMuted = false;
    },
  },
});

export const { setInstrument, setMicrophoneState, setMuted, resetTunerState } = tunerSlice.actions;
export default tunerSlice.reducer;
