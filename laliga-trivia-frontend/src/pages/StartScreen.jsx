import React, { useState } from 'react';

/**
 * Pantalla de inicio del juego.
 * Permite introducir el nombre del jugador para iniciar el reto.
 * @param {Object} props
 * @param {Function} props.onStart Juego iniciado con el nombre de usuario
 */
export default function StartScreen({ onStart }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Por favor, introduce tu nombre para jugar.');
      return;
    }
    if (cleanName.length < 5) {
      setError('El nombre debe tener al menos 5 caracteres.');
      return;
    }
    onStart(cleanName);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 relative">
      <div className="cyber-card w-full max-w-md p-8 rounded-2xl text-center z-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-laliga-accent">
          LaLiga
        </h1>
        <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest mb-6">
          Juego de Preguntas y Respuestas
        </h2>
        
        <p className="text-slate-400 text-sm mb-8">
          Demuestra tus conocimientos combinando fútbol de LaLiga y ciberseguridad.
          Supera los 15 niveles de dificultad incremental. ¡Un solo fallo y habrás perdido!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label 
              htmlFor="playerName" 
              className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
            >
              Nombre del Jugador
            </label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={(e) => {
                 setName(e.target.value);
                 if (error) setError('');
              }}
              placeholder="Ej. Ángel Rodríguez"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-laliga-accent focus:ring-1 focus:ring-laliga-accent transition-all"
              maxLength={20}
            />
            {error && (
              <p className="text-laliga-red text-xs mt-2 font-semibold flex items-center gap-1.5 justify-center">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-laliga-accent hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform active:scale-95"
          >
            Iniciar Reto
          </button>
        </form>
      </div>
    </div>
  );
}
