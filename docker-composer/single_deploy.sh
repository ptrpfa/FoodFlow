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

# Push back to Docker hub
docker push skyish/$service_name:latest 
echo

# Delete old deployment
deployment_name="${service_name}-deployment"
if kubectl delete deployment $deployment_name &>/dev/null; then
  echo "Removing old deployment $deployment_name"
  kubectl delete deployment $deployment_name
  echo 
fi

# Apply back the deployment 
deployment_file="${deployment_name}.yaml"
echo "Restarting deployment $deployment_file"
kubectl apply -f $deployment_file
echo 

echo "Docker image build and deployment load completed."