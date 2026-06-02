export type InstrumentKey = 'acoustic_guitar' | 'guitar' | 'bass' | 'chromatic';

export interface TuningString {
  note: string;
  octave: number;
  frequency: number;
}

export interface Instrument {
  key: InstrumentKey;
  nameKey: string;
  strings: TuningString[];
}

export interface PitchData {
  frequency: number;
  noteName: string;
  octave: number;
  cents: number;
  clarity: number;
  rms: number;
}

export type SignalLevel = 'none' | 'weak' | 'good';

export type TuningStatus =
  | 'very_low'
  | 'low'
  | 'near_in_tune'
  | 'in_tune'
  | 'near_sharp'
  | 'sharp'
  | 'very_sharp';

export type MicrophoneState = 'idle' | 'requesting' | 'active' | 'denied' | 'incompatible';
