# Configurations
FLASK_HOST = "0.0.0.0"                                              # Flask host
FLASK_PORT = "80"                                                   # Flask port
FLASK_THREADED = True                                               # Flask threaded option
FLASK_DEBUG = True                                                  # Flask debug option
FOLDER_GLOBAL_MODEL = "models"                                      # Folder storing global model files
FILE_GLOBAL_MODEL = f"{FOLDER_GLOBAL_MODEL}/model.h5"               # HDF5 file representation of global model
FILE_CLIENT_MODELS = f"{FOLDER_GLOBAL_MODEL}/client_models.txt"     # File containing list of accepted client models for federated learning
MIN_FEDERATED_SIZE = 3                                              # Minimum number of client models to begin federated learning