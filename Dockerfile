# Use Node.js 18 alpine version as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /react-docker-example/

# Copy package.json and package-lock.json (if available)
COPY package.json /react-docker-example/
COPY package-lock.json /react-docker-example/

# Install dependencies, with compatibility for legacy OpenSSL
RUN npm install --legacy-peer-deps

# Set environment variable for OpenSSL compatibility with Webpack
ENV NODE_OPTIONS=--openssl-legacy-provider

# Copy the rest of the application files
COPY public/ /react-docker-example/public
COPY src/ /react-docker-example/src

# Expose the port the app runs on (default for React is 3000)
EXPOSE 3000

# Start the React application
CMD ["npm", "start"]

