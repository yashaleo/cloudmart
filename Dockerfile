# Use Node.js 18 for the build stage
FROM node:18-alpine as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy rest of the app and build it
COPY . .
ENV NODE_OPTIONS="--openssl-legacy-provider"  # Fixes crypto error
RUN npm run build

# Use Node.js 18 for the production stage
FROM node:18-alpine
WORKDIR /app

# Install `serve` to serve the built frontend
RUN npm install -g serve

# Copy built files from the build stage
COPY --from=build /app/dist /app/dist

# Set environment variables
ENV PORT=5001
ENV NODE_ENV=production

# Expose the port and serve the frontend
EXPOSE 5001
CMD ["serve", "-s", "dist", "-l", "5001"]
