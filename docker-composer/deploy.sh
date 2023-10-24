#!/bin/bash

# Loop through all YAML files in the current directory and apply them
for file in *.yaml; do
  if [ -f "$file" ]; then
    echo "Applying $file"
    kubectl apply -f "$file"
  fi
done

echo "All YAML files in the current directory applied successfully"
echo "Kubernetes banzai!"

