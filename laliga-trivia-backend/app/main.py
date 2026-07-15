from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import game
from app.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Iniciando la API del Juego de Preguntas y Respuestas de LaLiga...")
    yield
    logger.info("Apagando la API del Juego de Preguntas y Respuestas de LaLiga...")

app = FastAPI(
    title="LaLiga - Juego de Preguntas y Respuestas API",
    description="API segura con enfoque Zero-Trust para el Juego de Preguntas y Respuestas de LaLiga y Ciberseguridad",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración de CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción se debe restringir a los dominios del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas del juego
app.include_router(game.router, prefix="/api")

@app.get("/")
def read_root():
    """Endpoint básico de salud para comprobar que la API funciona."""
    return {
        "status": "online",
        "message": "API del Juego de Preguntas y Respuestas de LaLiga - Servicio activo"
    }
