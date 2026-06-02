import type { Instrument, TuningStatus } from '../types/Tuner.Types';

export const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const INSTRUMENTS: Instrument[] = [
  {
    key: 'chromatic',
    nameKey: 'tuner.instruments.chromatic',
    strings: [],
  },
  {
    key: 'acoustic_guitar',
    nameKey: 'tuner.instruments.acoustic_guitar',
    strings: [
      { note: 'E', octave: 4, frequency: 329.63 }, // 1ª Corda
      { note: 'B', octave: 3, frequency: 246.94 }, // 2ª Corda
      { note: 'G', octave: 3, frequency: 196.0 },  // 3ª Corda
      { note: 'D', octave: 3, frequency: 146.83 }, // 4ª Corda
      { note: 'A', octave: 2, frequency: 110.0 },  // 5ª Corda
      { note: 'E', octave: 2, frequency: 82.41 },  // 6ª Corda
    ],
  },
  {
    key: 'guitar',
    nameKey: 'tuner.instruments.guitar',
    strings: [
      { note: 'E', octave: 4, frequency: 329.63 }, // 1ª Corda
      { note: 'B', octave: 3, frequency: 246.94 }, // 2ª Corda
      { note: 'G', octave: 3, frequency: 196.0 },  // 3ª Corda
      { note: 'D', octave: 3, frequency: 146.83 }, // 4ª Corda
      { note: 'A', octave: 2, frequency: 110.0 },  // 5ª Corda
      { note: 'E', octave: 2, frequency: 82.41 },  // 6ª Corda
    ],
  },
  {
    key: 'bass',
    nameKey: 'tuner.instruments.bass',
    strings: [
      { note: 'G', octave: 2, frequency: 98.0 },   // 1ª Corda
      { note: 'D', octave: 2, frequency: 73.42 },  // 2ª Corda
      { note: 'A', octave: 1, frequency: 55.0 },   // 3ª Corda
      { note: 'E', octave: 1, frequency: 41.2 },   // 4ª Corda
    ],
  },
];

export const AUDIO_CONFIG = {
  fftSize: 2048,
  clarityThreshold: 0.85,
  rmsThresholds: {
    none: 0.003,
    weak: 0.012,
  },
  smoothingFactor: 0.08, // Média móvel exponencial mais forte para agulha suave
};

export const getTuningStatus = (cents: number): TuningStatus => {
  if (cents < -15) return 'very_low';
  if (cents < -3) return 'low';
  if (cents < -1) return 'near_in_tune';
  if (cents <= 1) return 'in_tune';
  if (cents <= 3) return 'near_sharp';
  if (cents <= 15) return 'sharp';
  return 'very_sharp';
};
