# ----------------------------------------------------
# Stage 1: Build Frontend React / Vite App
# ----------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ----------------------------------------------------
# Stage 2: Install Backend Dependencies
# ----------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Install compilation tools required for better-sqlite3 native binary
RUN apk add --no-cache python3 make g++

COPY backend/package*.json ./
RUN npm ci --omit=dev

# ----------------------------------------------------
# Stage 3: Production Runtime
# ----------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime C++ library required for better-sqlite3
RUN apk add --no-cache libstdc++

# Copy backend dependencies and source
COPY backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy compiled frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create persistent storage folder for SQLite
RUN mkdir -p /app/backend/data

# Default production environment variables
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start unified Express server
CMD ["node", "backend/src/server.js"]
