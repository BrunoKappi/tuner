import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InstrumentKey, MicrophoneState } from '../types/Tuner.Types';

interface TunerState {
  selectedInstrumentKey: InstrumentKey;
  microphoneState: MicrophoneState;
  isMuted: boolean;
  selectedLayout: 'analog' | 'meter' | 'strobe';
  selectedTheme: 'dark' | 'light';
  showInstructions: boolean;
}

const getSavedInstrument = (): InstrumentKey => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('bkappi_tuner_instrument') as InstrumentKey) || 'acoustic_guitar';
  }
  return 'acoustic_guitar';
};

const getSavedLayout = (): 'analog' | 'meter' | 'strobe' => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('bkappi_tuner_layout') as 'analog' | 'meter' | 'strobe') || 'meter';
  }
  return 'meter';
};

const getSavedTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('bkappi_tuner_theme') as 'dark' | 'light') || 'dark';
  }
  return 'dark';
};

const getSavedInstructions = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bkappi_tuner_instructions') !== 'false';
  }
  return true;
};

const initialState: TunerState = {
  selectedInstrumentKey: getSavedInstrument(),
  microphoneState: 'idle',
  isMuted: false,
  selectedLayout: getSavedLayout(),
  selectedTheme: getSavedTheme(),
  showInstructions: getSavedInstructions(),
};

export const tunerSlice = createSlice({
  name: 'tuner',
  initialState,
  reducers: {
    setInstrument: (state, action: PayloadAction<InstrumentKey>) => {
      state.selectedInstrumentKey = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bkappi_tuner_instrument', action.payload);
      }
    },
    setMicrophoneState: (state, action: PayloadAction<MicrophoneState>) => {
      state.microphoneState = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setLayout: (state, action: PayloadAction<'analog' | 'meter' | 'strobe'>) => {
      state.selectedLayout = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bkappi_tuner_layout', action.payload);
      }
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.selectedTheme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bkappi_tuner_theme', action.payload);
      }
    },
    dismissInstructions: (state) => {
      state.showInstructions = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bkappi_tuner_instructions', 'false');
      }
    },
    resetTunerState: (state) => {
      state.selectedInstrumentKey = 'acoustic_guitar';
      state.microphoneState = 'idle';
      state.isMuted = false;
      state.selectedLayout = 'meter';
      state.selectedTheme = 'dark';
      state.showInstructions = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bkappi_tuner_instrument');
        localStorage.removeItem('bkappi_tuner_layout');
        localStorage.removeItem('bkappi_tuner_theme');
        localStorage.removeItem('bkappi_tuner_instructions');
      }
    },
  },
});

export const {
  setInstrument,
  setMicrophoneState,
  setMuted,
  setLayout,
  setTheme,
  dismissInstructions,
  resetTunerState,
} = tunerSlice.actions;
export default tunerSlice.reducer;
