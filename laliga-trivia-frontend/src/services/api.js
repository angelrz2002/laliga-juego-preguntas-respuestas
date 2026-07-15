import { API_BASE } from '../constants';

/**
 * Llama al backend para iniciar una nueva sesión de juego.
 * @returns {Promise<{level: number, question: {id: number, level: number, question: string, options: string[]}}>}
 */
export async function startNewGame() {
  try {
    const response = await fetch(`${API_BASE}/game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al conectar con el servidor.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in startNewGame:', error);
    throw error;
  }
}

/**
 * Envía la opción seleccionada al servidor para su verificación segura (Zero-Trust).
 * @param {string} sessionId ID de la sesión actual de juego
 * @param {string} selectedOption Opción que el jugador ha seleccionado
 * @returns {Promise<{correct: boolean, correct_option?: string, game_over: boolean, game_won: boolean, next_question?: any}>}
 */
export async function submitAnswer(sessionId, selectedOption) {
  try {
    const response = await fetch(`${API_BASE}/game/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        selected_option: selectedOption,
      }),
    });

    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error al verificar la respuesta.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    throw error;
  }
}
