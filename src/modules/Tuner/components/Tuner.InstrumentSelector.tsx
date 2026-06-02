import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import type { InstrumentKey } from '../types/Tuner.Types';
import { INSTRUMENTS } from '../constants/Tuner.Constants';
import { setInstrument } from '../store/Tuner.Slice';
import { Music, Guitar, Volume2, Compass } from 'lucide-react';

interface TunerInstrumentSelectorProps {
  selectedKey: InstrumentKey;
}

export const TunerInstrumentSelector: React.FC<TunerInstrumentSelectorProps> = ({ selectedKey }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getIcon = (key: InstrumentKey) => {
    switch (key) {
      case 'chromatic':
        return <Compass className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />;
      case 'acoustic_guitar':
        return <Music className="w-4 h-4" />;
      case 'guitar':
        return <Guitar className="w-4 h-4" />;
      case 'bass':
        return <Volume2 className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <h3 className="text-[10px] uppercase font-black tracking-widest text-tunerDark-muted text-center md:text-left select-none">
        {t('tuner.instruments.title')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {INSTRUMENTS.map((inst) => {
          const isSelected = inst.key === selectedKey;
          return (
            <button
              key={inst.key}
              onClick={() => dispatch(setInstrument(inst.key))}
              className={`group flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-[10px] sm:text-xs border transition-all duration-300 select-none whitespace-nowrap ${
                isSelected
                  ? 'bg-tunerState-success/10 border-tunerState-success text-tunerState-success shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                  : 'bg-slate-800/40 border-slate-700/60 text-tunerDark-muted hover:text-tunerDark-text hover:border-slate-600'
              }`}
            >
              {getIcon(inst.key)}
              <span>{t(inst.nameKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TunerInstrumentSelector;
