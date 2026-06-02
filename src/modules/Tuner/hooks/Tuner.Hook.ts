import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../core/store/Store';
import {
  setMicrophoneState,
  setMuted,
  setLayout,
} from '../store/Tuner.Slice';
import type { PitchData, SignalLevel } from '../types/Tuner.Types';
import AudioProcessor from '../services/Tuner.AudioProcessor';

export const useTuner = () => {
  const dispatch = useDispatch();
  
  // Carrega configurações gerais do Redux
  const selectedInstrumentKey = useSelector((state: RootState) => state.tuner.selectedInstrumentKey);
  const microphoneState = useSelector((state: RootState) => state.tuner.microphoneState);
  const isMuted = useSelector((state: RootState) => state.tuner.isMuted);
  const selectedLayout = useSelector((state: RootState) => state.tuner.selectedLayout);

  // Referência persistente e isolada do processador Web Audio
  const processorRef = useRef<AudioProcessor | null>(null);

  // Estados locais para evitar dispatchs excessivos a 60 FPS no Redux
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const [rms, setRms] = useState<number>(0);

  // Instanciação Lazy
  if (!processorRef.current) {
    processorRef.current = new AudioProcessor();
  }

  /**
   * Conecta o microfone local e ativa o processador
   */
  const startTuner = async () => {
    if (!processorRef.current) return;

    dispatch(setMicrophoneState('requesting'));
    setPitchData(null);
    setRms(0);

    try {
      await processorRef.current.init();
      dispatch(setMicrophoneState('active'));
      
      // Inicia análise contínua se o afinador não estiver mutado
      if (!isMuted) {
        processorRef.current.startAnalysis((data, currentRms) => {
          setPitchData(data);
          setRms(currentRms);
        });
      }
    } catch (error: any) {
      if (error.message === 'NOT_SUPPORTED') {
        dispatch(setMicrophoneState('incompatible'));
      } else if (error.message === 'PERMISSION_DENIED') {
        dispatch(setMicrophoneState('denied'));
      } else {
        dispatch(setMicrophoneState('idle'));
      }
      setPitchData(null);
      setRms(0);
    }
  };

  /**
   * Silencia ou reativa a captura de áudio local
   */
  const toggleMute = () => {
    if (!processorRef.current || microphoneState !== 'active') return;

    const nextMutedState = !isMuted;
    dispatch(setMuted(nextMutedState));

    if (nextMutedState) {
      processorRef.current.stopAnalysis();
      setPitchData(null);
      setRms(0);
    } else {
      processorRef.current.startAnalysis((data, currentRms) => {
        setPitchData(data);
        setRms(currentRms);
      });
    }
  };

  /**
   * Reinicia do zero o motor de áudio
   */
  const restartTuner = async () => {
    if (!processorRef.current) return;
    
    processorRef.current.cleanup();
    setPitchData(null);
    setRms(0);
    
    await startTuner();
  };

  const changeLayout = (layout: 'analog' | 'meter' | 'strobe') => {
    dispatch(setLayout(layout));
  };

  // Garante liberação de hardware de áudio ao desmontar a página
  useEffect(() => {
    return () => {
      if (processorRef.current) {
        processorRef.current.cleanup();
      }
    };
  }, []);

  // Inicialização Automática caso o microfone já tenha sido concedido no passado
  useEffect(() => {
    const checkPermissionAndAutoStart = async () => {
      if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          if (status.state === 'granted') {
            await startTuner();
          }
          
          status.onchange = async () => {
            if (status.state === 'granted') {
              await startTuner();
            }
          };
        } catch (err) {
          // Silencia falhas sob navegadores incompatíveis
        }
      }
    };
    checkPermissionAndAutoStart();
  }, []);

  // Monitora alterações de silenciamento gerais
  useEffect(() => {
    if (!processorRef.current || microphoneState !== 'active') return;
    
    if (isMuted) {
      processorRef.current.stopAnalysis();
      setPitchData(null);
      setRms(0);
    }
  }, [isMuted, microphoneState]);

  // Retorna o nível qualitativo da entrada
  const getSignalLevel = (): SignalLevel => {
    if (!processorRef.current) return 'none';
    return processorRef.current.getSignalLevel(rms);
  };

  return {
    pitchData,
    rms,
    microphoneState,
    selectedInstrumentKey,
    isMuted,
    selectedLayout,
    signalLevel: getSignalLevel(),
    startTuner,
    toggleMute,
    restartTuner,
    changeLayout,
  };
};

export default useTuner;
