import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

/**
 * Pantalla de juego principal.
 * Muestra el nivel actual, la pregunta y las 4 opciones de respuesta de forma segura.
 * @param {Object} props
 * @param {string} props.playerName Nombre del jugador
 * @param {Object} props.question Objeto de pregunta actual {id, level, question, options}
 * @param {number} props.level Nivel actual del juego
 * @param {Function} props.onSubmit Función para enviar la respuesta al backend
 * @param {boolean} props.isSubmitting Estado de carga al enviar la respuesta
 */
export default function GameScreen({ playerName, question, level, onSubmit, isSubmitting }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    if (isSubmitting) return;
    setSelectedOption(option);
    onSubmit(option);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 z-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Jugador</span>
          <h2 className="text-xl font-bold text-slate-100">{playerName}</h2>
        </div>
        <div className="text-left md:text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nivel de Dificultad</span>
          <h2 className="text-2xl font-black text-laliga-accent">Nivel {level} de 15</h2>
        </div>
      </div>

      {/* Barra de progreso de niveles */}
      <div className="mb-10">
        <ProgressBar currentLevel={level} />
      </div>

      <div className="cyber-card p-8 rounded-2xl mb-8 min-h-[160px] flex flex-col justify-center border-l-4 border-l-laliga-accent">
        <span className="text-xs font-bold uppercase tracking-widest text-laliga-accent/80 mb-2">Pregunta</span>
        <p className="text-xl md:text-2xl font-bold text-slate-100 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Opciones de respuesta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={index}
              disabled={isSubmitting}
              onClick={() => handleSelect(option)}
              className={`
                w-full text-left p-5 rounded-xl border text-base font-semibold transition-all duration-300 flex items-center justify-between
                ${
                  isSelected
                    ? 'bg-laliga-accent/15 border-laliga-accent text-laliga-accent'
                    : 'bg-laliga-card border-white/5 text-slate-200 glow-hover'
                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center gap-4">
                <span className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 border border-white/5 flex items-center justify-center text-xs font-bold font-mono">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
              {isSelected && (
                <span className="text-laliga-accent font-bold">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {isSubmitting && (
        <div className="flex items-center justify-center mt-8 gap-3 text-slate-400 text-sm font-semibold">
          <svg className="animate-spin h-5 w-5 text-laliga-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verificando respuesta de forma segura...
        </div>
      )}
    </div>
  );
}
