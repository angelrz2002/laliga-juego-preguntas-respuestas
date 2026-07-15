# LaLiga - Juego de Preguntas y Respuestas
### Proceso de Selección - Junior Full Stack Developer

¡Bienvenido al repositorio de **LaLiga - Juego de Preguntas y Respuestas**! Esta es una aplicación web interactiva diseñada para evaluar conocimientos de fútbol y ciberseguridad a través de un juego dinámico de preguntas y respuestas de 15 niveles de dificultad incremental.

---

## 1. Descripción de la Solución y Enfoque de Seguridad

El proyecto está diseñado bajo un enfoque de **Seguridad Zero-Trust (Cliente Ciego)**:
* **Validación en el Servidor:** A diferencia de juegos convencionales donde las respuestas se cargan en el cliente frontend o se envían en la carga útil (payload) JSON de las preguntas facilitando trampas mediante la inspección del inspector de elementos o consola JS, en esta solución el frontend desconoce las respuestas válidas.
* **Evaluación Segura:** Cada respuesta elegida por el usuario se envía cifrada en el contexto de una petición POST al servidor (`/api/game/submit`), el cual valida el acierto de forma aislada y actualiza el estado de la partida de forma segura.

---

## 2. Justificación del Stack Tecnológico

El stack tecnológico ha sido cuidadosamente elegido para garantizar fiabilidad, mantenibilidad y rendimiento óptimos:

* **Backend: FastAPI (Python 3.11-slim)**
  * **Rendimiento excepcional:** Basado en Starlette y Pydantic, ofrece velocidad equiparable a NodeJS.
  * **Autodocumentación:** Genera automáticamente la documentación de la API interactiva (Swagger UI/ReDoc).
  * **Validación estricta:** Mediante modelos Pydantic, garantizando el tipado seguro de todas las peticiones y respuestas.
* **Frontend: React (Vite) + Tailwind CSS**
  * **Vite:** Para un desarrollo y bunding ágiles.
  * **Tailwind CSS:** Diseño responsivo y moderno acelerando la maquetación estética de la interfaz sin sobrecargar las hojas de estilo.
* **Infraestructura: Docker y Docker Compose**
  * **Consistencia:** Todo el entorno (Frontend compilado tras Nginx, y Backend en FastAPI) se orquesta de manera unificada y aislada.

---

## 3. Estructura de Directorios

El monorepo está estructurado de la siguiente manera:

```text
laliga-juego-preguntas-respuestas/
├── .agents/
│   └── AGENTS.md                         # Reglas de desarrollo y estilo de la IA
├── doc_inicial_proyecto_plan/
│   ├── instrucciones_prueba.md          # Enunciado completo y requisitos de la prueba
│   └── CLAUDE.md                         # Bitácora de sesión diaria
├── laliga-trivia-backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── questions.json            # 15 preguntas (Fútbol + Ciberseguridad)
│   │   ├── models/
│   │   │   └── schemas.py                # Modelos de validación Pydantic
│   │   ├── routers/
│   │   │   └── game.py                   # Lógica y endpoints de control del juego
│   │   ├── utils/
│   │   │   └── logger.py                 # Configuración de logs locales
│   │   └── main.py                       # Servidor FastAPI e inicio
│   ├── docs_back/
│   │   ├── DOCUMENTACION_COMPLETA_BACK.md
│   │   └── test_report.md                # Resultados de pruebas con pytest
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_game.py                  # Pruebas automatizadas de lógica de juego
│   ├── logs/                             # Logs locales persistentes (ignorado en Git)
│   ├── Dockerfile                        # Dockerfile para entorno de desarrollo/producción
│   └── requirements.txt                  # Dependencias del backend
├── laliga-trivia-frontend/
│   ├── docs_front/
│   │   └── DOCUMENTACION_COMPLETA_FRONT.md
│   ├── src/
│   │   ├── components/                   # Botones, alertas y layout
│   │   ├── pages/                        # Pantallas (Start, Play, Final/Game Over)
│   │   ├── services/                     # Peticiones fetch reactivas al backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile                        # Multi-stage build con servidor Nginx
│   └── package.json                      # Dependencias del frontend
├── docker-compose.yml                    # Orquestador local multi-contenedor
├── Makefile                              # Atajos para compilación y testing
├── .gitignore                            # Exclusión global para el monorepo
└── README.md                             # Esta guía de presentación
```

---

## 4. Despliegue y Ejecución Rápida

Para facilitar la evaluación del proyecto en cualquier sistema operativo, se han unificado los comandos de automatización:

### Uso Directo de Docker Compose (Alternativa manual):
Si prefieres ejecutar los comandos de Docker de forma directa:
* **Levantar todo el proyecto:** `docker-compose up -d --build`
* **Levantar/Actualizar solo el Frontend:** `docker-compose up -d --build frontend`
* **Levantar/Actualizar solo el Backend:** `docker-compose up -d --build backend`
* **Ejecutar pruebas unitarias:** `docker-compose run --rm backend pytest`
* **Apagar el entorno (y limpiar volúmenes):** `docker-compose down -v`

### Ejecución rápida con comandos `make`:
Tanto en **macOS / Linux** (usando la herramienta estándar `make`) como en **Windows** (gracias a un script `make.bat` automatizado en la raíz del proyecto), puedes ejecutar:
* **Levantar todo el proyecto:** `make up`  (o `.\make up` en PowerShell)
* **Levantar/Actualizar solo el Frontend:** `make up-frontend`  (o `.\make up-frontend` en PowerShell)
* **Levantar/Actualizar solo el Backend:** `make up-backend`  (o `.\make up-backend` en PowerShell)
* **Ejecutar pruebas unitarias:** `make test`  (o `.\make test` en PowerShell)
* **Apagar el entorno:** `make down`  (o `.\make down` en PowerShell)

Una vez levantados los servicios:
* **Frontend:** Accesible directamente en `http://localhost` (puerto `80` por defecto, con redirección interna de `/api` mediante Nginx proxy).
* **Backend y Docs:** La documentación de la API e interfaz interactiva de Swagger están accesibles en `http://localhost:8000/docs`.

---

## 5. Qué se mejoraría con más tiempo

Si contáramos con más tiempo de desarrollo para producción, se implementarían las siguientes mejoras:
* **Persistencia de Sesiones en Base de Datos:** Reemplazar el diccionario temporal en memoria (`sessions`) por una base de datos externa. Esto evitaría que las sesiones se pierdan si el servidor de la API se reinicia, y permitiría levantar múltiples instancias del backend (escalabilidad horizontal) compartiendo el estado de las partidas.
* **Limpieza de Sesiones Obsoletas en Segundo Plano:** En lugar de limpiar las sesiones inactivas durante el hilo principal de las solicitudes HTTP, utilizaríamos un script programado en segundo plano (cron job o tarea programada) para depurar de forma transparente los registros expirados.
* **Base de Datos Relacional y Gestión de Cuestionarios:** Migrar el almacenamiento de `questions.json` a una base de datos relacional para soportar dinámicamente la creación de diferentes tests o cuestionarios temáticos.
* **Panel de Administración e Historial de Jugadores:** Crear un portal de administración protegido para que el organizador pueda gestionar las preguntas, dar de alta nuevos cuestionarios y consultar el historial completo de partidas finalizadas con los puntajes, tiempos y clasificaciones de los jugadores para cada test realizado.


