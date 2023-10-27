# Step 1: Choose base image
FROM node:alpine

# Step 2: Set the working directory in the Docker container
WORKDIR /usr/src/app

# Step 3: Copy package files and install dependencies
COPY package*.json ./

# Step 7: Install the Babel plugin
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Step 4: Copy the rest of the code
COPY . .

# Step 5: Expose the port
EXPOSE 3000

# Step 6: Set the command to run your app
CMD ["npm", "start"]
