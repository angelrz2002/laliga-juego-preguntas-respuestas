import React, { useState } from 'react';
import StartScreen from './pages/StartScreen';
import GameScreen from './pages/GameScreen';
import EndScreen from './pages/EndScreen';
import { startNewGame, submitAnswer } from './services/api';

export default function App() {
  const [step, setStep] = useState('start'); // 'start' | 'playing' | 'end'
  const [playerName, setPlayerName] = useState('');
  const [level, setLevel] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [correctOption, setCorrectOption] = useState('');
  const [serverError, setServerError] = useState('');

  // Iniciar el juego llamando al servidor
  const handleStartGame = async (name) => {
    setPlayerName(name);
    setIsSubmitting(true);
    setServerError('');
    try {
      const data = await startNewGame();
      setSessionId(data.session_id);
      setCurrentQuestion(data.question);
      setLevel(data.level);
      setStep('playing');
    } catch (err) {
      setServerError('No se pudo conectar con el servidor del juego. Por favor, asegúrate de que el backend está corriendo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enviar respuesta al servidor para validación segura
  const handleSubmitAnswer = async (option) => {
    setIsSubmitting(true);
    setServerError('');
    setSelectedOption(option);
    try {
      const result = await submitAnswer(sessionId, option);
      
      if (result.correct) {
        if (result.game_won) {
          setGameWon(true);
          setStep('end');
        } else if (result.next_question) {
          // Breve delay para que el jugador asimile el acierto antes de cargar la siguiente pregunta
          setTimeout(() => {
            setCurrentQuestion(result.next_question);
            setLevel(result.next_question.level);
            setIsSubmitting(false);
          }, 800);
          return; // Prevenir desactivación inmediata de pantalla de carga
        }
      } else {
        // Falló la respuesta
        setCorrectOption(result.correct_option);
        setGameWon(false);
        setStep('end');
      }
    } catch (err) {
      setServerError('Error al enviar la respuesta. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Volver a jugar (reiniciar todos los estados)
  const handleRestart = () => {
    setStep('start');
    setLevel(1);
    setSessionId(null);
    setCurrentQuestion(null);
    setGameWon(false);
    setSelectedOption('');
    setCorrectOption('');
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-laliga-dark text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Cabecera común */}
      <header className="w-full border-b border-white/5 py-4 px-6 bg-slate-950/20 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-laliga-red tracking-tighter">LaLiga</span>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block">
            Juego de Preguntas y Respuestas
          </div>
        </div>
      </header>

      {/* Cuerpo principal */}
      <main className="flex-grow flex items-center justify-center py-10 z-10">
        <div className="w-full">
          {serverError && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-laliga-red/10 border border-laliga-red/20 text-laliga-red rounded-xl text-sm font-semibold flex items-center justify-center gap-2 z-30 relative animate-pulse">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          {step === 'start' && (
            <StartScreen onStart={handleStartGame} />
          )}

          {step === 'playing' && currentQuestion && (
            <GameScreen
              playerName={playerName}
              question={currentQuestion}
              level={level}
              onSubmit={handleSubmitAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 'end' && (
            <EndScreen
              playerName={playerName}
              gameWon={gameWon}
              level={level}
              selectedOption={selectedOption}
              correctOption={correctOption}
              onRestart={handleRestart}
            />
          )}
        </div>
      </main>

      {/* Pie de página común */}
      <footer className="w-full border-t border-white/5 py-4 text-center text-xs text-slate-500 bg-slate-950/10 z-20">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} LaLiga - Juego de Preguntas y Respuestas.</span>
          <span className="font-semibold text-slate-600">Validación de respuestas en el servidor</span>
        </div>
      </footer>
    </div>
  );
}
