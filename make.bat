@echo off
set action=%1
if "%action%"=="up" (
    echo 🚀 Levantando entorno de producción con Docker...
    docker-compose up -d --build
) else if "%action%"=="up-frontend" (
    echo 🚀 Levantando únicamente el servicio Frontend...
    docker-compose up -d --build frontend
) else if "%action%"=="up-backend" (
    echo 🚀 Levantando únicamente el servicio Backend...
    docker-compose up -d --build backend
) else if "%action%"=="down" (
    echo 🛑 Deteniendo contenedores...
    docker-compose down
) else if "%action%"=="test" (
    echo 🧪 Ejecutando pruebas unitarias en el backend...
    docker-compose run --rm backend pytest
) else if "%action%"=="build" (
    echo 📦 Recompilando imágenes de Docker...
    docker-compose build
) else (
    echo Uso: make [up^|up-frontend^|up-backend^|down^|test^|build]
)

