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

# Configurations
file_global_model = "models/model.h5"

# Global variables
model_receiver = ModelReceiver()
global_model = tf.keras.saving.load_model(file_global_model)

""" Routes """
# Route for client-facing page
@app.route("/")
def index():
  return render_template("index.html")

# Route to fetch pre-trained model's JSON file and weights
@app.route('/get_model/<path:path>')
def load_shards(path):
  # TF.js will request for model.json and weights.bin by default
  return send_from_directory('models', path)

# Route to upload new client-trained model
@app.route('/upload_model', methods=['POST'])
def upload():
  # Modify global variable
  global model_receiver

  # Receive and parse model
  model_receiver = ModelReceiver()
  werkzeug.formparser.parse_form_data(request.environ, stream_factory=model_receiver.stream_factory)

  # Create environment for model
  with tf.Graph().as_default(), tf.compat.v1.Session():
    # Save model weights and JSON file and get current model sent by client
    client_model = model_receiver.save_model()

    # Obtain model
    print("\n\nClient Model:")
    client_model.summary()

    
    # You can perform `model.predict()`, `model.fit()`,
    # `model.evaluate()` etc. here.
  
  # Return successful response
  return Response(status=200)