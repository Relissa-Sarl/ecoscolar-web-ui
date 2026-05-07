# --- Étape 1 : Build de l'application ---
FROM node:lts-alpine as build-stage

# 1. Ajout des librairies de compatibilité pour Alpine
RUN apk add --no-cache libc6-compat

# Active Corepack pour utiliser pnpm
RUN corepack enable pnpm

# Définit le dossier de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances en premier (pour optimiser le cache Docker)
COPY package*.json pnpm-lock.yaml ./

# Installe les dépendances avec pnpm
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copie le reste des fichiers du projet
COPY . .

# Génère l'application statique pour la production
RUN pnpm run build

# --- Étape 2 : Serveur Nginx pour la production ---
FROM nginx:stable-alpine as production-stage

# Copie les fichiers compilés depuis l'étape précédente vers le dossier de Nginx
COPY --from=build-stage /app/.output/public/. /usr/share/nginx/html/

# Expose le port 80 pour pouvoir y accéder
EXPOSE 80

# Lance Nginx
CMD ["nginx", "-g", "daemon off;"]