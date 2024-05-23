# Etapa de construcción
FROM node:20.5.0-alpine AS build
WORKDIR /app/
COPY . .



# Etapa final
FROM nginx:1.25.1-alpine
COPY .nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/git-pro-web /usr/share/nginx/html
EXPOSE 80