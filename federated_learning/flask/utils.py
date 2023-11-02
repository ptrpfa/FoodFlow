import tensorflow as tf
import tensorflowjs as tfjs
import io

# Class to receive models from client edge devices
class ModelReceiver(object):
  # Constructor
  def __init__(self):
    self._model = None
    self._model_json_bytes = None
    self._model_json_writer = None
    self._weight_bytes = None
    self._weight_writer = None
  
  @property
  def model(self):
    # Prepare writers
    self._model_json_writer.flush()
    self._weight_writer.flush()
    self._model_json_writer.seek(0)
    self._weight_writer.seek(0)
    # Get model
    json_content = self._model_json_bytes.read()
    # Get weights
    weights_content = self._weight_bytes.read()
    
    # Save to file
    with open("models/model.json", "wb") as json_file:
            json_file.write(json_content)
    with open("models/model.weights.bin", "wb") as weights_file:
        weights_file.write(weights_content)

    # Return deserialised model to caller
    return tfjs.converters.deserialize_keras_model(json_content, weight_data=[weights_content], use_unique_name_scope=True)

  def stream_factory(self, total_content_length, content_type, filename, content_length=None):
    # Note: this example code isnot* thread-safe.
    if filename == 'model.json':
      self._model_json_bytes = io.BytesIO()
      self._model_json_writer = io.BufferedWriter(self._model_json_bytes)
      return self._model_json_writer
    elif filename == 'model.weights.bin':
      self._weight_bytes = io.BytesIO()
      self._weight_writer = io.BufferedWriter(self._weight_bytes)
      return self._weight_writer