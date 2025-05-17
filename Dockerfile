# ---------- Stage 1: Install frontend dependencies ----------
FROM node:23-alpine AS deps-app
WORKDIR /app

COPY app/package.json app/package-lock.json* ./
RUN npm ci

# ---------- Stage 2: Build the frontend ----------
FROM deps-app AS build-app
COPY app/ ./
RUN npm run build

# ---------- Stage 3: Install backend dependencies ----------
FROM node:23-alpine AS deps-api
WORKDIR /api

COPY api/package.json api/package-lock.json* ./
RUN npm ci

# Copy backend source code (this is the fix)
COPY api/ ./

# ---------- Stage 4: Final runtime image ----------
FROM node:23-alpine AS runner

RUN apk add --no-cache tini

WORKDIR /workspace

# Copy built frontend
COPY --from=build-app /app ./app
# Copy backend source and node_modules
COPY --from=deps-api /api ./api

EXPOSE 3000 5000

ENTRYPOINT ["/sbin/tini", "--"]

# Start both frontend and backend concurrently
CMD ["sh", "-c", "cd app && npm start & cd api && npm start"]