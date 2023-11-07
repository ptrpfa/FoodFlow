from flask import Flask, Response, request, render_template, send_from_directory
from flask_cors import CORS 
import werkzeug.formparser
import threading
from utils import *

# Initialise Flask app
app = Flask(__name__)
CORS(app)

""" Routes """
# Function to that is executed before each request is processed
@app.before_request
def start_federated():
  print("\n-- Federated Learning Server --")
  print(f"Active Threads: {threading.active_count()}")

  # Access global variables
  global no_client_models, overall_training_size

  # Check if minimum number of client models has been reached to initiate federated learning 
  if(no_client_models >= MIN_FEDERATED_SIZE):
    print("\nStarting Federated Learning!")
    
    # Obtain mutex lock to access the global model
    with lock_global_model:
      # Load a copy of the global model and its weights
      copy_global_model = load_model(FILE_GLOBAL_MODEL)
      copy_global_weights = np.array(copy_global_model.get_weights(), dtype='object')

    # Obtain mutex lock to access the shared list of accepted clients
    with lock_list_client_models:
      # Create a copy of the list of clients and overall training size
      copy_clients = list_client_models.copy()
      copy_training_size = overall_training_size # Integers are immutable
    
    print("\nPerforming Federated Averaging..")
    # Iterate through list of clients
    for current_client in copy_clients:
      print("\nTraining using Client:", current_client['file_path'])
      # Calculate scale factor for each client, depending on their training size contribution
      client_scale_factor = current_client['training_size'] / copy_training_size
      # Get current client model's weights and scale them with the calculated scale factor
      client_weights = np.array(load_model(f"{current_client['file_path']}/model.h5").get_weights(), dtype='object') * client_scale_factor
      # Update the global model copy's weights by adding the client model's weights to it
      copy_global_weights = np.add(copy_global_weights, client_weights)
    # Update the weights of the global model copy
    copy_global_model.set_weights(copy_global_weights)
    print("\nFederated Averaging completed!")

    print("\nUpdating the global model..")
    # Obtain mutex lock to modify the global model
    with lock_global_model:
      # Save the updated federated global model
      tfjs.converters.save_keras_model(copy_global_model, FOLDER_GLOBAL_MODEL)  # JSON and weights file
      copy_global_model.save(FILE_GLOBAL_MODEL)                                 # .h5 file
    print("\nGlobal model updated!")

    print("\nUpdating the list of accepted clients..")
    # Obtain mutex lock to modify the list of accepted clients
    with lock_list_client_models:
      # Loop through each client that was previously used to train the global model
      for current_client in copy_clients:
        # Update total training size
        overall_training_size -= current_client['training_size']
        # Remove the client from the shared list of accepted clients
        list_client_models.remove(current_client)
        # Update number of accepted clients
        no_client_models -= 1
      # Update the client models file
      update_client_models_file(list_client_models)
    print("\nUpdated list of accepted clients!")

    print("\nFederated Learning Completed!", end="\n\n")

# Route for client-facing page (TEMPORARY)
@app.route("/")
def index():
  return render_template("index.html")

# Route to fetch pre-trained model's JSON file and weights
@app.route('/get_model/<path:path>')
def load_files(path):
  # Obtain mutex lock to access global model
  with lock_global_model:
    # TF.js will request for model.json and the corresponding weights.bin file (as specified in the JSON file's weightsManifest key)
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

  # Check if a new client model has been received (consequence of concurrency mismanagement here is just the addition of a new client model for federated learning)
  if(check_new_model(dict_client_model, list_client_models, hash_global_model)):
    # Access global variables
    global no_client_models, overall_training_size
    # Obtain mutex lock to modify the shared list of accepted clients
    with lock_list_client_models:
      # Add new client model into the list of accepted clients
      list_client_models.append(dict_client_model)
      # Update total training size
      overall_training_size += dict_client_model['training_size']
      # Update number of accepted clients
      no_client_models += 1
      # Update client models file
      update_client_models_file(list_client_models)
    # Print received client model info
    print("\n~~ New Client Model ~~")
    print("Path:", dict_client_model['file_path'])
    print("Training size:", dict_client_model['training_size'])
    print("Hash:", dict_client_model['hash'])
    # Manually invoke function to start federated learning
    start_federated()
  else:
    print("\nModel received not added to list of clients for federated learning!")
  
  # Return successful response
  return Response(status=200)

# Driver code
if __name__ == '__main__':
  # Global variables (SHARED RESOURCES)
  hash_global_model = get_model_hash(FOLDER_GLOBAL_MODEL)                                     # Hash of global model
  no_client_models, list_client_models, overall_training_size = load_client_models_file()     # List of accepted client-trained models received
  lock_global_model = threading.Lock()                                                        # Mutex lock for access to the global model
  lock_list_client_models = threading.Lock()                                                  # Mutex lock for access to the list of accepted client-trained models received

  # Manually invoke function to start federated learning
  start_federated()

  # Start Flask app
  app.run(host=FLASK_HOST, port=FLASK_PORT, threaded=FLASK_THREADED, debug=FLASK_DEBUG)