import React from 'react';
import type { TuningStatus } from '../types/Tuner.Types';

interface TunerMeterProps {
  cents: number;
  status: TuningStatus;
  isActive: boolean;
}

export const TunerMeter: React.FC<TunerMeterProps> = ({ cents, status, isActive }) => {
  // Clampa os cents entre -50 e +50 para manter o ponteiro na régua
  const clampedCents = Math.max(-50, Math.min(50, cents));
  
  // Define o percentual horizontal: -50 cents = 10%, 0 cents = 50%, +50 cents = 90%
  const percentage = isActive ? 50 + (clampedCents / 50) * 40 : 50;

  // Determina a cor visual baseada na precisão da nota
  const getStatusColorClass = () => {
    if (!isActive) return 'bg-tunerDark-muted';
    switch (status) {
      case 'in_tune':
        return 'bg-tunerState-success shadow-[0_0_15px_rgba(16,185,129,0.8)]';
      case 'near_in_tune':
      case 'near_sharp':
        return 'bg-tunerState-nearSuccess';
      case 'low':
      case 'sharp':
        return 'bg-tunerState-warning';
      case 'very_low':
      case 'very_sharp':
      default:
        return 'bg-tunerState-danger';
    }
  };

  const getStatusTextClass = () => {
    if (!isActive) return 'text-tunerDark-muted';
    switch (status) {
      case 'in_tune':
        return 'text-tunerState-success font-black';
      case 'near_in_tune':
      case 'near_sharp':
        return 'text-tunerState-nearSuccess font-bold';
      case 'low':
      case 'sharp':
        return 'text-tunerState-warning font-semibold';
      case 'very_low':
      case 'very_sharp':
      default:
        return 'text-tunerState-danger font-semibold';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Régua Analógica SVG */}
      <div className="relative w-full h-16 flex items-end justify-center select-none overflow-hidden">
        <svg className="w-full h-12 text-slate-700/60" viewBox="0 0 100 20" preserveAspectRatio="none">
          {/* Linha guia inferior */}
          <line x1="10" y1="15" x2="90" y2="15" stroke="currentColor" strokeWidth="0.5" />
          
          {/* Subdivisões da régua (-50 a +50 cents) */}
          {Array.from({ length: 11 }).map((_, index) => {
            const x = 10 + index * 8; // Posição calculada de 10% a 90%
            const isCenter = index === 5;
            const isQuarter = index === 2 || index === 8;
            
            let strokeColor = 'currentColor';
            if (isCenter && isActive) {
              if (status === 'in_tune') {
                strokeColor = '#10B981'; // Destaque verde se afinado
              } else if (status === 'near_in_tune' || status === 'near_sharp') {
                strokeColor = '#A3E635'; // Lima
              }
            }

            return (
              <line
                key={index}
                x1={x}
                y1={isCenter ? 3 : isQuarter ? 7 : 11}
                x2={x}
                y2="15"
                stroke={strokeColor}
                strokeWidth={isCenter ? '1.2' : '0.6'}
              />
            );
          })}
        </svg>

        {/* Limites de Cents da Escala */}
        <span className="absolute left-[10%] bottom-8 text-[9px] uppercase font-bold tracking-wider text-tunerDark-muted">
          -50
        </span>
        <span className={`absolute left-[50%] bottom-8 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider transition-colors duration-200 ${isActive && status === 'in_tune' ? 'text-tunerState-success scale-110' : 'text-slate-500'}`}>
          ▼
        </span>
        <span className="absolute right-[10%] bottom-8 text-[9px] uppercase font-bold tracking-wider text-tunerDark-muted">
          +50
        </span>

        {/* Agulha Flutuante com Efeito Físico */}
        <div
          className="absolute bottom-[2px] w-[3px] h-10 rounded-t-full transition-all duration-75 ease-out"
          style={{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Corpo da Agulha */}
          <div className={`w-full h-full rounded-t-full transition-colors duration-200 ${getStatusColorClass()}`} />
          {/* Efeito Glow da Agulha */}
          {isActive && (
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full -translate-y-1/2 opacity-35 blur-sm transition-colors duration-200 ${getStatusColorClass()}`} />
          )}
        </div>
      </div>

      {/* Rótulo de Desvio */}
      <div className="mt-3 flex items-center justify-center h-6">
        {isActive && cents !== undefined ? (
          <span className={`font-mono text-sm tracking-tight ${getStatusTextClass()}`}>
            {cents > 0 ? `+${cents}` : cents} cents
          </span>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wider text-tunerDark-muted">
            -- cents
          </span>
        )}
      </div>
    </div>
  );
};

export default TunerMeter;
