# pip install -U flask flask-cors tensorflow tensorflowjs tensorflow-federated
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from flask import Flask, Response, request, render_template
from utils import *
import werkzeug.formparser

app = Flask(__name__)

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/transfer_learning")
def transfer_learning():
  return render_template("transfer_learning.html")

@app.route('/upload_model', methods=['POST'])
def upload():
  # Receive and parse model
  model_receiver = ModelReceiver()
  werkzeug.formparser.parse_form_data(request.environ, stream_factory=model_receiver.stream_factory)

  with tf.Graph().as_default(), tf.compat.v1.Session():
      model = model_receiver.model
      model.summary()
      print("Total weights:", len(model.weights))
      for weight in model.weights:
          print(weight, type(weight))
          print(vars(weight))
      # You can perform `model.predict()`, `model.fit()`,
      # `model.evaluate()` etc. here.
  
  # Return successful response
  return Response(status=200)