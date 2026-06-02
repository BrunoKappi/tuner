import React from 'react';
import type { TuningStatus } from '../types/Tuner.Types';

interface TunerMeterProps {
  cents: number;
  status: TuningStatus;
  isActive: boolean;
  layout: 'analog' | 'meter' | 'strobe';
}

export const TunerMeter: React.FC<TunerMeterProps> = ({ cents, status, isActive, layout }) => {
  const clampedCents = Math.max(-50, Math.min(50, cents));

  // Determina as cores de status baseadas na precisão
  const getStatusColor = () => {
    if (!isActive) return '#64748b'; // Slate-500
    switch (status) {
      case 'in_tune':
        return '#10b981'; // Verde afinado
      case 'near_in_tune':
      case 'near_sharp':
        return '#a3e635'; // Lima
      case 'low':
      case 'sharp':
        return '#f59e0b'; // Amarelo/Laranja
      case 'very_low':
      case 'very_sharp':
      default:
        return '#ef4444'; // Vermelho
    }
  };

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

  // --- LAYOUT 1: ANALOG (Linear needle ruler) ---
  const renderAnalogLayout = () => {
    const percentage = isActive ? 50 + (clampedCents / 50) * 40 : 50;
    
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full h-16 flex items-end justify-center select-none overflow-hidden">
          <svg className="w-full h-12 text-slate-300 dark:text-slate-700/60 transition-colors duration-200" viewBox="0 0 100 20" preserveAspectRatio="none">
            <line x1="10" y1="15" x2="90" y2="15" stroke="currentColor" strokeWidth="0.5" />
            {Array.from({ length: 11 }).map((_, index) => {
              const x = 10 + index * 8;
              const isCenter = index === 5;
              const isQuarter = index === 2 || index === 8;
              
              let strokeColor = 'currentColor';
              if (isCenter && isActive) {
                strokeColor = status === 'in_tune' ? '#10B981' : '#a3e635';
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

          <span className="absolute left-[10%] bottom-8 text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-tunerDark-muted">
            -50
          </span>
          <span className={`absolute left-[50%] bottom-8 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider transition-colors duration-200 ${isActive && status === 'in_tune' ? 'text-tunerState-success scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
            ▼
          </span>
          <span className="absolute right-[10%] bottom-8 text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-tunerDark-muted">
            +50
          </span>

          <div
            className="absolute bottom-[2px] w-[3px] h-10 rounded-t-full transition-all duration-75 ease-out"
            style={{
              left: `${percentage}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className={`w-full h-full rounded-t-full transition-colors duration-200 ${getStatusColorClass()}`} />
            {isActive && (
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full -translate-y-1/2 opacity-35 blur-sm transition-colors duration-200 ${getStatusColorClass()}`} />
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- LAYOUT 2: METER (Speedometer arc) ---
  const renderMeterLayout = () => {
    // Fórmulas trigonométricas para a agulha curvada
    // Centro da base = (50, 50) no viewBox SVG (0 0 100 60)
    // 0 Cents = 90 graus (topo reto)
    // -50 Cents = 150 graus (esquerda)
    // +50 Cents = 30 graus (direita)
    const targetCents = isActive ? clampedCents : 0;
    const needleAngleDeg = 90 - (targetCents / 50) * 60;
    const needleAngleRad = (needleAngleDeg * Math.PI) / 180;
    
    // Coordenadas da ponta da agulha
    const needleX = 50 - 38 * Math.cos(needleAngleRad);
    const needleY = 50 - 38 * Math.sin(needleAngleRad);

    const activeColor = getStatusColor();

    // Plotagem das marcações graduadas na curva
    const ticks = Array.from({ length: 9 }).map((_, i) => {
      const tickAngleDeg = 30 + i * 15; // De 30 a 150 graus
      const tickAngleRad = (tickAngleDeg * Math.PI) / 180;
      const isCenter = i === 4;
      const isQuarter = i === 2 || i === 6;

      // Coordenadas inicial e final de cada tracinho graduado
      const x1 = 50 - 40 * Math.cos(tickAngleRad);
      const y1 = 50 - 40 * Math.sin(tickAngleRad);
      const x2 = 50 - (isCenter ? 33 : isQuarter ? 35 : 37) * Math.cos(tickAngleRad);
      const y2 = 50 - (isCenter ? 33 : isQuarter ? 35 : 37) * Math.sin(tickAngleRad);

      return { x1, y1, x2, y2, isCenter, key: i };
    });

    return (
      <div className="relative w-full flex flex-col items-center py-2 select-none">
        {/* Velocímetro em SVG */}
        <svg className="w-56 h-32 text-slate-350 dark:text-slate-700/60 transition-colors duration-200" viewBox="0 0 100 60">
          {/* Arco graduado de fundo */}
          <path
            d="M 15.35 30 A 40 40 0 0 1 84.65 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Tracejados graduados */}
          {ticks.map((t) => {
            let strokeColor = 'currentColor';
            if (t.isCenter && isActive) {
              strokeColor = status === 'in_tune' ? '#10B981' : '#a3e635';
            }
            return (
              <line
                key={t.key}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={strokeColor}
                strokeWidth={t.isCenter ? '1.5' : '0.6'}
                strokeLinecap="round"
              />
            );
          })}

          {/* Linha da Agulha rotativa */}
          <line
            x1="50"
            y1="50"
            x2={needleX}
            y2={needleY}
            stroke={activeColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            className="transition-all duration-150 ease-out"
          />

          {/* Pivô central na base da agulha */}
          <circle
            cx="50"
            cy="50"
            r="4"
            stroke={activeColor}
            strokeWidth="1"
            className="fill-slate-300 dark:fill-slate-800 transition-colors duration-200"
          />
        </svg>

        {/* Rótulos estáticos */}
        <span className="absolute left-[20%] bottom-8 text-[8px] font-black tracking-wider text-slate-400 dark:text-tunerDark-muted">
          L
        </span>
        <span className="absolute right-[20%] bottom-8 text-[8px] font-black tracking-wider text-slate-400 dark:text-tunerDark-muted">
          H
        </span>
      </div>
    );
  };

  // --- LAYOUT 3: STROBE (High-tech spinning target) ---
  const renderStrobeLayout = () => {
    const isTune = isActive && status === 'in_tune';
    
    // Calcula velocidade de rotação. Mais fora de tom = gira mais rápido.
    // Cents longe: 1.0s de ciclo. Cents perto: 3.5s de ciclo. Afinado: parado.
    const rotationSpeed = isActive && !isTune 
      ? Math.max(0.4, 2.5 - Math.abs(clampedCents) * 0.04) 
      : 0;

    const strobeStyle = {
      animationPlayState: rotationSpeed > 0 ? 'running' : 'paused',
      animationDuration: `${rotationSpeed}s`,
      animationDirection: cents < 0 ? 'reverse' : 'normal' as any,
    };

    return (
      <div className="relative w-full flex flex-col items-center py-4 select-none">
        {/* Estilos CSS Inline de Strobe para manter o componente 100% autônomo */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin-strobe {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .strobe-ring-spin {
            animation: spin-strobe 1s linear infinite;
          }
        `}} />

        {/* Anel Estroboscópico Rotativo */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Anel Externo com bordas tracejadas que simulam o estroboscópio */}
          <div 
            style={strobeStyle}
            className={`absolute inset-0 rounded-full border-[5px] border-dashed transition-all duration-300 strobe-ring-spin ${
              !isActive 
                ? 'border-slate-200 dark:border-slate-800' 
                : isTune 
                ? 'border-tunerState-success scale-105 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />

          {/* Anel Interno Estático de Contraste */}
          <div className={`absolute w-[114px] h-[114px] rounded-full border border-slate-200 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/60 shadow-inner transition-all duration-300 flex flex-col items-center justify-center ${
            isTune ? 'border-tunerState-success/20 bg-tunerState-success/5' : ''
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-wider select-none transition-colors duration-200 ${
              isTune ? 'text-tunerState-success' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {isTune ? 'LOCK' : 'STROBE'}
            </span>
          </div>
        </div>

        {/* Mini barra de desvio linear sob o anel */}
        <div className="w-28 h-1 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden mt-6 relative border border-slate-300 dark:border-slate-850">
          {isActive && (
            <div 
              className="absolute w-2 h-2 rounded-full -top-[2px] -translate-x-1/2 transition-all duration-100 ease-out"
              style={{
                left: `${50 + (clampedCents / 50) * 45}%`,
                backgroundColor: getStatusColor(),
                boxShadow: isTune ? '0 0 8px #10B981' : 'none'
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Renderiza o layout correspondente */}
      {layout === 'analog' && renderAnalogLayout()}
      {layout === 'meter' && renderMeterLayout()}
      {layout === 'strobe' && renderStrobeLayout()}

      {/* Rótulo e Cents Desvio */}
      <div className="mt-3 flex items-center justify-center h-6 select-none">
        {isActive && cents !== undefined ? (
          <span className={`font-mono text-xs tracking-tight ${getStatusTextClass()}`}>
            {cents > 0 ? `+${cents}` : cents} cents
          </span>
        ) : (
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-tunerDark-muted">
            -- cents
          </span>
        )}
      </div>
    </div>
  );
};

export default TunerMeter;
