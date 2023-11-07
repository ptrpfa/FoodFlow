## Food Safety Global Model
### Directory Structure
---
```
dataset/ (contains images used for model training and testing)

docs/ (documentation images)

models/ (contains exported Tensorflow models)

output/ (contains output of model training and testing)

package.json (Node Modules required for this project)

package-lock.json (Dependencies of each node module)

server.js (Main program used for training and testing the global model over the entire dataset)

subset.js (Supplementary program used for training and testing models over a subset of the dataset)
```

### Program Usage
---
| Note: Tensorflow and TensorflowJS are best suited to run on Windows or Linux based devices. It is unable to run properly on Silicon-based Mac devices. Running the program on a **Linux-based server** with `Python` and `NodeJS` installed is preferred.

1. Install all necessary programs and libraries (`Python` and `NodeJS`)
    ```
    # Debian-based Linux Installation (perform your own form of installations if installing on another type of device)
    sudo apt update
    sudo apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev git
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt-get install nodejs npm -y
    ```
2. Install the necessary project dependencies
    ```
    # NodeJS
    npm install canvas
    npm install @tensorflow/tfjs-node

    OR

    # Ensure you are within this directory with package.json
    npm install
    ```

3. The global model has already been pre-trained ahead of time and you should normally not need to re-train it again. However, if you choose to re-train the global model, run the following command:
    ```
    node server.js
    ```

    To train smaller models on specific subsets of the data, run the following command, ensuring that the `MODEL_PATH`, `train_folder` and `test_folder` variables within `subset.js` are pointing to the correct target dataset:
    ```
    node subset.js
    ```

    Both `server.js` and `subset.js` can also be used just to test the performance of models. To do so, ensure that `await train_ml();` is commented out and run each program accordingly.
    
### Dataset
---
This model is trained on the [Fresh-and-Stale Classification](https://www.kaggle.com/datasets/swoyam2609/fresh-and-stale-classification) dataset provided on Kaggle. The dataset consists of nine subsets of fruits and vegetables, each classified as `Fresh` or `Rotten`.

These data subsets include:
- Fruits
    - Apples
    - Bananas
    - Oranges
- Vegetables
    - Bitter Gourd
    - Capsicum
    - Cucumber
    - Okra
    - Potato
    - Tomato

Dataset consists of random yet realistic transformations on food images, such as rotation and horizontal flipping, which will help to expose the model to different aspects of training data and reduce overfitting (data augmentation).

This existing dataset is further preprocessed to remove duplicate images and split into a 80-20 train-test split for subsequent model training and testing.

### Model Overview
---
The global model is built on top of Google's [mobilenet](https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1) through transfer learning for the binary classification of food into `Fresh` (safe for consumption) or `Rotten` (unsafe for consumption). The global model is trained on the entire dataset of nine subsets of food items.

Transfer learning is used to optimise the `mobilenet` neural network for classification of food safety (whether it is rotten or fresh) through the attachment and training of a new classification head. Instead of building a model from scratch, transfer learning is used to build on top of the `mobilenet_v3_small` model which provides feature vectors of a neural network trained on the ImageNet dataset consisting of 1.4 million images and 1000 classes (ILSVRC-2012-CLS) and capable of recognising over 1000 image object types, allowing for faster training and better model performance.

### Model Performance
---
The global model is able to correctly classify each subset of food item into the binary classes of `Fresh` and `Rotten` with the following metrics: <br>
**Accuracy**: 97.12% <br>
**Miss**: 2.88% <br>
**Precision**: 0.97 <br>
**Recall**: 0.97 <br>
**Specificity**: 0.97 <br>
**F1 Score**: 0.97

![Confusion Matrix](docs/global_model.png)

To view detailed specifics on the global model's performance on each subset of data, refer to the `output/global` folder.