# Stage 1: Build the frontend
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the full source code and build it
COPY . .
ENV NODE_OPTIONS="--openssl-legacy-provider"  
# Fixes crypto.getRandomValues error
RUN npm run build

# Stage 2: Serve the built frontend
FROM node:18-alpine
WORKDIR /app

# Install `serve` globally
RUN npm install -g serve

# Copy the built frontend from the build stage
COPY --from=build /app/dist /app/dist

# Set environment variables
ENV PORT=5001
ENV NODE_ENV=production

# Expose port and serve frontend
EXPOSE 5001
CMD ["serve", "-s", "dist", "-l", "5001"]
