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
RUN pnpm build

# Nginx server for production ---
FROM nginx:stable-alpine as production-stage

# Copy the compiled files from the previous stage to the Nginx directory
COPY --from=build-stage /app/.output/public/. /usr/share/nginx/html/

# Expose port 80 to allow access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]