#!/bin/sh

# Get the parent directory of the script
parent_dir="$(dirname "$(pwd)")"

# Find all folders ending with "-service" in the parent directory
service_folders=$(find "$parent_dir" -maxdepth 1 -type d -name '*-service')

# Loop through the service folders and build Docker images
for service_dir in $service_folders; do
  full_service_name=$(basename "$service_dir")
  service_name="${full_service_name%-service}" 
  echo "Building Docker image for skyish/$service_name..."
  docker build -t skyish/$service_name:latest "$service_dir"

  # Load into minikube for local testing
  minikube image load skyish/$service_name:latest "$service_dir"
  
done

echo -e "Docker image build completed.\n"

# Loop through all YAML files in the current directory and apply them
for file in *.yaml; do
  if [ -f "$file" ]; then
    echo "Applying $file ..."
    kubectl apply -f "$file" 
  fi
done

echo "All YAML files in the current directory applied successfully"
echo "Kubernetes banzai!"

