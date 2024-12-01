# Use Node.js 18 alpine version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Set the NODE_OPTIONS to use OpenSSL legacy provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Expose the port your server listens on
EXPOSE 5555

# Start the Node.js server
CMD ["node", "server.js"]
