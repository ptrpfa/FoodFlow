import tensorflow as tf
import tensorflowjs as tfjs
import io
import threading
import time
import os

# Class to receive models from client edge devices
class ModelReceiver(object):
  # Constructor
  def __init__(self):
    self.lock = threading.Lock() # Lock for synchronisations
    self._model_json_bytes = None
    self._model_json_writer = None
    self._weight_bytes = None
    self._weight_writer = None

  # Function to handle incoming uploaded model data (JSON and weights.bin)
  def stream_factory(self, total_content_length, content_type, filename, content_length=None):
    # Note: this example code isnot* thread-safe.
    if filename == 'model.json':
      # Lock before accessing shared resources
      with self.lock:
        self._model_json_bytes = io.BytesIO()
        self._model_json_writer = io.BufferedWriter(self._model_json_bytes)
      return self._model_json_writer
    elif filename == 'model.weights.bin':
      # Lock before accessing shared resources
      with self.lock:
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

    # Lock before accessing shared resources
    with self.lock:
      # Prepare writers
      self._model_json_writer.flush()
      self._weight_writer.flush()
      self._model_json_writer.seek(0)
      self._weight_writer.seek(0)
      
      # Get model's JSON configurations
      json_content = self._model_json_bytes.read()
      # Get model's weights
      weights_content = self._weight_bytes.read()

      # Save model and weights in their basic forms
      with open(f"{subdirectory}/model.json", "wb") as json_file:
        json_file.write(json_content)
      with open(f"{subdirectory}/weights.bin", "wb") as weights_file:
        weights_file.write(weights_content)

      # Prepare workable model
      current_model = tfjs.converters.deserialize_keras_model(json_content, weight_data=[weights_content], use_unique_name_scope=True)

      # Save workable model
      current_model.save(f"{subdirectory}/model.h5")

      # Return current model
      return current_model