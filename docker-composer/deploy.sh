#!/bin/sh

# Namespace name
namespace_name="food-flow"

# Create the namespace
kubectl create namespace "$namespace_name"
echo "Namespace $namespace_name created."


# Loop through all YAML files in the current directory and apply them
for file in *.yaml; do
  if [ -f "$file" ]; then
    echo "Applying $file to namespace $namespace_name"
    kubectl apply -f "$file" --namespace "$namespace_name"
    echo ""
  fi
done

# Apply the utils folder 
kubectl apply -f ./utils/metric-server.yaml
echo ""
kubectl apply -f ./utils/zoo-deployment.yaml --namespace "$namespace_name"
echo ""
kubectl apply -f ./utils/metric-server.yaml --namespace "$namespace_name"
echo ""


echo "All YAML files in the current directory applied successfully"
echo "Kubernetes banzai!"

