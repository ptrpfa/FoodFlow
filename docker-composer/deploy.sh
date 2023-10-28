#!/bin/sh

# Namespace name
namespace_name="food-flow"

# Check if the namespace already exists
if kubectl get namespace "$namespace_name" &> /dev/null; then
  echo "Namespace $namespace_name already exists."
else
  # Create the namespace
  kubectl create namespace "$namespace_name"
  echo "Namespace $namespace_name created."
fi


# Loop through all YAML files in the current directory and apply them
for file in *.yaml; do
  if [ -f "$file" ]; then
     echo "Applying $file to namespace $namespace_name"
    kubectl apply -f "$file" --namespace "$namespace_name"
  fi
done

echo "All YAML files in the current directory applied successfully"
echo "Kubernetes banzai!"

