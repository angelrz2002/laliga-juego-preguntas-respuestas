# Enunciado de la Prueba Técnica: LaLiga - Juego de Preguntas y Respuestas

## 1. Objetivos del Proyecto
Desarrollar una aplicación web interactiva (Single Page Application - SPA) tipo juego de preguntas y respuestas ambientada en LaLiga y conceptos de Ciberseguridad. El juego consta de **15 niveles de dificultad incremental**.

## 2. Reglas y Lógica del Juego
* **Estructura:** 15 niveles de preguntas.
* **Progresión:** Cada respuesta correcta permite al jugador avanzar al siguiente nivel de dificultad.
* **Derrota:** Si el jugador falla una pregunta, la partida termina inmediatamente (Game Over).
* **Victoria:** El jugador debe responder correctamente las 15 preguntas consecutivas para lograr la victoria absoluta.

## 3. Enfoque de Seguridad (Zero-Trust)
* **Principio:** El frontend debe ser ciego a las respuestas correctas de las preguntas para evitar trampas (cheats) a través de la inspección del DOM o de las herramientas de desarrollo del navegador.
* **Implementación:** La validación de las respuestas se realiza estrictamente en el backend. El frontend envía la opción seleccionada al servidor mediante una petición POST segura, y el servidor evalúa y devuelve si es correcta o no, junto con el estado actualizado del juego.

## 4. Requisitos del Backend
* **Tecnología:** FastAPI (Python 3.11-slim).
* **Base de datos:** Almacenamiento estático en archivo JSON (`questions.json`) que contenga las 15 preguntas con sus opciones (pero sin exponer la respuesta correcta en la estructura enviada al frontend).
* **Validación:** Modelos robustos con Pydantic (`schemas.py`).
* **Endpoints:** Rutas de control del estado del juego en `/game.py`.
* **Pruebas:** Pruebas unitarias y de integración utilizando `pytest` y `TestClient` (`test_game.py`), almacenando un reporte de resultados en `test_report.md`.
* **Logs:** Configuración de logging automatizada (`logger.py`) que guarde logs locales en `/logs`.

## 5. Requisitos del Frontend
* **Tecnología:** React SPA con Vite y Tailwind CSS.
* **Componentes:** Separación de componentes reutilizables en `src/components/` y pantallas en `src/pages/` (Start, Play, Final).
* **Servicios:** Clases o módulos reactivos de fetch al backend en `src/services/`.
* **Despliegue/Producción:** Dockerfile con "multi-stage build" que compile la aplicación estática y la sirva usando un servidor Nginx.

## 6. Infraestructura y Despliegue Local
* **Orquestación:** Configuración de `docker-compose.yml` para levantar tanto el backend como el frontend de manera integrada.
* **Automatización:** Un `Makefile` que simplifique comandos comunes como ejecución de tests, arranque, detención y compilación de contenedores.

## 7. Lo que se Valora
* Calidad y limpieza del código (Clean Code).
* Arquitectura y estructura organizada.
* Seguridad de la solución (evitar cheats desde el cliente).
* Documentación clara del despliegue y puesta en marcha.
* Cobertura y calidad de las pruebas unitarias.
