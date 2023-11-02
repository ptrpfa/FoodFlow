import matplotlib.pyplot as plt
import numpy as np
import math
import os
import tensorflow as tf

# Constants
BASE_PATH = "dataset/fruits/fruits/apples"
TEST_PATH = f"{BASE_PATH}/test"
TRAIN_PATH = f"{BASE_PATH}/train"

SIZE = 100
FRESH_SIZE = math.ceil(SIZE * 0.8)
ROTTEN_SIZE = SIZE - FRESH_SIZE

IMAGE_WIDTH = 224
IMAGE_HEIGHT = 224
MODEL_URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1'
CLASS_NAMES = ['Fresh', 'Rotten']

# Global variables
mobilenet = None
model = None

# Load and preprocess training data
training_data_files = []
training_output = []
training_data = []
test_data_files = []

for i in os.listdir(f"{TRAIN_PATH}/fresh")[:FRESH_SIZE]:
    training_data_files.append(f"{TRAIN_PATH}/fresh/{i}")
    training_output.append(0)

for i in os.listdir(f"{TRAIN_PATH}/rotten")[:ROTTEN_SIZE]:
    training_data_files.append(f"{TRAIN_PATH}/rotten/{i}")
    training_output.append(1)

# Define functions for preprocessing images
def load_and_preprocess_image(file_path):
    img = tf.io.read_file(file_path)
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.resize(img, [IMAGE_HEIGHT, IMAGE_WIDTH])
    img = tf.image.convert_image_dtype(img, tf.float32)
    return img



for file_path in training_data_files:
    img = load_and_preprocess_image(file_path)
    training_data.append(img)
    # You need to assign the correct label (0 for 'Fresh' and 1 for 'Rotten') based on your data.
    label = 0 if 'fresh' in file_path else 1
    training_output.append(label)

training_data = tf.stack(training_data)
training_output = np.array(training_output)

# Load the MobileNet model
mobilenet = tf.keras.applications.MobileNetV2(input_shape=(IMAGE_HEIGHT, IMAGE_WIDTH, 3), include_top=False, weights='imagenet')

# Create a custom classification head
model = tf.keras.Sequential([
    mobilenet,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(CLASS_NAMES), activation='softmax')
])

# Compile the model
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
model.fit(training_data, training_output, epochs=10, batch_size=5)

# Load and preprocess test data
for file_path in test_data_files:
    img = load_and_preprocess_image(file_path)
    img = tf.expand_dims(img, axis=0)  # Add a batch dimension
    prediction = model.predict(img)
    class_index = np.argmax(prediction)
    confidence = prediction[0][class_index]
    prediction_text = f'Prediction: {CLASS_NAMES[class_index]} with {confidence * 100:.2f}% confidence'
    print(prediction_text)
