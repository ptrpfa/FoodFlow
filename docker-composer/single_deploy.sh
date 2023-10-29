#!/bin/sh

# Check if the service folder argument is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <service-folder>"
  exit 1
fi

service_dir="$1"

# Check if the specified directory exists
if [ ! -d "$service_dir" ]; then
  echo "Directory not found. Exiting."
  exit 1
fi

# Build Docker images from the specified directory
service_name=$(basename "$service_dir")
service_name="${service_name%-service}"
echo "Building Docker image for skyish/$service_name..."
docker build -t skyish/$service_name:latest "$service_dir"

# Load Docker images into Minikube
minikube image load skyish/$service_name:latest

echo "Docker image build and load completed."