# Documentación Técnica Completa del Backend - LaLiga Juego de Preguntas y Respuestas

Este documento detalla la arquitectura, decisiones de diseño, fases de desarrollo e integración del backend del proyecto **LaLiga Trivia Challenge**, desarrollado en Julio de 2026.

---

## 1. Stack Tecnológico y Justificación
* **FastAPI (Python 3.11-slim):** Seleccionado por su alto rendimiento (basado en Starlette y Uvicorn), tipado estricto automático con Pydantic y generación automática de documentación interactiva (Swagger UI).
* **Almacenamiento Local JSON (`questions.json`):** Cumpliendo con la premisa de simplicidad extrema y evitando la sobreingeniería (como bases de datos relacionales pesadas u ORMs para un set de datos estático de 15 preguntas).

---

## 2. Fases de Desarrollo

### Fase 1: Planificación y Esqueleto Inicial
* Definición de la estructura del repositorio en formato monorepo.
* Configuración de entornos aislados de desarrollo.

### Fase 2: Modelado y Lógica de Negocio
* **Esquemas Pydantic (`app/models/schemas.py`):**
  * `QuestionResponse`: Moldea la pregunta enviada al cliente. Excluye estrictamente el campo `correct_answer` para evitar ingeniería inversa en las DevTools del navegador.
  * `AnswerSubmit`: Payload recibido en el backend que contiene el nivel y la opción elegida por el usuario.
  * `AnswerResponse`: Devuelve el resultado de la validación (`correct`, `game_over`, `game_won`, `next_question`).
* **Lógica del Juego (`app/routers/game.py`):**
  * **API Ciega:** El backend es el único que conoce la respuesta correcta. La validación se realiza mediante llamadas seguras `POST` contra el fichero JSON local en el servidor.
  * **Transición de Estados:** Se programó el control estricto de los 15 niveles de dificultad incremental. Un error detiene el flujo de inmediato (`game_over: true`). Superar el nivel 15 activa la bandera de victoria absoluta (`game_won: true`).

### Fase 3: Robustez de Errores y Logging Rotativo (`app/utils/logger.py`)
* Implementación de un logger personalizado que escribe de forma dual en `sys.stdout` para el colector de Docker y en un archivo rotativo físico local (`logs/game.log`) limitado a 5MB con histórico de backups.
* Auto-creación de la carpeta `logs/` al arrancar la aplicación si esta no se encuentra en el sistema de archivos del contenedor.

---

## 3. Guía de Endpoints de la API

### `POST /api/game/start`
* **Descripción:** Inicializa la partida y devuelve la pregunta de dificultad Nivel 1.
* **Respuesta (200 OK):**
  ```json
  {
    "id": 1,
    "question": "¿En qué año se fundó LaLiga de fútbol profesional?",
    "options": ["1929", "1902", "1945", "1982"],
    "level": 1
  }
  ```

### `POST /api/game/submit`
* **Descripción:** Envía la opción seleccionada por el jugador para su validación en el servidor.
* **Payload (Request Body):**
  ```json
  {
    "level": 1,
    "selected_option": "1929"
  }
  ```
* **Respuesta (200 OK - Acierto):**
  ```json
  {
    "correct": true,
    "game_over": false,
    "game_won": false,
    "next_question": {
      "id": 2,
      "question": "Pregunta correspondiente al Nivel 2...",
      "options": ["A", "B", "C", "D"],
      "level": 2
    }
  }
  ```
