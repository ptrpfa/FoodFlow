# Use an official Node.js runtime as a parent image
FROM node:slim

# Set the working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY socket.js .

# Define the command to run your app
CMD ["node", "socket.js"]
