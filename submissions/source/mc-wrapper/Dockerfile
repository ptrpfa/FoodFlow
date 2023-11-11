# Use Alpine Linux as a base image
# MAC
FROM arm64v8/alpine:latest
# Windows
#FROM alpine:latest

# Install required dependencies
RUN apk update && apk add --no-cache docker curl

# Get kubectl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \
    && chmod +x ./kubectl \
    && mv ./kubectl /usr/bin/kubectl

# Specify a working directory
WORKDIR /app

# Copy your application files into the container (if needed)
COPY . .

# Command to run when the container starts
CMD ["sh", "-c", "./deploy.sh && sh"]
