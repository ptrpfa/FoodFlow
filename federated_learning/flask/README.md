## Federated Learning Server
Simple Flask server used for federated learning of food safety for binary classification of food images as `Fresh` or `Rotten`. The server has exposed endpoints used to receive updated weights of the global model that are trained on edge client devices.

### Program Usage
---
| Note: Tensorflow, TensorflowJS, Tensorflow Federated is best suited to run on Windows or Linux based devices. It is unable to run properly on Silicon-based Mac devices. Running the program on a **Linux-based server** with `Python` and `NodeJS` installed is preferred.

1. Install all necessary programs and libraries (`Python`)
    ```
    # Debian-based Linux Installation (perform your own form of installations if installing on another type of device)
    sudo apt update
    sudo apt-get -y install python3 python3-pip python3-venv git
    ```
2. Create a `virtualenv` for the project
    ```
    python3 -m venv .venv
    source .venv/bin/activate
    ```
3. Install the necessary project dependencies
    ```
    # Python
    pip3 install -U flask flask-cors tensorflow tensorflowjs tensorflow-federated

    OR

    # Ensure you are within the directory with requirements.txt
    pip3 install -r requirements.txt 
    ```
4. Run the server (ensure multi-threading is enabled)
    ```
    python3 -m flask --app server --debug run

    OR

    sudo flask run --host=0.0.0.0 --port=80 --with-threads --debug
    ```