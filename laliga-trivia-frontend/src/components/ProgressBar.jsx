import React from 'react';

/**
 * Componente de barra de progreso que dibuja los 15 niveles del juego.
 * Muestra el progreso de forma interactiva y responsiva.
 * @param {Object} props
 * @param {number} props.currentLevel Nivel actual del jugador (1 a 15)
 */
export default function ProgressBar({ currentLevel }) {
  const totalLevels = 15;
  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="w-full py-4 px-4 bg-laliga-card/40 rounded-xl border border-white/5 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 md:gap-1 max-w-4xl mx-auto">
        {levels.map((lvl) => {
          const isCompleted = lvl < currentLevel;
          const isActive = lvl === currentLevel;

          return (
            <div 
              key={lvl} 
              className="flex flex-col items-center flex-1 min-w-[36px]"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500
                  ${
                    isCompleted
                      ? 'bg-laliga-accent text-slate-950'
                      : isActive
                      ? 'bg-laliga-red text-white ring-4 ring-laliga-red/30 scale-110'
                      : 'bg-laliga-card border border-white/10 text-slate-400'
                  }
                `}
              >
                {isCompleted ? '✓' : lvl}
              </div>
              <span 
                className={`
                  text-[9px] mt-1 font-bold tracking-tight transition-colors duration-300
                  ${isActive ? 'text-laliga-red' : isCompleted ? 'text-laliga-accent' : 'text-slate-500'}
                `}
              >
                N_{lvl}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
