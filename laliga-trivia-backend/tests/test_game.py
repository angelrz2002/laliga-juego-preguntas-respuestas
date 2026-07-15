import os
import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Cargar preguntas para verificar resultados en los tests
QUESTIONS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "app",
    "data",
    "questions.json"
)

with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
    QUESTIONS = json.load(f)

def get_correct_option_for_level(level: int):
    for q in QUESTIONS:
        if q["level"] == level:
            return q["correct_option"]
    return None

def test_read_root():
    """Verifica que el endpoint de salud base funcione."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_start_game():
    """Verifica que iniciar el juego entrega la pregunta del nivel 1 sin revelar la respuesta."""
    response = client.post("/api/game/start")
    assert response.status_code == 200
    data = response.json()
    assert data["level"] == 1
    assert "question" in data
    assert data["question"]["level"] == 1
    # Enfoque Zero-Trust: la respuesta correcta no debe estar expuesta
    assert "correct_option" not in data["question"]
    assert len(data["question"]["options"]) == 4

def test_submit_correct_answer_advances():
    """Verifica que enviar una respuesta correcta avanza al siguiente nivel usando session_id."""
    # 1. Iniciar partida
    start_resp = client.post("/api/game/start")
    assert start_resp.status_code == 200
    session_id = start_resp.json()["session_id"]
    
    # 2. Enviar respuesta correcta para el nivel 1
    correct_opt = get_correct_option_for_level(1)
    response = client.post(
        "/api/game/submit",
        json={"session_id": session_id, "selected_option": correct_opt}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is True
    assert data["game_over"] is False
    assert data["game_won"] is False
    assert data["next_question"]["level"] == 2
    assert "correct_option" not in data["next_question"]

def test_submit_wrong_answer_game_over():
    """Verifica que una respuesta incorrecta causa Game Over inmediato, revela la solución y destruye la sesión."""
    # 1. Iniciar partida
    start_resp = client.post("/api/game/start")
    assert start_resp.status_code == 200
    session_id = start_resp.json()["session_id"]
    
    correct_opt = get_correct_option_for_level(1)
    wrong_opt = [opt for opt in QUESTIONS[0]["options"] if opt != correct_opt][0]
    
    # 2. Enviar respuesta incorrecta
    response = client.post(
        "/api/game/submit",
        json={"session_id": session_id, "selected_option": wrong_opt}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["correct"] is False
    assert data["game_over"] is True
    assert data["game_won"] is False
    assert data["correct_option"] == correct_opt
    assert data["next_question"] is None
    
    # 3. Verificar que la sesión fue destruida y ya no se puede usar
    retry_resp = client.post(
        "/api/game/submit",
        json={"session_id": session_id, "selected_option": correct_opt}
    )
    assert retry_resp.status_code == 403

def test_submit_invalid_session():
    """Verifica que una sesión inexistente o inválida sea rechazada con 403."""
    response = client.post(
        "/api/game/submit",
        json={"session_id": "invalid-uuid-session", "selected_option": "any-option"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Sesión de juego inválida o caducada. Por favor, inicia una nueva partida."

def test_win_game():
    """Simula una partida perfecta respondiendo correctamente los 15 niveles usando session_id."""
    # 1. Iniciar partida
    start_resp = client.post("/api/game/start")
    assert start_resp.status_code == 200
    session_id = start_resp.json()["session_id"]
    
    current_level = 1
    
    while current_level <= 15:
        correct_opt = get_correct_option_for_level(current_level)
        response = client.post(
            "/api/game/submit",
            json={"session_id": session_id, "selected_option": correct_opt}
        )
        assert response.status_code == 200
        data = response.json()
        
        if current_level == 15:
            assert data["correct"] is True
            assert data["game_over"] is True
            assert data["game_won"] is True
            assert data["next_question"] is None
        else:
            assert data["correct"] is True
            assert data["game_over"] is False
            assert data["game_won"] is False
            assert data["next_question"]["level"] == current_level + 1
            
        current_level += 1

