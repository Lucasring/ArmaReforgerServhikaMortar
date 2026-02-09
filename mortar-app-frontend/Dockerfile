# --- STAGE 1: Build ---
FROM node:20-alpine AS build-stage

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code and build
COPY . .
RUN npm run build

# --- STAGE 2: Production ---
FROM nginx:alpine AS production-stage

# Copy only the compiled files from the build-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]