# pip install -U flask flask-cors tensorflow tensorflowjs
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask, Response, request, render_template
from flask_cors import CORS, cross_origin
import io
import tensorflow as tf
import tensorflowjs as tfjs
import werkzeug.formparser

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADER'] = 'Content-Type'

class ModelReceiver(object):

  def __init__(self):
    self._model = None
    self._model_json_bytes = None
    self._model_json_writer = None
    self._weight_bytes = None
    self._weight_writer = None

  @property
  def model(self):
    self._model_json_writer.flush()
    self._weight_writer.flush()
    self._model_json_writer.seek(0)
    self._weight_writer.seek(0)

    json_content = self._model_json_bytes.read()
    weights_content = self._weight_bytes.read()
    return tfjs.converters.deserialize_keras_model(
        json_content,
        weight_data=[weights_content],
        use_unique_name_scope=True)

  def stream_factory(self,
                     total_content_length,
                     content_type,
                     filename,
                     content_length=None):
    # Note: this example code isnot* thread-safe.
    if filename == 'model.json':
      self._model_json_bytes = io.BytesIO()
      self._model_json_writer = io.BufferedWriter(self._model_json_bytes)
      return self._model_json_writer
    elif filename == 'model.weights.bin':
      self._weight_bytes = io.BytesIO()
      self._weight_writer = io.BufferedWriter(self._weight_bytes)
      return self._weight_writer

model_receiver = ModelReceiver()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/transfer_learning")
def transfer_learning():
    return render_template("transfer_learning.html")

@app.route('/upload_model', methods=['POST'])
@cross_origin()
def upload():
    print('Handling request...')
    werkzeug.formparser.parse_form_data(request.environ, stream_factory=model_receiver.stream_factory)
    print('Received model:')
    with tf.Graph().as_default(), tf.compat.v1.Session():
        model = model_receiver.model
        model.summary()
        # You can perform `model.predict()`, `model.fit()`,
        # `model.evaluate()` etc. here.
    return Response(status=200)