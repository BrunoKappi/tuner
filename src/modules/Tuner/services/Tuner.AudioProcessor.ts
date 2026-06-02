import { PitchDetector } from 'pitchy';
import type { PitchData, SignalLevel } from '../types/Tuner.Types';
import { AUDIO_CONFIG, NOTE_STRINGS } from '../constants/Tuner.Constants';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private detector: PitchDetector<Float32Array> | null = null;
  private inputBuffer: Float32Array | null = null;
  
  // Suavização e estabilização de notas
  private smoothedFrequency: number | null = null;
  private noteHistory: number[] = [];

  constructor() {}

  /**
   * Verifica se o navegador suporta a captura de áudio nativa
   */
  public static isSupported(): boolean {
    const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext);
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    return hasAudioContext && hasMediaDevices;
  }

  /**
   * Inicializa o dispositivo de áudio local
   */
  public async init(): Promise<void> {
    if (!AudioProcessor.isSupported()) {
      throw new Error('NOT_SUPPORTED');
    }

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false, // Desabilitado para evitar cancelamentos de fase de cordas de violão/guitarra
          noiseSuppression: false, // Desabilitado para evitar portas de ruído que abafam sons acústicos contínuos
          autoGainControl: true,   // Habilitado para aumentar a sensibilidade de sons mais baixos em celulares
        },
      });

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = AUDIO_CONFIG.fftSize;

      this.sourceNode.connect(this.analyserNode);

      // Instanciação e preparação do Pitchy
      this.detector = PitchDetector.forFloat32Array(this.analyserNode.fftSize);
      this.inputBuffer = new Float32Array(this.detector.inputLength);
      
      // Limpa dados de suavização e estabilização
      this.smoothedFrequency = null;
      this.noteHistory = [];
    } catch (error: any) {
      this.cleanup();
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error('PERMISSION_DENIED');
      }
      throw error;
    }
  }

  /**
   * Retorna o nível RMS (Root Mean Square) do sinal de entrada
   */
  private calculateRMS(buffer: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }

  /**
   * Mapeia o RMS para categorias de nível de sinal
   */
  public getSignalLevel(rms: number): SignalLevel {
    if (rms < AUDIO_CONFIG.rmsThresholds.none) return 'none';
    if (rms < AUDIO_CONFIG.rmsThresholds.weak) return 'weak';
    return 'good';
  }

  /**
   * Inicia o loop de animação analisando o microfone
   */
  public startAnalysis(onPitchDetected: (data: PitchData | null, rms: number) => void): void {
    if (!this.analyserNode || !this.detector || !this.inputBuffer || !this.audioContext) {
      return;
    }

    const update = () => {
      if (!this.analyserNode || !this.detector || !this.inputBuffer || !this.audioContext) {
        return;
      }

      this.analyserNode.getFloatTimeDomainData(this.inputBuffer as any);
      
      const rms = this.calculateRMS(this.inputBuffer);
      const signalLevel = this.getSignalLevel(rms);

      if (signalLevel === 'none') {
        // Sinal insignificante (silêncio)
        this.smoothedFrequency = null;
        onPitchDetected(null, rms);
      } else {
        const [rawFrequency, clarity] = this.detector.findPitch(
          this.inputBuffer as any,
          this.audioContext.sampleRate
        );

        // Desprezamos ruído de fundo ou clareza menor que o configurado (padrão 85%)
        if (clarity >= AUDIO_CONFIG.clarityThreshold && rawFrequency > 20 && rawFrequency < 2000) {
          let frequency = rawFrequency;
          
          if (this.smoothedFrequency === null) {
            this.smoothedFrequency = frequency;
          } else {
            const diffRatio = Math.abs(frequency - this.smoothedFrequency) / this.smoothedFrequency;
            // Se houver troca de notas (> 1 semitom ou ~12% de frequência),
            // redefinimos a suavização imediatamente para evitar inércia na agulha.
            // Reset se houver mudança maior que 1 semitom (~5.9% de variação de frequência)
            if (diffRatio > 0.05) {
              this.smoothedFrequency = frequency;
            } else {
              this.smoothedFrequency =
                AUDIO_CONFIG.smoothingFactor * frequency +
                (1 - AUDIO_CONFIG.smoothingFactor) * this.smoothedFrequency;
            }
          }

          const pitchData = this.parsePitch(this.smoothedFrequency, clarity, rms);
          onPitchDetected(pitchData, rms);
        } else {
          // Sinal detectado mas sem clareza suficiente (sem harmônico definido)
          onPitchDetected(null, rms);
        }
      }

      this.animationFrameId = requestAnimationFrame(update);
    };

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    update();
  }

  /**
   * Pausa o loop de animação do afinador
   */
  public stopAnalysis(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Converte a frequência pura em detalhes cromáticos e cents
   */
  private parsePitch(frequency: number, clarity: number, rms: number): PitchData {
    // MIDI note formula: n = 12 * log2(f / 440) + 69
    const n = 12 * Math.log2(frequency / 440) + 69;
    const rawMidiNote = Math.round(n);
    
    // Filtro por Moda: Empilha as últimas 9 notas no histórico para amenizar oscilações transientes
    this.noteHistory.push(rawMidiNote);
    if (this.noteHistory.length > 9) {
      this.noteHistory.shift();
    }

    // Calcula a Moda no histórico das notas lidas
    const counts: { [key: number]: number } = {};
    let midiNote = rawMidiNote;
    let maxCount = 0;
    for (const note of this.noteHistory) {
      counts[note] = (counts[note] || 0) + 1;
      if (counts[note] > maxCount) {
        maxCount = counts[note];
        midiNote = note;
      }
    }

    // Frequência ideal correspondente à nota estabilizada por Moda
    const targetFrequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    
    // Desvio em cents em relação a nota alvo estabilizada
    const cents = Math.round(1200 * Math.log2(frequency / targetFrequency));

    // Modulo seguro para achar o nome da nota e a oitava correspondente
    const noteIndex = ((midiNote % 12) + 12) % 12;
    const noteName = NOTE_STRINGS[noteIndex];
    const octave = Math.floor(midiNote / 12) - 1;

    return {
      frequency: Math.round(frequency * 10) / 10,
      noteName,
      octave,
      cents,
      clarity,
      rms,
    };
  }

  /**
   * Limpa todos os recursos abertos
   */
  public cleanup(): void {
    this.stopAnalysis();

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyserNode = null;
    this.detector = null;
    this.inputBuffer = null;
    this.smoothedFrequency = null;
    this.noteHistory = [];
  }
}
export default AudioProcessor;
