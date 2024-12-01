# Use Node.js 18 alpine version as the base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Set the NODE_OPTIONS to use OpenSSL legacy provider
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build the React app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the build files from the previous stage to Nginx's web directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 5555

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

CMD ["node", "server.js"]