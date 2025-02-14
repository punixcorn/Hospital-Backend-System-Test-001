# Stage 1: Build
FROM node:22 as build

# Set working directory
WORKDIR /app

# Copy package and tsconfig files
COPY package*.json tsconfig.json ./

# Install all dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the project (this should compile your TypeScript into the dist folder)
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose the port your app listens on (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
