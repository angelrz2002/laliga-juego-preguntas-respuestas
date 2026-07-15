.PHONY: up down test build up-frontend up-backend

up:
	docker-compose up -d --build

up-frontend:
	docker-compose up -d --build frontend

up-backend:
	docker-compose up -d --build backend

down:
	docker-compose down

test:
	docker-compose run --rm backend pytest

build:
	docker-compose build

