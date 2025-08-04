# Use official Node image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Install a simple static server
RUN npm install -g serve

# Expose port for the static server
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "build", "-l", "3000"]

# docker build -t af-frontend .
# docker run af-frontend