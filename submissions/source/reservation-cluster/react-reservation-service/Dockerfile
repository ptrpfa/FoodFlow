# Use an official Node.js runtime as a parent image
FROM node:lts-slim

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5003

# Define the command to run your app
CMD ["node", "reservation-service.js"]
