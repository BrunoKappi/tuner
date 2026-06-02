import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTuner } from '../hooks/Tuner.Hook';
import { getTuningStatus } from '../constants/Tuner.Constants';
import TunerMeter from './Tuner.Meter';
import TunerInstrumentSelector from './Tuner.InstrumentSelector';
import TunerStatusDisplay from './Tuner.StatusDisplay';
import TunerControls from './Tuner.Controls';
import TunerQuickInstructions from './Tuner.QuickInstructions';
import { Mic, AlertTriangle, ShieldAlert, Globe } from 'lucide-react';

export const TunerCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    pitchData,
    microphoneState,
    selectedInstrumentKey,
    isMuted,
    selectedLayout,
    signalLevel,
    startTuner,
    toggleMute,
    restartTuner,
    changeLayout,
  } = useTuner();

  // Rótulo qualitativo de afinação cromática
  const status = pitchData ? getTuningStatus(pitchData.cents) : 'very_low';

  const toggleLanguage = () => {
    const isPt = i18n.language.startsWith('pt');
    i18n.changeLanguage(isPt ? 'en' : 'pt-BR');
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 p-4 pt-20 pb-12">
      {/* Cabeçalho Navbar Fixa no Topo */}
      <nav className="fixed top-0 left-0 right-0 h-16 glass-panel z-50 flex items-center justify-between px-6 border-b border-slate-800/80 select-none">
        <div className="flex items-center gap-2.5">
          {/* Logo Ícone Real icon.ico */}
          <img 
            src="/icon.ico" 
            className="w-8 h-8 rounded-xl object-contain bg-slate-900/40 border border-slate-700/60 shadow-inner" 
            alt="Bkappi Tuner logo" 
          />
          <div>
            <h1 className="text-sm font-black tracking-tight text-white font-sans leading-none">
              Bkappi Tuner
            </h1>
            <p className="text-[7.5px] font-black uppercase tracking-widest text-tunerDark-muted mt-1">
              {t('tuner.subtitle')}
            </p>
          </div>
        </div>

        {/* Chaveador de Idiomas i18n Robusto */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-slate-400 hover:text-white transition-colors duration-200"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{i18n.language.startsWith('pt') ? 'EN' : 'PT'}</span>
        </button>
      </nav>

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
                Bkappi Tuner
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

        {/* Caso 2: Requesting (Conectando hardware) */}
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
          <div className="w-full flex flex-col items-center gap-5">
            {/* Seletor de instrumentos */}
            <TunerInstrumentSelector selectedKey={selectedInstrumentKey} />
            
            <div className="w-full border-t border-slate-800/80 my-0.5" />

            {/* Seletor de layout visual das notas */}
            <div className="w-full flex flex-col gap-2 select-none">
              <h3 className="text-[9px] uppercase font-black tracking-widest text-tunerDark-muted text-center md:text-left select-none">
                {t('tuner.layouts.title')}
              </h3>
              <div className="grid grid-cols-3 gap-2 w-full">
                {(['analog', 'meter', 'strobe'] as const).map((lay) => {
                  const isSel = selectedLayout === lay;
                  return (
                    <button
                      key={lay}
                      onClick={() => changeLayout(lay)}
                      className={`py-2 px-1 rounded-xl font-black text-[9px] uppercase tracking-wider border transition-all duration-300 select-none whitespace-nowrap text-center ${
                        isSel
                          ? 'bg-tunerState-success/10 border-tunerState-success text-tunerState-success shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-tunerDark-text hover:border-slate-600'
                      }`}
                    >
                      {t(`tuner.layouts.${lay}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full border-t border-slate-800/80 my-0.5" />

            {/* Visor central de notas e frequências */}
            <TunerStatusDisplay
              pitchData={pitchData}
              status={status}
              isActive={!isMuted}
              signalLevel={signalLevel}
              selectedInstrumentKey={selectedInstrumentKey}
            />

            {/* Mostrador graduado reativo (Régua / Velocímetro / Strobe) */}
            <TunerMeter 
              cents={pitchData ? pitchData.cents : 0} 
              status={status} 
              isActive={!isMuted} 
              layout={selectedLayout}
            />

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
