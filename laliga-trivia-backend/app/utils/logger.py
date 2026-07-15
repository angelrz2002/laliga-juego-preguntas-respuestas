import os
import sys
import logging
from logging.handlers import RotatingFileHandler

# Obtener la ruta base del backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_DIR = os.path.join(os.path.dirname(BASE_DIR), "logs")

# Configurar el logger principal
logger = logging.getLogger("laliga_juego")
logger.setLevel(logging.INFO)

# Formateador de logs
formatter = logging.Formatter(
    "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)d] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Handler para consola
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Intentar configurar el handler para archivo (puede fallar por permisos en volúmenes Docker/host)
try:
    os.makedirs(LOG_DIR, exist_ok=True)
    LOG_FILE = os.path.join(LOG_DIR, "game.log")
    
    # Handler para archivo con rotación (5MB por archivo, máximo 3 de respaldo)
    file_handler = RotatingFileHandler(
        LOG_FILE,
        maxBytes=5 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8"
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
except (PermissionError, OSError) as e:
    logger.warning(
        f"No se pudieron configurar los logs en archivo debido a un error de permisos o del sistema: {str(e)}. "
        "Los logs se emitirán únicamente a través de la consola estándar (sys.stdout)."
    )

