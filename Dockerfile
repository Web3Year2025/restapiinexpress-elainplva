# ── Stage 1: Build ──────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install all dependencies including dev (needed for TypeScript compile)
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# ── Stage 2: Production ─────────────────────────────────────────────
FROM node:24.13-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy compiled JS from builder stage
COPY --from=builder /app/build ./build

# Expose the port your Express app runs on
EXPOSE 3001

# Start the server
CMD ["node", "build/server.js"]