# Stage 1: Build the React app
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files, including public
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the React app using nginx
FROM nginx:stable-alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration to handle routing
COPY nginx.conf /etc/nginx/conf.d/

# Copy the build output from the previous stage to the nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]