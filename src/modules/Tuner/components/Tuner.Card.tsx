import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTuner } from '../hooks/Tuner.Hook';
import { getTuningStatus } from '../constants/Tuner.Constants';
import TunerMeter from './Tuner.Meter';
import TunerInstrumentSelector from './Tuner.InstrumentSelector';
import TunerStatusDisplay from './Tuner.StatusDisplay';
import TunerControls from './Tuner.Controls';
import TunerQuickInstructions from './Tuner.QuickInstructions';
import { Mic, AlertTriangle, ShieldAlert, Globe, Radio } from 'lucide-react';

export const TunerCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    pitchData,
    microphoneState,
    selectedInstrumentKey,
    isMuted,
    signalLevel,
    startTuner,
    toggleMute,
    restartTuner,
  } = useTuner();

  // Rótulo qualitativo de afinação cromática
  const status = pitchData ? getTuningStatus(pitchData.cents) : 'very_low';

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 p-4">
      {/* Cabeçalho Minimalista da Aplicação */}
      <header className="flex items-center justify-between w-full select-none px-1">
        <div className="flex items-center gap-2">
          {/* Logo animado */}
          <div className="w-8.5 h-8.5 rounded-xl bg-tunerState-success flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Radio className="w-4.5 h-4.5 text-tunerDark-bg" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white font-sans leading-none">
              {t('tuner.title')}
            </h1>
            <p className="text-[8px] font-black uppercase tracking-widest text-tunerDark-muted mt-1 select-none">
              {t('tuner.subtitle')}
            </p>
          </div>
        </div>

        {/* Chaveador de Idiomas i18n */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-tunerDark-muted hover:text-white transition-colors duration-200"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{i18n.language === 'pt-BR' ? 'EN' : 'PT'}</span>
        </button>
      </header>

      {/* Superfície Principal do Afinador (Glassmorphism) */}
      <main className="w-full rounded-3xl glass-panel shadow-2xl p-6 flex flex-col items-center gap-6">
        
        {/* Caso 1: Idle (Aguardando clique para iniciar) */}
        {microphoneState === 'idle' && (
          <div className="w-full flex flex-col items-center py-10 gap-6 text-center select-none">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-center text-tunerDark-muted">
              <Mic className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                {t('tuner.title')}
              </h2>
              <p className="text-xs text-tunerDark-muted mt-1.5 max-w-xs">
                {t('tuner.subtitle')}
              </p>
            </div>
            
            {/* Botão com micro-animação ping pulsante */}
            <button
              onClick={startTuner}
              className="relative group flex items-center gap-2.5 bg-tunerState-success hover:bg-tunerState-success/90 active:scale-95 text-tunerDark-bg px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-2xl bg-tunerState-success/50 animate-ping opacity-70 group-hover:animate-none group-hover:opacity-0 transition-opacity" />
              <Mic className="w-4 h-4" />
              <span>{t('tuner.microphone.start')}</span>
            </button>
          </div>
        )}

        {/* Caso 2: Requesting (Negociando hardware) */}
        {microphoneState === 'requesting' && (
          <div className="w-full flex flex-col items-center py-16 gap-4 text-center select-none">
            <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-tunerState-success animate-spin" />
            <p className="text-[10px] font-black tracking-widest uppercase text-tunerDark-muted animate-pulse">
              {t('tuner.microphone.connecting')}
            </p>
          </div>
        )}

        {/* Caso 3: Active (Microfone liberado - Afinador executando) */}
        {microphoneState === 'active' && (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Grid seletor de instrumentos */}
            <TunerInstrumentSelector selectedKey={selectedInstrumentKey} />
            
            <div className="w-full border-t border-slate-800/80 my-1" />

            {/* Visor de notas, oitavas e frequências */}
            <TunerStatusDisplay
              pitchData={pitchData}
              status={status}
              isActive={!isMuted}
              signalLevel={signalLevel}
              selectedInstrumentKey={selectedInstrumentKey}
            />

            {/* Mostrador horizontal analógico graduado */}
            <TunerMeter cents={pitchData ? pitchData.cents : 0} status={status} isActive={!isMuted} />

            {/* Botões silenciar e resetar */}
            <TunerControls
              isMuted={isMuted}
              isActive={true}
              onToggleMute={toggleMute}
              onRestart={restartTuner}
            />
          </div>
        )}

        {/* Caso 4: Denied (Permissão bloqueada) */}
        {microphoneState === 'denied' && (
          <div className="w-full flex flex-col items-center py-10 gap-5 text-center select-none">
            <div className="w-16 h-16 rounded-3xl bg-tunerState-danger/10 border border-tunerState-danger/30 flex items-center justify-center text-tunerState-danger">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                {t('tuner.microphone.denied')}
              </h2>
              <p className="text-xs text-tunerDark-muted max-w-sm px-4 leading-relaxed">
                {t('tuner.microphone.denied_description')}
              </p>
            </div>
            <button
              onClick={startTuner}
              className="bg-slate-800 border border-slate-700/80 hover:bg-slate-700/40 active:scale-95 text-white py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
            >
              {t('tuner.microphone.try_again')}
            </button>
          </div>
        )}

        {/* Caso 5: Incompatible (Navegador sem suporte getUserMedia) */}
        {microphoneState === 'incompatible' && (
          <div className="w-full flex flex-col items-center py-10 gap-5 text-center select-none">
            <div className="w-16 h-16 rounded-3xl bg-tunerState-danger/10 border border-tunerState-danger/30 flex items-center justify-center text-tunerState-danger">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                {t('tuner.microphone.incompatible')}
              </h2>
              <p className="text-xs text-tunerDark-muted max-w-sm px-4 leading-relaxed font-semibold">
                {t('tuner.microphone.incompatible_description')}
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Manual de Instruções e Fluxo */}
      <TunerQuickInstructions />
    </div>
  );
};

export default TunerCard;
