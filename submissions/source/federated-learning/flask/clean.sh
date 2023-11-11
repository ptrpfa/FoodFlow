#!/bin/sh

# Simple script to clean up federated server to its initial state (run this script with SUDO)
sudo rm -rf models/saved/*
echo "[]" > models/client_models.txt

# Reset global model
sudo rm models/*.bin
sudo rm models/*.h5
sudo rm models/*.json
cp models/global/* models/.