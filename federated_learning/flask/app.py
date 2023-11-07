from flask import Flask, Response, request, render_template, send_from_directory
from flask_cors import CORS 
import werkzeug.formparser
import threading
from utils import *

""" Program Entrypoint """
# Initialise Flask app
app = Flask(__name__)
CORS(app)

# Global variables (SHARED RESOURCES)
hash_global_model = get_model_hash(FOLDER_GLOBAL_MODEL)     # Hash of global model
list_client_models = load_client_models_file()              # List of accepted client-trained models received
lock_list_client_models = threading.Lock()                  # Mutex lock for list of accepted client-trained models received

""" Routes """
# Function to that is executed before each request is processed
@app.before_request
def start_federated():
  print("\n-- Federated Learning Server --")
  print(f"Active Threads: {threading.active_count()}")
  print("Hash of Global Model:", hash_global_model)
  print("Potential Clients:", list_client_models, end="\n\n")

  # Check if minimum number of client models has been reached to initiate federated learning (do some lock here too)
  pass

# Route for client-facing page
@app.route("/")
def index():
  return render_template("index.html")

# Route to fetch pre-trained model's JSON file and weights
@app.route('/get_model/<path:path>')
def load_files(path):
  # TF.js will request for model.json and weights.bin by default
  return send_from_directory('models', path)

# Route to accept uploaded new client-trained model
@app.route('/upload_model', methods=['POST'])
def receive_client_model():
  # Create an instance of the model receiver class
  model_receiver = ModelReceiver()
  # Receive and parse model
  werkzeug.formparser.parse_form_data(request.environ, stream_factory=model_receiver.stream_factory)
  # Save client model and obtain dictionary of loaded client model details
  dict_client_model = model_receiver.save_model()

  # Check if a new client model has been received
  if(check_new_model(dict_client_model, list_client_models, hash_global_model)):
    # Obtain mutex lock to modify the shared list of accepted clients
    with lock_list_client_models:
      # Add new client model into the list of accepted clients
      list_client_models.append(dict_client_model)
      # Update client models file
      update_client_models_file(list_client_models)
    # Print received client model info
    print("\n~~New Client Model~~")
    print(dict_client_model)
    print("Path:", dict_client_model['file_path'])
    print("Training size:", dict_client_model['training_size'])
    print("Hash:", dict_client_model['hash'])
    # Manually invoke function to start federated learning
    start_federated()
  else:
    print("\nModel received not added to list of clients for federated learning!")
  
  # Return successful response
  return Response(status=200)