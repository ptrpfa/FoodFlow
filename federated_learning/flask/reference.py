import sys
import os
import threading
from time import sleep
from flask import Flask, request, jsonify, send_file
import requests
import numpy
import tensorflow
app = Flask(__name__)

# FILEPATH = os.path.abspath("Completed Code/Server")
FILEPATH = ""
IPADDRESS = str(sys.argv[1])
IP = "{}:".format(IPADDRESS)

# Global Variable for Model Aggregation
client_weights_filepath_list = []   # Contains Array of Client Weights filepath
global_dataset_size = 0             # Contains Sum of client dataset size

client_dataset_size_list = []       # Contains Array of client dataset size
client_port = []                    # Contains Array of client ports
lock = False                        # Lock the client at critical section
global_weight_lock = False          # global weight lock

"""
send_global_weights():
    Sends global model data when client sends GET request
"""
@app.route('/server/send_global_weights', methods=['GET'])
def send_global_weights():
    global global_weight_lock
    while global_weight_lock:
        sleep(2)
    else:         
        global_weight_lock = True
        if request.method == 'GET':  # Client has just initialzed and is requesting model data
            print("Sending Global Weights")
            filepath = FILEPATH + "/model_data/global_model.h5"
            try:
                return send_file(filepath)
            finally:
                global_weight_lock = False

"""
receive_client_weights():
    1. Receive clients weights when client send POST request
    2. Save client weights into a file
    3. Initialize Aggregation via threading 
"""
@app.route('/server/receive_client_weights', methods=['POST'])
def receive_client_weights():
    global global_dataset_size
    global client_dataset_size_list
    
    if request.method == 'POST': 
        # Save weights into a file
        global client_port 
        port = request.args.get("port_number")
        print(port)
        client_port.append(port)
        client_dataset_size = request.args.get("datasize")
        filename = FILEPATH + "/model_data/client_weight{}".format(port)
        with open(filename, "wb") as f:
            f.write(request.data)
        f.close()

        # Update variables for Aggregation
        client_dataset_size_list.append(int(client_dataset_size))
        global_dataset_size = global_dataset_size + int(client_dataset_size)
        client_weights_filepath_list.append(filename)

        # Initialize aggregation
        aggregation_thread = threading.Thread(target=aggregation)
        aggregation_thread.start()
        return jsonify("Client weights received")

"""
aggregation():
    1. aggregate client weights into update global weight
    2. sends client updated weights 
"""
def aggregation():
    global lock
    # Model initialization
    if not lock:
        lock = True
        model = tensorflow.keras.models.load_model(FILEPATH + "/model_data/global_model.h5")

        # Model Aggregation
        print("Aggregating client weights")
        weight_scaling_factor_list = weight_scaling_factor() # Find client dataset contribution scale of 0 to 1
        scaled_client_weights = scale_model_weight(weight_scaling_factor_list, model) # Scale client model weight by client dataset contribution scale
        sum_scaled_weights(scaled_client_weights, model) # Sum scaled client model weights
        
        print("Model Aggregated")
        # Send clients updated weights
        send_client_updated_weights()
        lock = False
    else:
        while lock:
            sleep(10)
        else:
            aggregation()

"""
weight_scaling_factor():
    Finds client dataset contribution by "Client dataset size / Global dataset size".
    - Global dataset size refers to the sum of client dataset

Returns:
    weight_scaling_factor_list: Array of client dataset contribution (AKA weight scaling factor) on a scale of 0 to 1
"""
def weight_scaling_factor():
    global global_dataset_size
    print(client_dataset_size_list)
    
    weight_scaling_factor_list = [
        client_datasize / global_dataset_size for client_datasize in client_dataset_size_list]
    print(weight_scaling_factor_list)
    return weight_scaling_factor_list

"""
scale_model_weight():
    scale the model weights by "model weight * weight scaling factor"

parameters:
    - weight_scaling_factor_list: Array of weight scaling factor
    - model: Tensorflow AI model

Returns:
    scaled_client_weights: Array of scaled client weights 
"""
def scale_model_weight(weight_scaling_factor_list, model):
    scaled_client_weights = []
    print(client_weights_filepath_list)
    for i, scaling_factor in enumerate(weight_scaling_factor_list):
        print(i)
        filepath = client_weights_filepath_list[int(i)]
        model.load_weights(filepath)
        client_weight = model.get_weights()
        client_weight = numpy.array(client_weight, dtype='object')
        scaled_client_weights.append(client_weight * scaling_factor)
    return scaled_client_weights

"""
sum_scaled_weights():
    1. Summation of scaled model weights by "sum(model weight)"
    2. Saved aggregated weights into a file

parameters:
    - scaled_client_weights: Array of scaled client weights 
    - model: Tensorflow AI model
"""
def sum_scaled_weights(scaled_client_weights, model):
    global_weight = scaled_client_weights[0]
    for client_weight in scaled_client_weights[1:]:
        global_weight = numpy.add(global_weight, client_weight)
    model.set_weights(global_weight)
    model.save_weights(
        FILEPATH + "/model_data/Updated_global_weights", save_format="h5")

"""
send_client_updated_weights()
    send client the updated global weights from the aggregation
"""
def send_client_updated_weights():
    print("Sending updated global weights")
    file = open(FILEPATH + "/model_data/Updated_global_weights", "rb")
    
    for port in client_port:
        port = IP + port.split(":",1)[1]
        try:
            res = requests.post( 
                'http://{}/client/receive_global_weights'.format(str(port)), file)
            print(res.text)
        except:
            print("Client {} is down".format(str(port)))


if __name__ == '__main__':
    app.run(port=5000, debug=False, host='0.0.0.0')