# Application build ---
FROM node:lts-alpine as build-stage

# Add compatibility libraries for Alpine
RUN apk add --no-cache libc6-compat

# Enable Corepack to use pnpm
RUN corepack enable pnpm

# Set the working directory in the container
WORKDIR /app

# Copy dependency files first (to optimize Docker cache)
COPY package*.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile --shamefully-hoist

# Copy the rest of the project files
COPY . .

# Generate Nuxt types to prevent TypeScript errors
RUN pnpm nuxi prepare

# Generate the static application for production
ARG NUXT_PUBLIC_API_BASE=https://localhost:5001/api
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
RUN pnpm build

# Nginx server for production ---
FROM nginx:stable-alpine as production-stage

# Configure Nginx to support SPA routing fallback
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    error_page 500 502 503 504 /50x.html;\n\
    location = /50x.html {\n\
        root /usr/share/nginx/html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

# Copy the compiled files from the previous stage to the Nginx directory
COPY --from=build-stage /app/.output/public/. /usr/share/nginx/html/

# Expose port 80 to allow access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]