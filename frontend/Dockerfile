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
COPY --from=build /app/env.sh /docker-entrypoint.d/
COPY --from=build /app/.env /app/.env

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Make our shell script executable
RUN chmod +x /docker-entrypoint.d/env.sh

# Expose port 8080
EXPOSE 8080

# Use shell form of CMD to invoke bash to evaluate $PORT and run our custom script
CMD ["/bin/sh", "-c", "/docker-entrypoint.d/env.sh && sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]