import React from 'react';

/**
 * Pantalla final del juego.
 * Muestra el resultado de victoria o derrota del jugador de forma estructurada.
 * @param {Object} props
 * @param {string} props.playerName Nombre del jugador
 * @param {boolean} props.gameWon Indica si ganó el juego (completó los 15 niveles)
 * @param {number} props.level Nivel en el que finalizó
 * @param {string} props.selectedOption Opción elegida por el jugador
 * @param {string} props.correctOption Opción correcta que devolvió el servidor
 * @param {Function} props.onRestart Función para reiniciar el juego
 */
export default function EndScreen({ 
  playerName, 
  gameWon, 
  level, 
  selectedOption, 
  correctOption, 
  onRestart 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 relative">
      <div className="cyber-card w-full max-w-lg p-8 rounded-2xl text-center z-10">
        {gameWon ? (
          <>
            {/* Medalla/Trofeo */}
            <div className="w-24 h-24 bg-laliga-accent/15 border border-laliga-accent/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-12 h-12 text-laliga-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14c2.21 0 4-1.79 4-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5c0 2.21 1.79 4 4 4zm0 0v4m-4 0h8m-10-8h2v-3H6c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1zm12-3v3h2c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2z" />
              </svg>
            </div>

            <h1 className="text-4xl font-extrabold text-laliga-accent mb-2">
              ¡Victoria Absoluta!
            </h1>
            <h2 className="text-lg font-bold text-slate-300 mb-6 uppercase tracking-wider">
              Enhorabuena, {playerName}
            </h2>

            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Has demostrado un dominio excepcional respondiendo correctamente los 15 niveles 
              del juego sobre fútbol de LaLiga y ciberseguridad.
            </p>
          </>
        ) : (
          <>
            {/* Icono de fallo */}
            <div className="w-24 h-24 bg-laliga-red/10 border border-laliga-red/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-laliga-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-4xl font-extrabold text-laliga-red mb-2">
              Game Over
            </h1>
            <h2 className="text-lg font-bold text-slate-300 mb-6 uppercase tracking-wider">
              Fin de la partida para {playerName}
            </h2>

            <div className="bg-slate-900/60 rounded-xl p-5 border border-white/5 text-left mb-8 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Resumen de la jugada:
              </p>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Nivel alcanzado:</span>
                <span className="text-sm font-bold text-slate-200">Nivel {level} de 15</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Tu respuesta elegida:</span>
                <span className="text-sm font-bold text-laliga-red">{selectedOption || 'Ninguna'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Respuesta correcta (Servidor):</span>
                <span className="text-sm font-bold text-laliga-accent">{correctOption}</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-8">
              Un solo error te ha dejado fuera de juego. ¡Vuelve a intentarlo!
            </p>
          </>
        )}

        <button
          onClick={onRestart}
          className={`
            w-full font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform active:scale-95
            ${
              gameWon 
                ? 'bg-laliga-accent hover:bg-emerald-400 text-slate-950' 
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
            }
          `}
        >
          {gameWon ? 'Jugar de Nuevo' : 'Reintentar Reto'}
        </button>
      </div>
    </div>
  );
}
