import os
import json
import uuid
import random
import time
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import QuestionResponse, AnswerSubmit, AnswerResponse, GameSessionStart
from app.utils.logger import logger

router = APIRouter(prefix="/game", tags=["game"])

# Almacenamiento en memoria para las sesiones de juego activas
# Formato: { session_id: { "level": int, "last_active": float } }
sessions = {}

def cleanup_inactive_sessions():
    """Elimina las sesiones que no han tenido actividad en los últimos 30 minutos (1800 segundos)."""
    now = time.time()
    inactive_limit = 1800
    expired_sessions = [
        sid for sid, data in sessions.items()
        if now - data.get("last_active", 0) > inactive_limit
    ]
    for sid in expired_sessions:
        sessions.pop(sid, None)
    if expired_sessions:
        logger.info(f"Limpieza automatizada: Se eliminaron {len(expired_sessions)} sesiones inactivas expiradas.")


# Cargar las preguntas desde el archivo JSON al iniciar
QUESTIONS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "questions.json"
)

try:
    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        QUESTIONS = json.load(f)
    logger.info(f"Cargadas exitosamente {len(QUESTIONS)} preguntas desde questions.json")
except Exception as e:
    logger.critical(f"Error crítico al cargar questions.json desde {QUESTIONS_FILE}: {str(e)}")
    QUESTIONS = []

def get_question_by_level(level: int):
    """Busca una pregunta por su nivel de dificultad."""
    for q in QUESTIONS:
        if q["level"] == level:
            return q
    return None

@router.post("/start", response_model=GameSessionStart)
def start_game():
    """Inicializa una nueva partida entregando la pregunta del nivel 1."""
    cleanup_inactive_sessions()
    logger.info("Petición recibida: Iniciar nueva partida.")
    first_q = get_question_by_level(1)
    if not first_q:
        logger.error("Error de configuración: Pregunta de nivel 1 no encontrada.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor: no se pudo iniciar el juego."
        )
    
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"level": 1, "last_active": time.time()}
    logger.info(f"Creada nueva sesión de juego {session_id} en el nivel 1.")
    
    shuffled_options = list(first_q["options"])
    random.shuffle(shuffled_options)
    
    question_data = QuestionResponse(
        id=first_q["id"],
        level=first_q["level"],
        question=first_q["question"],
        options=shuffled_options
    )
    return GameSessionStart(session_id=session_id, level=1, question=question_data)

@router.post("/submit", response_model=AnswerResponse)
def submit_answer(payload: AnswerSubmit):
    """
    Evalúa de forma segura en el servidor la opción seleccionada.
    No expone la respuesta al frontend excepto cuando falla (para mostrar la solución).
    """
    cleanup_inactive_sessions()
    session_id = payload.session_id
    if session_id not in sessions:
        logger.warning(f"Intento de envío con sesión inválida o caducada: {session_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sesión de juego inválida o caducada. Por favor, inicia una nueva partida."
        )
    
    sessions[session_id]["last_active"] = time.time()
    current_level = sessions[session_id]["level"]
    logger.info(f"Intento recibido para sesión {session_id} (nivel real {current_level}) con opción: '{payload.selected_option}'")
    
    current_q = get_question_by_level(current_level)
    if not current_q:
        logger.error(f"Error de configuración: Pregunta para el nivel {current_level} no encontrada en el catálogo.")
        sessions.pop(session_id, None)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error de configuración del juego: pregunta no encontrada."
        )
    
    is_correct = (current_q["correct_option"] == payload.selected_option)

    if is_correct:
        logger.info(f"Acierto en nivel {current_level} para la sesión {session_id}.")
        
        # Comprobar si superó el último nivel
        if current_level == 15:
            logger.info(f"Victoria absoluta: El jugador ha completado los 15 niveles para la sesión {session_id}.")
            sessions.pop(session_id, None)
            return AnswerResponse(
                correct=True,
                game_over=True,
                game_won=True,
                next_question=None
            )
        
        # Avanzar al siguiente nivel en el servidor
        next_level = current_level + 1
        sessions[session_id]["level"] = next_level
        sessions[session_id]["last_active"] = time.time()
        
        next_q = get_question_by_level(next_level)
        if not next_q:
            logger.error(f"Error inesperado: Pregunta del siguiente nivel {next_level} no encontrada.")
            sessions.pop(session_id, None)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error interno al buscar la siguiente pregunta."
            )
        
        shuffled_options = list(next_q["options"])
        random.shuffle(shuffled_options)
        
        next_question_data = QuestionResponse(
            id=next_q["id"],
            level=next_q["level"],
            question=next_q["question"],
            options=shuffled_options
        )
        return AnswerResponse(
            correct=True,
            game_over=False,
            game_won=False,
            next_question=next_question_data
        )
    else:
        logger.info(f"Fallo en nivel {current_level} para la sesión {session_id}. Fin de la partida (Game Over).")
        # Destruir sesión tras fallo
        sessions.pop(session_id, None)
        return AnswerResponse(
            correct=False,
            correct_option=current_q["correct_option"],
            game_over=True,
            game_won=False,
            next_question=None
        )

