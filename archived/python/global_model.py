import os
import tensorflow as tf

# Configurations
dataset_folder = "dataset/fruits/apples"
train_folder = f"{dataset_folder}/train"
test_folder = f"{dataset_folder}/test"
img_size = (224, 224)

# Load training and testing datasets
train_dataset = tf.keras.utils.image_dataset_from_directory(train_folder,labels="inferred", label_mode="int", image_size=img_size)
test_dataset = tf.keras.utils.image_dataset_from_directory(test_folder,labels="inferred", label_mode="int", image_size=img_size)

