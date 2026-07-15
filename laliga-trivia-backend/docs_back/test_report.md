# Reporte de Aseguramiento de Calidad y Pruebas Unitarias

Este reporte documenta los criterios de calidad y los resultados de las pruebas unitarias automatizadas ejecutadas dentro de los contenedores del proyecto en Julio de 2026.

---

## 1. Entorno de Ejecución de Pruebas
Para garantizar que las pruebas se ejecutan en un entorno idéntico al de producción, la suite completa se dockeriza y corre aislada dentro del contenedor del backend usando cualquiera de los siguientes comandos:
```bash
docker-compose run --rm backend pytest 
# O bien usando el comando de automatización:
make test
```

## 2. Cobertura de Casos Críticos (Auditoría Zero-Trust y Sesiones)
Se desarrollaron tests unitarios utilizando el `TestClient` de FastAPI para cubrir el flujo de control completo del juego y la prevención de manipulación de parámetros:

| Código | Caso de Prueba | Objetivo Técnico | Estado |
| :--- | :--- | :--- | :--- |
| **T01** | `test_read_root` | Asegurar que el punto de entrada raíz del backend responde correctamente con estado funcional. | ✅ PASSED |
| **T02** | `test_start_game` | Validar que al iniciar se sirve el Nivel 1, se genera el UUID de sesión y que el payload no expone la respuesta. | ✅ PASSED |
| **T03** | `test_submit_correct_answer_advances` | Confirmar que enviar una respuesta correcta utilizando el `session_id` avanza de nivel de forma progresiva. | ✅ PASSED |
| **T04** | `test_submit_wrong_answer_game_over` | Comprobar que un fallo en cualquier nivel provoca el estado de `game_over` inmediato, revela la respuesta correcta y destruye la sesión. | ✅ PASSED |
| **T05** | `test_submit_invalid_session` | Verificar que peticiones con identificadores de sesión inexistentes o caducados son rechazadas con un error 403. | ✅ PASSED |
| **T06** | `test_win_game` | Simular una partida perfecta respondiendo correctamente los 15 niveles de forma consecutiva, validando la bandera de victoria absoluta. | ✅ PASSED |

## 3. Resumen Técnico del Resultado
La suite de pruebas fue ejecutada con éxito obteniendo un 100% de éxito (**6/6 PASSED**). Las librerías principales de testing utilizadas son `pytest` y `httpx` para simular las peticiones de integración del cliente hacia la API de FastAPI.


