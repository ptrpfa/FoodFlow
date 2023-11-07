#!/bin/sh

# Simple script to clean up federated server to its initial state (run this script with SUDO)
sudo rm -rf models/saved/*
echo "[]" > models/client_models.txt

# Clean up to remove files not within the client_models txt