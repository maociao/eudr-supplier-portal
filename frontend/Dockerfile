# Build stage
FROM node:14 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create the entrypoint script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$REACT_APP_API_URL|g" /usr/share/nginx/html/index.html' >> /docker-entrypoint.sh && \
    echo 'sed -i -e "s/\$PORT/$PORT/g" /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 8080
EXPOSE 8080

# Run the shell script when the container starts
CMD ["/docker-entrypoint.sh"]