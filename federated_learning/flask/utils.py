import tensorflow as tf
import tensorflowjs as tfjs
import io
import time
import os
import json
import hashlib
from config import *

""" Functions """
# Function to calculate the SHA256 hash of a file or string
def get_hash(object, is_file=True):
  sha256 = hashlib.sha256()
  if(is_file):
    # Calculate hash of file
    with open(object, "rb") as file:
        while True:
          # Read the file in chunks
          chunk = file.read(4096)
          if not chunk:
              break
          sha256.update(chunk)
  else:
    # Calculate hash of string
    sha256.update(object.encode())
  return sha256.hexdigest()

# Function to calculate the SHA256 hash of a model (assume model.json and weights.bin are present in the file path provided)
def get_model_hash(folder_path):
  # NOTE: .h5 model file is not used as it will always produce a different hash
  # Get hash of JSON and weights file
  json_hash = get_hash(f"{folder_path}/model.json")
  if(os.path.exists(f"{folder_path}/weights.bin")):
    weights_hash = get_hash(f"{folder_path}/weights.bin")
  else:
    weights_hash = get_hash(f"{folder_path}/model.weights.bin")
  # Get hash of concatenated hashes
  return get_hash(json_hash + weights_hash, is_file=False)

# Function to load a model
def load_model(file_path):
  # Return model
  return tf.keras.saving.load_model(file_path)

# Function to check for a new client model
def check_new_model(model, list_models, global_hash):
  # Check for matching hash
  if(model['hash'] == global_hash):
    print("\nGlobal model detected! Model already exists!")
    return False
  # Check for invalid training size
  if(model['training_size'] <= 0):
    print("\nTraining size of model is invalid!")
    return False
  # Loop through each model in the list of models
  for current_model in list_models:
    # Check for identical model hashes
    if(current_model['hash'] ==  model['hash']):
      print("\nModel already exists!")
      return False
  return True

# Function to write to the accepted client models file
def update_client_models_file(new_list):
  with open(FILE_CLIENT_MODELS, "w") as file:
    json.dump(new_list, file)

# Function to load a list from the accepted client models file
def load_client_models_file():
  with open(FILE_CLIENT_MODELS, "r") as file:
    return json.load(file)
  
""" Classes """
# Class to receive models from client edge devices
class ModelReceiver(object):
  # Constructor
  def __init__(self):
    self._model_json_bytes = None
    self._model_json_writer = None
    self._weight_bytes = None
    self._weight_writer = None

  # Function to handle incoming uploaded model data (JSON and weights.bin)
  def stream_factory(self, total_content_length, content_type, filename, content_length=None):
    if filename == 'model.json':
      self._model_json_bytes = io.BytesIO()
      self._model_json_writer = io.BufferedWriter(self._model_json_bytes)
      return self._model_json_writer
    elif filename == 'model.weights.bin':
      self._weight_bytes = io.BytesIO()
      self._weight_writer = io.BufferedWriter(self._weight_bytes)
      return self._weight_writer

  # Function to save model files (JSON, weights and .h5 workable model)
  def save_model(self):
    # Get current UNIX timestamp
    unix_timestamp = int(time.time())
    # Create subdirectory
    subdirectory = f"models/saved/{unix_timestamp}"
    os.makedirs(subdirectory, exist_ok=True)

    # Prepare writers
    self._model_json_writer.flush()
    self._weight_writer.flush()
    self._model_json_writer.seek(0)
    self._weight_writer.seek(0)
    
    # Get model's JSON configurations
    json_content = self._model_json_bytes.read()
    # Get model's weights
    weights_content = self._weight_bytes.read()
    # Get training size
    json_dict = json.loads(json_content)
    training_size = json_dict['userDefinedMetadata']['training_size']
    # Save model and weights in their basic forms
    with open(f"{subdirectory}/model.json", "w") as json_file:
      # Remove user defined metadata before saving model.json
      del json_dict['userDefinedMetadata']
      json.dump(json_dict, json_file)
    with open(f"{subdirectory}/weights.bin", "wb") as weights_file:
      weights_file.write(weights_content)

    # Create environment for model
    with tf.Graph().as_default(), tf.compat.v1.Session():
      # Prepare workable model
      current_model = tfjs.converters.deserialize_keras_model(json_content, weight_data=[weights_content], use_unique_name_scope=True)

      # Save workable model
      current_model.save(f"{subdirectory}/model.h5")

    # Get SHA256 hash of model
    hash = get_model_hash(subdirectory)

    # Return current model
    return {"file_path": subdirectory, "training_size": training_size, "hash": hash}