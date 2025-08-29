# Imagen base ligera con Node.js
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json primero (para aprovechar la cache)
COPY package*.json ./

# Instalar solo dependencias necesarias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto de Express (usa el mismo que en tu app.js)
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "src/app.js"]
