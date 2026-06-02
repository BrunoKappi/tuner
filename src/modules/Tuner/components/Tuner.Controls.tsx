import React from 'react';
import { useTranslation } from 'react-i18next';
import { MicOff, Mic } from 'lucide-react';

interface TunerControlsProps {
  isMuted: boolean;
  isActive: boolean;
  onToggleMute: () => void;
}

export const TunerControls: React.FC<TunerControlsProps> = ({
  isMuted,
  isActive,
  onToggleMute,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-center">
      {/* Silenciar / Ativar Afinador Centrado */}
      <button
        disabled={!isActive}
        onClick={onToggleMute}
        className={`flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-wider border select-none focus:outline-none transition-all duration-300 ${
          !isActive
            ? 'bg-slate-200/50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-700/10 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            : isMuted
            ? 'bg-tunerState-warning/10 border-tunerState-warning/30 text-tunerState-warning hover:bg-tunerState-warning/20 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
            : 'bg-slate-100 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/80 text-slate-700 dark:text-tunerDark-text hover:bg-slate-200 dark:hover:bg-slate-700/50 dark:hover:text-white'
        }`}
      >
        {isMuted ? <Mic className="w-3 h-3 animate-pulse" /> : <MicOff className="w-3 h-3" />}
        <span>{isMuted ? t('tuner.microphone.unmute') : t('tuner.microphone.mute')}</span>
      </button>
    </div>
  );
};

export default TunerControls;
