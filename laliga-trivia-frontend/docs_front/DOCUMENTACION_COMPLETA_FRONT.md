# Documentación Técnica del Frontend - LaLiga Trivia Client

Este documento describe la arquitectura, decisiones estéticas y manejo de flujos de la aplicación de cliente de una sola página (SPA) construida en Julio de 2026.

---

## 1. Stack Tecnológico y UX
* **React 18 + Vite:** Elección óptima para un desarrollo ágil y una compilación de producción ultra rápida basada en módulos ES nativos.
* **Tailwind CSS:** Framework de diseño utilizado para lograr una interfaz moderna, limpia, de corte deportivo y con los acentos cromáticos característicos de LaLiga.
* **Componentes Vectoriales (SVG):** Se eliminaron los emojis genéricos del sistema por iconos vectoriales personalizados integrados con clases dinámicas de Tailwind, elevando la calidad visual del entregable.

---

## 2. Architectura de Estados de la SPA
La lógica del juego se centraliza en `App.jsx` controlando un flujo de estados reactivos muy estricto que responde a 5 pantallas principales:

```text
 [ START ] ──► [ PLAYING ] ──► (Selección Opción) ──► [ FEEDBACK (1.5s) ]
                     │                                         
                     ├───► (Si acierta y es Nivel 15) ────────────► [ VICTORY ]
                     │                                         
                     └───► (Si falla en cualquier nivel) ─────────► [ GAME_OVER ]
```

* **START:** Pantalla inicial con formulario de nombre del jugador y explicación clara de las normas de ciberseguridad del reto.
* **PLAYING:** Interfaz interactiva de juego que carga de forma reactiva la pregunta actual, muestra las 4 opciones de respuesta y dibuja la barra de progreso.
* **FEEDBACK:** Estado intermedio de bloqueo de clics que dura 1.5 segundos. Revela instantáneamente el resultado de la acción del usuario iluminando el botón en verde (acierto) o en rojo (error, mostrando la opción correcta para mejorar el aprendizaje).
* **GAME_OVER:** Pantalla que resume la partida en caso de derrota, indicando el nivel alcanzado y el botón para volver a jugar.
* **VICTORY:** Pantalla que festeja que el usuario ha completado el desafío de los 15 niveles de forma invicta.

---

## 3. Integración con Nginx y Orquestación Docker
* **Desacoplamiento:** Las llamadas se realizan de forma genérica a través de un cliente de API (`src/services/api.js`) centralizando el endpoint base usando `import.meta.env.VITE_API_URL` o constantes globales de configuración.
* **Servidor Nginx como Proxy Inverso:** En el contenedor Docker final, el servidor web Nginx expone el frontend en el puerto 80. Todas las peticiones dirigidas al subdirectorio `/api` son capturadas por el proxy de Nginx y enviadas internamente al backend de FastAPI en el puerto 8000, solucionando de raíz cualquier bloqueo de CORS en entornos productivos.
