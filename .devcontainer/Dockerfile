# Usamos la imagen oficial de Node.js LTS
FROM node:lts

# Instalamos herramientas esenciales
RUN apt-get update && \
    apt-get install -y \
    git \
    git-lfs \
    && rm -rf /var/lib/apt/lists/*

# Configuramos el usuario de Node (mejores prácticas)
USER node

# Establecemos el directorio de trabajo
WORKDIR /workspace

# Puerto para desarrollo de Next.js
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "dev"]