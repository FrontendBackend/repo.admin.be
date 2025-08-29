# Imagen base con glibc 2.38+
FROM node:20-bookworm

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias del sistema necesarias para compilar paquetes nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de producción dentro del contenedor
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer el puerto (ajusta si usas otro)
EXPOSE 3000

# Comando por defecto
CMD ["node", "server.js"]
