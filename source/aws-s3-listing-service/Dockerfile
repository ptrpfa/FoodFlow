# Step 1: Choose base image
FROM node:bookworm-slim

# Step 2: Set the working directory in the Docker container
WORKDIR /usr/src/app

# Step 3: Copy package files and install dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the code
COPY . .

# Step 6: Expose the port
EXPOSE 5001

# Step 7: Set the command to run your app
CMD ["npm", "run", "start:dev"]
