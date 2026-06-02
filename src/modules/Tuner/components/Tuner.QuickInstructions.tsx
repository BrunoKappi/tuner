import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, X } from 'lucide-react';
import { useTuner } from '../hooks/Tuner.Hook';

export const TunerQuickInstructions: React.FC = () => {
  const { t } = useTranslation();
  const { closeInstructions } = useTuner();

  return (
    <div className="relative w-full flex flex-col gap-3 rounded-2xl bg-white/40 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-4 select-none">
      {/* Botão de Fechar / Ocultar Instruções */}
      <button
        onClick={closeInstructions}
        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-800/50 transition-all duration-300 focus:outline-none"
        aria-label="Ocultar instruções"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Título de Ajuda */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800/80 pb-2 pr-8">
        <HelpCircle className="w-4 h-4 text-tunerState-success" />
        <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-800 dark:text-tunerDark-text">
          {t('tuner.instructions.title')}
        </h4>
      </div>
      
      {/* Passos de Uso */}
      <ul className="flex flex-col gap-2.5 text-[10px] text-slate-500 dark:text-tunerDark-muted font-semibold leading-relaxed">
        <li className="flex gap-2">
          <span className="text-tunerState-success font-black">•</span>
          <span>{t('tuner.instructions.step1')}</span>
        </li>
        <li className="flex gap-2">
          <span className="text-tunerState-success font-black">•</span>
          <span>{t('tuner.instructions.step2')}</span>
        </li>
        <li className="flex gap-2">
          <span className="text-tunerState-success font-black">•</span>
          <span>{t('tuner.instructions.step3')}</span>
        </li>
        <li className="flex gap-2">
          <span className="text-tunerState-success font-black">•</span>
          <span>{t('tuner.instructions.step4')}</span>
        </li>
      </ul>
    </div>
  );
};

export default TunerQuickInstructions;
