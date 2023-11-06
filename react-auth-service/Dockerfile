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

# Step 6: Generate the prisma folder inside node_modules folder
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate

# Step 7: Expose the port
EXPOSE 5000

# Step 8: Run the server
CMD ["npm", "run", "start:dev"]
