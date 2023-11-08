## Federated Learning Server
Simple Flask server used for federated learning of food safety for binary classification of food images as `Fresh` or `Rotten`. The server has exposed endpoints used to receive updated weights of the global model that are trained on edge client devices. 

These endpoints are listed below:
- `/` 
    - Root endpoint only meant for client-side testing, this endpoint should be removed when running server as a microservice!
- `/get_model/<file>` 
    - Used by Tensorflow.js running on client devices to fetch the global model files (`model.json` and `weights.bin`)
- `/upload_model` 
    - Used by Tensorflow.js running on client devices to upload local models trained on client devices

### Program Usage
---
To run the federated learning Flask server, you can install and execute the program either locally or on a Docker container (preferred):
1. [Docker Installation](#docker-installation-preferred)
2. [Local Installation](#local-installation)

#### Docker Installation (Preferred)
---
1. Ensure you have Docker installed on your machine. Click [here](https://docs.docker.com/engine/install/) for installation instructions.
2. Build the `federated-server` Docker image by running the following command:
    ```
    sudo docker build -t federated-server .
    ```
3. Run the `federated-server` container using the following command:
    ```
    # For interactive terminal
    sudo docker run -it --name federated --rm -p 80:80 federated-server

    # Detached mode
    sudo docker run -d --name federated --rm -p 80:80 federated-server
    ```

#### Local Installation
---
| Note: Running the program on a **Linux-based server** with `Python` and `NodeJS` installed is preferred.

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
6. If you are just testing the Flask server, navigate to the the `/` endpoint on a web browser to view the testing page. A demo is available [here](https://www.youtube.com/watch?v=m28YuqPx-1c). Otherwise, configure your client Tensorflow.js devices to link to the Flask server to communicate with it! 

If you are running the Flask server on a Docker container, make sure to configure the `host`:`port` address on your client devices correctly so that they can fetch the global model and send their local models to the server!