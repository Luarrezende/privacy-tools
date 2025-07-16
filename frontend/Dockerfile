# Stage 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Servir os arquivos estáticos com um servidor web leve (nginx)
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta que o nginx usa
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
