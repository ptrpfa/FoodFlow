## Federated Learning Server
---
This section contains code used to deploy a simple Flask server to perform federated learning on images for food safety, through binary classification into `Fresh` or `Rotten`. The server has exposed endpoints that are used to receive models from local client-side training performed on edge client devices (through web-based Tensorflow.js). The federated learning server will update the global model accordingly using a simple federated averaging algorithm, once the required amount of client models have been received. 

These exposed endpoints are listed below:
- `/` 
    - Root endpoint only meant for testing purposes, should be removed when the server is fully deployed
- `/get_model/<file>` 
    - Used by Tensorflow.js running on client devices to fetch the global model files (`model.json` and `weights.bin`)
- `/upload_model` 
    - Used by Tensorflow.js running on client devices to upload local models trained on client devices

The global model has already been pre-trained previously (refer to `global_model` section) based on the Stale-and-Fresh dataset. The pre-trained global model files are stored on the `models/` and `model/global` folders. The global model is ready to be used out-of-the-box and does not need to be re-trained, unless required. 

### Directory Structure
---
```
models/ (contains exported Tensorflow models)
    global/ (contains a copy of the pre-trained global model files)
    saved/ (folder used to store the uploaded client-trained model files)
    client_models.txt (file used to track accepted client models in line for federated learning)
    model.h5 (HDF5 file of current global model, required by Tensorflow.js to load the model)
    model.json (JSON file of current global model, required by Tensorflow.js to load the model)
    model.weights.bin (Weights file of current global model, required by Tensorflow.js to load the model)

templates/
    index.html (test page for the root / endpoint, should not be used when the server is deployed)

Dockerfile (used to create a Docker image to run the federated server as a microservice)

clean.sh (basic script used to reset the federated server to its base state)

config.py (configuration file for federated learning server)

utils.py (contains utility functions used by the Flask server)

app.py (main program used to run the Flask server)

requirements.txt (Python dependencies required to run the server)

mac_arm_requirements.txt (Python dependencies required to run the server on a local Silicon-based Mac device)

README.md (this file)
```

### Program Usage
---
To run the federated learning Flask server, you can either install and execute the program locally or on a Docker container (preferred) as a microservice:
1. [Docker Installation](#docker-installation-preferred)
2. [Local Installation](#local-installation)

#### Docker Installation (Preferred)
---
1. Ensure you have Docker installed on your machine. Click [here](https://docs.docker.com/engine/install/) for installation instructions.
2. Ensure that the Flask server is configured correctly. Modify the `config.py` file to set the desired configurations.
    ```
    # Configurations
    FLASK_HOST = "0.0.0.0"                                           # Flask host (listen on all network interfaces to accept incoming connections from any IP address, change to your intended IP address if any)
    FLASK_PORT = "80"                                                # Flask port (change this to your intended exposed port)
    FLASK_THREADED = True                                            # Flask threaded option (should be enabled for better performance)
    FLASK_DEBUG = True                                               # Flask debug option (should set to False on production environments)
    FOLDER_GLOBAL_MODEL = "models"                                   # Folder storing global model files
    FILE_GLOBAL_MODEL = f"{FOLDER_GLOBAL_MODEL}/model.h5"            # HDF5 file representation of global model
    FILE_CLIENT_MODELS = f"{FOLDER_GLOBAL_MODEL}/client_models.txt"  # File containing list of accepted client models for federated learning
    MIN_FEDERATED_SIZE = 3                                           # Minimum number of client models to begin federated learning
    ```
3. Build the `federated-server` Docker image by running the following command:
    ```
    sudo docker build -t federated-server .
    ```
4. Run the `federated-server` container using the following command:
    ```
    # For an interactive terminal to view output
    sudo docker run -it --name federated --rm -p 80:80 federated-server

    # Detached mode
    sudo docker run -d --name federated --rm -p 80:80 federated-server
    ```

    Ensure that the `host:container` exposed port is configured as desired. You need to take note of which port is exposed by the host and the address of the host machine, for communications with the edge client devices. 
    
    This final `host:port` address of the federated server should be correctly configured on the web application for client-devices so that they can fetch the global model and send their local models to the server correctly.

5. Start the web application and use a browser to test the server! 

    If the default `/` endpoint has been enabled for testing, simply enter the federated server's address on a browser to test the system. A video demo is available [here](https://www.youtube.com/watch?v=m28YuqPx-1c).

#### Local Installation
---
| Note: Running the program on a **Linux-based server** with `Python` installed is preferred.

1. Install all necessary programs and libraries (`Python` and `Pip`)
    ```
    # Debian-based Linux Installation (perform your own form of installations if installing on another type of device)
    sudo apt update
    sudo apt-get -y install python3 python3-pip python3-venv
    ```
2. Create a `virtualenv` for the project
    ```
    python3 -m venv .venv
    source .venv/bin/activate
    ```
3. Install the necessary project dependencies
    ```
    # Python (preferred due to interdependencies required by Tensorflow)
    pip3 install -U flask flask-cors tensorflow tensorflowjs

    OR

    # Ensure you are within the directory with requirements.txt
    pip3 install -r requirements.txt 

    # If you are running the server on an Apple Silicon Macbook, install dependencies from the mac_arm_requirements.txt file instead
    pip3 install -r mac_arm_requirements.txt
    ```
4. Ensure that the Flask server is configured correctly. Modify the `config.py` file to set the desired configurations.
    ```
    # Configurations
    FLASK_HOST = "0.0.0.0"                                           # Flask host (listen on all network interfaces to accept incoming connections from any IP address, change to your intended IP address if any)
    FLASK_PORT = "80"                                                # Flask port (change this to your intended exposed port)
    FLASK_THREADED = True                                            # Flask threaded option (should be enabled for better performance)
    FLASK_DEBUG = True                                               # Flask debug option (should set to False on production environments)
    FOLDER_GLOBAL_MODEL = "models"                                   # Folder storing global model files
    FILE_GLOBAL_MODEL = f"{FOLDER_GLOBAL_MODEL}/model.h5"            # HDF5 file representation of global model
    FILE_CLIENT_MODELS = f"{FOLDER_GLOBAL_MODEL}/client_models.txt"  # File containing list of accepted client models for federated learning
    MIN_FEDERATED_SIZE = 3                                           # Minimum number of client models to begin federated learning
    ```
5. Run the Flask server
    ```
    sudo python3 app.py
    ```
6. If you are just testing the Flask server, navigate to the the `/` endpoint on a web browser to view the testing page. A video demo is available [here](https://www.youtube.com/watch?v=m28YuqPx-1c). 

    Otherwise, configure your client Tensorflow.js devices to link to the Flask server to communicate with it!