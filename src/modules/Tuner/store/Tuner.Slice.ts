import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InstrumentKey, MicrophoneState } from '../types/Tuner.Types';

interface TunerState {
  selectedInstrumentKey: InstrumentKey;
  microphoneState: MicrophoneState;
  isMuted: boolean;
  selectedLayout: 'analog' | 'meter' | 'strobe';
}

const initialState: TunerState = {
  selectedInstrumentKey: 'acoustic_guitar',
  microphoneState: 'idle',
  isMuted: false,
  selectedLayout: 'meter', // Velocímetro como padrão
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
    setLayout: (state, action: PayloadAction<'analog' | 'meter' | 'strobe'>) => {
      state.selectedLayout = action.payload;
    },
    resetTunerState: (state) => {
      state.selectedInstrumentKey = 'acoustic_guitar';
      state.microphoneState = 'idle';
      state.isMuted = false;
      state.selectedLayout = 'meter';
    },
  },
});

export const { setInstrument, setMicrophoneState, setMuted, setLayout, resetTunerState } = tunerSlice.actions;
export default tunerSlice.reducer;
