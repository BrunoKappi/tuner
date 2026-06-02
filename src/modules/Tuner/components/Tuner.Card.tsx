import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTuner } from '../hooks/Tuner.Hook';
import { getTuningStatus } from '../constants/Tuner.Constants';
import TunerMeter from './Tuner.Meter';
import TunerInstrumentSelector from './Tuner.InstrumentSelector';
import TunerStatusDisplay from './Tuner.StatusDisplay';
import TunerControls from './Tuner.Controls';
import TunerQuickInstructions from './Tuner.QuickInstructions';
import { Mic, AlertTriangle, ShieldAlert, Globe, Sun, Moon, Activity, Gauge, Disc } from 'lucide-react';

export const TunerCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const {
    pitchData,
    microphoneState,
    selectedInstrumentKey,
    isMuted,
    selectedLayout,
    selectedTheme,
    showInstructions,
    signalLevel,
    startTuner,
    toggleMute,
    changeLayout,
    changeTheme,
  } = useTuner();

  const getLayoutIcon = (lay: 'analog' | 'meter' | 'strobe') => {
    switch (lay) {
      case 'analog':
        return <Activity className="w-4 h-4" />;
      case 'meter':
        return <Gauge className="w-4 h-4" />;
      case 'strobe':
        return <Disc className="w-4 h-4" />;
    }
  };

  // Estados locais para aviso de Cookies
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);

  // Monitora se o consentimento de cookies foi dado no passado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('bkappi_tuner_cookies_accepted');
      if (accepted !== 'true') {
        setShowCookieBanner(true);
      }
    }
  }, []);

  // Monitora e aplica a classe de tema claro/escuro nos nós html e body diretamente com base no estado do Redux
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = window.document.documentElement;
      const body = window.document.body;
      console.log('Bkappi Tuner applying theme class:', selectedTheme);
      if (selectedTheme === 'dark') {
        html.classList.add('dark');
        body.classList.add('dark');
      } else {
        html.classList.remove('dark');
        body.classList.remove('dark');
      }
    }
  }, [selectedTheme]);

  const acceptCookies = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bkappi_tuner_cookies_accepted', 'true');
      setShowCookieBanner(false);
    }
  };

  const toggleTheme = () => {
    const nextTheme = selectedTheme === 'dark' ? 'light' : 'dark';
    
    // Aplicar síncrono imediato para garantia visual absoluta
    if (typeof window !== 'undefined') {
      const html = window.document.documentElement;
      const body = window.document.body;
      if (nextTheme === 'dark') {
        html.classList.add('dark');
        body.classList.add('dark');
      } else {
        html.classList.remove('dark');
        body.classList.remove('dark');
      }
    }
    
    changeTheme(nextTheme);
  };

  // Rótulo qualitativo de afinação cromática
  const status = pitchData ? getTuningStatus(pitchData.cents) : 'very_low';

  const toggleLanguage = () => {
    const isPt = i18n.language.startsWith('pt');
    i18n.changeLanguage(isPt ? 'en' : 'pt-BR');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-4 pt-16 pb-8 transition-all duration-300">
      {/* Cabeçalho Navbar Fixa no Topo */}
      <nav className="fixed top-0 left-0 right-0 h-14 border-b border-slate-200 bg-white/70 dark:border-slate-800/80 dark:bg-slate-900/70 backdrop-blur-xl z-50 flex items-center justify-between px-6 select-none transition-all duration-300">
        <div className="flex items-center gap-2.5">
          {/* Logo Ícone Real icon.ico */}
          <img 
            src="/icon.ico" 
            className="w-8 h-8 rounded-xl object-contain bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 shadow-inner" 
            alt="Bkappi Tuner logo" 
          />
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-sans leading-none">
              Bkappi Tuner
            </h1>
            <p className="text-[7.5px] font-black uppercase tracking-widest text-slate-450 dark:text-tunerDark-muted mt-1 select-none hidden sm:block">
              {t('tuner.subtitle')}
            </p>
          </div>
        </div>

        {/* Lado Direito: Link do Criador, Tema e Idioma */}
        <div className="flex items-center gap-3.5">
          <a
            href="https://portfolio.bkappi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-slate-500 hover:text-tunerState-success dark:text-slate-400 dark:hover:text-tunerState-success transition-all duration-300 select-none"
          >
            <span className="inline sm:hidden">{i18n.language.startsWith('pt') ? 'Autor' : 'Author'}</span>
            <span className="hidden sm:inline">{t('tuner.creator')}</span>
          </a>

          {/* Divisor vertical sutil */}
          <span className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Botão de Tema Sol/Lua */}
          <button
            onClick={toggleTheme}
            className="text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors duration-300 focus:outline-none flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
            aria-label="Mudar Tema"
          >
            {selectedTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 animate-pulse pointer-events-none" />
            ) : (
              <Moon className="w-3.5 h-3.5 pointer-events-none" />
            )}
          </button>

          {/* Divisor vertical sutil */}
          <span className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Chaveador de Idioma */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-[9px] uppercase font-black tracking-widest text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors duration-200 focus:outline-none"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{i18n.language.startsWith('pt') ? 'EN' : 'PT'}</span>
          </button>
        </div>
      </nav>

      {/* Superfície Principal do Afinador (Glassmorphism Adaptativo) */}
      <main className="w-full rounded-3xl border border-slate-200 bg-white/60 dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl p-6 flex flex-col items-center gap-6 transition-all duration-300">
        
        {/* Caso 1: Idle (Aguardando clique para iniciar) */}
        {microphoneState === 'idle' && (
          <div className="w-full flex flex-col items-center py-10 gap-6 text-center select-none">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-250 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-tunerDark-muted">
              <Mic className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Bkappi Tuner
              </h2>
              <p className="text-xs text-slate-500 dark:text-tunerDark-muted mt-1.5 max-w-xs font-semibold">
                {t('tuner.subtitle')}
              </p>
            </div>
            
            {/* Botão com micro-animação ping pulsante */}
            <button
              onClick={startTuner}
              className="relative group flex items-center gap-2.5 bg-tunerState-success hover:bg-tunerState-success/90 active:scale-95 text-tunerDark-bg px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 focus:outline-none"
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
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-tunerState-success animate-spin" />
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-tunerDark-muted animate-pulse">
              {t('tuner.microphone.connecting')}
            </p>
          </div>
        )}

        {/* Caso 3: Active (Microfone liberado - Afinador executando) */}
        {microphoneState === 'active' && (
          <div className="w-full flex flex-col md:grid md:grid-cols-12 md:gap-8 md:items-stretch">
            
            {/* Coluna Esquerda: Configurações e Layout em Pilha Vertical em Desktops (col-span-5) */}
            <div className="md:col-span-5 flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-5">
                {/* Seletor de instrumentos (Modo Vertical no Desktop) */}
                <TunerInstrumentSelector selectedKey={selectedInstrumentKey} />
                
                <div className="w-full border-t border-slate-200 dark:border-slate-800/80 my-1 hidden md:block" />

                {/* Seletor de layout visual das notas (Apenas ícones horizontais com tooltip) */}
                <div className="w-full flex flex-col gap-2 select-none">
                  <h3 className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-tunerDark-muted text-center md:text-left select-none">
                    {t('tuner.layouts.title')}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 w-full">
                    {(['analog', 'meter', 'strobe'] as const).map((lay) => {
                      const isSel = selectedLayout === lay;
                      return (
                        <div key={lay} className="relative group/tooltip flex-1 max-w-[120px] md:max-w-none">
                          <button
                            onClick={() => changeLayout(lay)}
                            className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-center border transition-all duration-300 select-none focus:outline-none ${
                              isSel
                                ? 'bg-tunerState-success/10 border-tunerState-success text-tunerState-success shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                                : 'bg-slate-100/70 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800/40 dark:border-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white dark:hover:border-slate-650'
                            }`}
                            aria-label={t(`tuner.layouts.${lay}`)}
                          >
                            {getLayoutIcon(lay)}
                          </button>
                          {/* Tooltip elegante */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block bg-slate-950/90 dark:bg-slate-900/90 text-white text-[9px] uppercase tracking-wider font-black py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in border border-slate-250/10 dark:border-slate-800/50">
                            {t(`tuner.layouts.${lay}`)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor vertical visível em desktop */}
            <div className="hidden md:block md:col-span-1 border-r border-slate-200 dark:border-slate-800/50 self-stretch my-2" />

            {/* Divisor horizontal visível em mobile */}
            <div className="w-full border-t border-slate-200 dark:border-slate-800/80 my-3 md:hidden" />

            {/* Coluna Direita: Afinador de Notas (col-span-6) */}
            <div className="md:col-span-6 flex flex-col items-center justify-between gap-5">
              {/* Visor central ultra-compacto de notas e frequências */}
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

              {/* Botões silenciar */}
              <TunerControls
                isMuted={isMuted}
                isActive={true}
                onToggleMute={toggleMute}
              />
            </div>
          </div>
        )}

        {/* Caso 4: Denied (Permissão bloqueada) */}
        {microphoneState === 'denied' && (
          <div className="w-full flex flex-col items-center py-10 gap-5 text-center select-none">
            <div className="w-16 h-16 rounded-3xl bg-tunerState-danger/10 border border-tunerState-danger/30 flex items-center justify-center text-tunerState-danger">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {t('tuner.microphone.denied')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-tunerDark-muted max-w-sm px-4 leading-relaxed font-semibold">
                {t('tuner.microphone.denied_description')}
              </p>
            </div>
            <button
              onClick={startTuner}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-slate-250 dark:border-slate-700/80 text-slate-800 dark:text-white py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 focus:outline-none"
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
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {t('tuner.microphone.incompatible')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-tunerDark-muted max-w-sm px-4 leading-relaxed font-semibold">
                {t('tuner.microphone.incompatible_description')}
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Manual de Instruções e Fluxo */}
      {showInstructions && <TunerQuickInstructions />}

      {/* --- AVISO DE COOKIES / LOCAL STORAGE --- */}
      {showCookieBanner && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[350px] border border-slate-200 dark:border-slate-750 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-3 animate-fade-in select-none transition-all duration-300">
          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-normal font-sans">
            {t('tuner.cookies.text')}
          </p>
          <div className="flex items-center justify-end gap-3 text-[10px] font-extrabold tracking-wider uppercase">
            <button
              onClick={() => setShowCookieModal(true)}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1.5 rounded-lg transition-colors focus:outline-none"
            >
              {t('tuner.cookies.info')}
            </button>
            <button
              onClick={acceptCookies}
              className="bg-tunerState-success text-tunerDark-bg px-4 py-1.5 rounded-lg shadow-md hover:bg-tunerState-success/90 transition-colors focus:outline-none"
            >
              {t('tuner.cookies.accept')}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL PRIVACIDADE E DETALHES --- */}
      {showCookieModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 transition-all duration-300">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800/80 pb-2">
              {t('tuner.cookies.modal_title')}
            </h3>
            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {t('tuner.cookies.modal_text')}
            </p>
            <div className="flex items-center justify-end mt-2">
              <button
                onClick={() => setShowCookieModal(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors focus:outline-none"
              >
                {t('tuner.cookies.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TunerCard;
