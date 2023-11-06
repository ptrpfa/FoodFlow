import tensorflow as tf
import tensorflowjs as tfjs
import io
import threading
import time
import os

# Load presaved model
file_global_model = "models/model.h5"
global_model = tf.keras.saving.load_model(file_global_model)
global_model.summary()