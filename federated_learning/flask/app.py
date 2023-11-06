from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask, Response, request, render_template, send_from_directory
from flask_cors import CORS 
import werkzeug.formparser
from utils import *

""" Program Entrypoint """
# Initialise Flask app
app = Flask(__name__)
CORS(app)

# Global variables
model_receiver = ModelReceiver()                            # ModelReceiver object used to receive client-trained models
global_model = load_model(FILE_GLOBAL_MODEL)                # Global model
hash_global_model = get_model_hash(FOLDER_GLOBAL_MODEL)     # Hash of global model
list_client_models = load_client_models_file()              # List of accepted client-trained models received

# Print global model info
print("\n\n~~Global Model~~")
global_model.summary()
print("Hash:", hash_global_model)
print("Potential Clients:", list_client_models)

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

# Route to accept uploaded new client-trained model
@app.route('/upload_model', methods=['POST'])
def receive_client_model():
  # Modify global variable
  global model_receiver

  # Receive and parse model
  model_receiver = ModelReceiver()
  werkzeug.formparser.parse_form_data(request.environ, stream_factory=model_receiver.stream_factory)

  # Create environment for model
  with tf.Graph().as_default(), tf.compat.v1.Session():
    # Save client model and obtain dictionary of loaded client model
    dict_client_model = model_receiver.save_model()

    # Check if a new client model has been received
    if(check_new_model(dict_client_model, list_client_models, hash_global_model)):
      # Create a copy of the client model dictionary
      copy = dict_client_model.copy()
      # Exclude Keras model object
      del copy['model']
      # Add new client model into the list of accepted clients
      list_client_models.append(copy)
      # Update client models file
      update_client_models_file(list_client_models)

      # Print received client model info
      print("\n\n~~New Client Model~~")
      dict_client_model['model'].summary() 
      print("Path:", dict_client_model['file_path'])
      print("Training size:", dict_client_model['training_size'])
      print("Hash:", dict_client_model['hash'])

      # Check if minimum number of client models has been reached to initiate federated leaerning (do some lock here too)
      print("\nPotential Clients:", list_client_models)

      # You can perform `model.predict()`, `model.fit()`,
      # `model.evaluate()` etc. here.

    else:
      print("\nModel received not added to list of clients for federated learning!")
  
  # Return successful response
  return Response(status=200)