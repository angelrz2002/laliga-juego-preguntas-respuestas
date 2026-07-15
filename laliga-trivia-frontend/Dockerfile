# Etapa 1: Compilación de la aplicación
FROM node:20-alpine AS build

WORKDIR /app

# Copiar configuración de dependencias e instalarlas
COPY package.json ./
RUN npm install

# Copiar todo el código del frontend y compilarlo
COPY . .

# Inyectar variable de entorno para enrutar de forma relativa en producción
ENV VITE_API_URL=/api
RUN npm run build

# Etapa 2: Servir los archivos estáticos mediante Nginx
FROM nginx:alpine

# Copiar la compilación al directorio público de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada del proxy de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto estándar de Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
