# pip install -U flask flask-cors tensorflow tensorflowjs tensorflow-federated
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask, Response, request, render_template, send_from_directory
from flask_cors import CORS 
from utils import *
import werkzeug.formparser

# Initialise Flask app
app = Flask(__name__)
CORS(app)

""" Routes """
# Route for client-facing page
@app.route("/")
def index():
  return render_template("index.html")

# Route to fetch pre-trained model's JSON file and weights
@app.route('/get_model/<path:path>')
def load_shards(path):
    return send_from_directory('models', path)

# Route to upload new client-trained model
@app.route('/upload_model', methods=['POST'])
def upload():
  # Receive and parse model
  model_receiver = ModelReceiver()
  werkzeug.formparser.parse_form_data(request.environ, stream_factory=model_receiver.stream_factory)

  with tf.Graph().as_default(), tf.compat.v1.Session():
      model = model_receiver.model
      model.summary()
      
      # You can perform `model.predict()`, `model.fit()`,
      # `model.evaluate()` etc. here.
  
  # Return successful response
  return Response(status=200)