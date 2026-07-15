# Reglas de Desarrollo y Estilo - LaLiga Trivia Challenge (Junior Full Stack)

## Contexto del Proyecto
* **Nombre:** LaLiga Trivia Challenge (Proceso de Selección)
* **Objetivo:** Juego de preguntas y respuestas de 15 niveles de dificultad incremental. Un acierto avanza de nivel. Un fallo termina la partida de forma inmediata. Superar el nivel 15 implica ganar el juego de forma absoluta.
* **Stack Principal:** Backend en FastAPI (Python 3.11-slim) alimentado por un almacenamiento JSON estático (`questions.json`). Frontend SPA en React (Vite) + Tailwind CSS.
* **Infraestructura:** Dockerizado completamente mediante Docker Compose. Orquestación optimizada con "multi-stage build" con servidor Nginx para servir el frontend estático.
* **Enfoque de Seguridad (Zero-Trust):** El frontend es ciego a las respuestas. La validación se realiza de forma estricta en el servidor mediante peticiones POST seguras para evitar cheats en la consola de desarrollo.

---

## Estructura Canónica del Repositorio
Cualquier nuevo archivo o desarrollo debe respetar estrictamente esta disposición de directorios:

```text
laliga-juego-preguntas-respuestas/
├── .agents/
│   └── AGENTS.md                         <-- Este archivo de reglas
├── doc_inicial_proyecto_plan/
│   ├── instrucciones_prueba.md          <-- Correo con los requisitos
│   └── CLAUDE.md                         <-- Bitácora de sesión diaria de la IA (Julio 2026)
├── laliga-trivia-backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── questions.json            <-- 15 preguntas temáticas (Fútbol + Ciberseguridad)
│   │   ├── models/
│   │   │   └── schemas.py                <-- Modelos de validación Pydantic
│   │   ├── routers/
│   │   │   └── game.py                   <-- Endpoints del juego
│   │   ├── utils/
│   │   │   └── logger.py                 <-- Configuración de logs automatizada
│   │   └── main.py                       <-- Inicialización y CORS
│   ├── docs_back/
│   │   ├── DOCUMENTACION_COMPLETA_BACK.md
│   │   └── test_report.md                <-- Historial de resultados de pytest
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_game.py                  <-- Pruebas con pytest y TestClient
│   ├── logs/                             <-- Carpeta local para persistencia de logs
│   ├── Dockerfile
│   └── requirements.txt
├── laliga-trivia-frontend/
│   ├── docs_front/
│   │   └── DOCUMENTACION_COMPLETA_FRONT.md
│   ├── src/
│   │   ├── components/                   <-- Componentes de interfaz (botones, tarjetas, etc.)
│   │   ├── pages/                        <-- Pantallas (Start, Play, Final)
│   │   ├── services/                     <-- Peticiones fetch reactivas al back
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml                    <-- Orquestador local multi-contenedor
├── Makefile                              <-- Automatización de comandos (make test, etc.)
├── README.md                             <-- Documento principal de cara al evaluador
└── .gitignore                            <-- Filtros globales de Git (Python, Node, Docker, Logs)