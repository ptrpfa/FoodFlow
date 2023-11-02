// Imports
const fs = require('fs').promises;
const path = require('path');
const { createCanvas, Image } = require('canvas');
const tf = require('@tensorflow/tfjs');

// Global variables
let mobilenet = undefined;
let model = undefined;

// Constants
const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;
const MODEL_URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
const CLASS_NAMES = ['Fresh', 'Rotten'];

// Training files
var train_folder = path.join(__dirname, '../dataset/fruits/apples/train');        
var training_data_files = [];
var training_data = [];   // Array to store image features of training data
var training_output = []; // Array to store binary classification of training data


// Test files
var test_folder = path.join(__dirname, '../dataset/fruits/apples/test');        
var test_data_files = [];   
var test_output = [];     // Array to store binary classification of test data

// Function to preload training and test arrays
async function prepare_files(folder_name, data_files, output) {
    const fresh_folder = path.join(folder_name, "fresh");
    const rotten_folder = path.join(folder_name, "rotten");
    try {
        // Read fresh images
        const freshFiles = await fs.readdir(fresh_folder);
        freshFiles.forEach((file) => {
            data_files.push(path.join(fresh_folder, file));
            output.push(0); // 0 for fresh
        });

        // Read rotten images
        const rottenFiles = await fs.readdir(rotten_folder);
        rottenFiles.forEach((file) => {
            data_files.push(path.join(rotten_folder, file));
            output.push(1); // 1 for rotten
        });
    } catch (err) {
        console.error('Error reading folders:', err);
    }
}

// Function to load an image
async function loadImageAsync(filePath, canvas, ctx) {
    const imageBuffer = await fs.readFile(filePath);
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        };

        img.onerror = (err) => {
            reject(err);
        };

        img.src = imageBuffer;
    });
}

// Async function to initiate in-browser machine learning
async function start_ml() {
    // NOTE: Tidy function is used for automatic memory clean ups (clean up all intermediate tensors afterwards to avoid memory leaks)
    // dispose() to release the WebGL memory allocated for the return value of predict

    // Load pre-trained mobilenet model (image feature vectors) from TensorFlowHub
    mobilenet = await tf.loadGraphModel(MODEL_URL, { fromTFHub: true });

    tf.tidy(function() { 
        // Warm up the model by passing zeros through it once, to make first prediction faster
        mobilenet.predict(tf.zeros([1, IMAGE_HEIGHT, IMAGE_WIDTH, 3])).dispose();   // Tensor of 1 x 224px x 224px x 3 colour channels (RGB)
    });

    // Prepare training data
    console.log("Preparing training data image features..");
    for(let i = 0; i < training_data_files.length; i++) {
        // Create an HTML5 canvas and load the image data
        const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
        // Get rendering context
        const ctx = canvas.getContext('2d');
        // Ensure image is loaded before moving on
        await loadImageAsync(training_data_files[i], canvas, ctx);

        // Obtain image features
        let image_features = tf.tidy(function() {
            // Create tensor from image
            let test_tensor = tf.browser.fromPixels(canvas);

            // Resize tensor (value of data is between 0-255) and ensure all values are between 0 and 1 (for inputs into mobilenet model)
            test_tensor = tf.image.resizeBilinear(test_tensor, [IMAGE_HEIGHT, IMAGE_WIDTH], true).div(255);

            // Get mobilenet's predicted outcome for the expanded rank tensor, and remove dimensions of 1 afterwards
            return mobilenet.predict(test_tensor.expandDims()).squeeze();
        });
        // console.log("feature:", image_features);
        // Append image feature into array of training data
        training_data.push(image_features);
    }
    console.log("Training data image features loaded!");

    // Create new model classification head (multilayer perceptron)
    model = tf.sequential();
    // Add intermediate layer with 1024 input nodes (output from mobilenet model), 128 output nodes, ReLU activation function
    model.add(tf.layers.dense({ inputShape: [1024], units: 128, activation: 'relu' })); 
    // Add output layer, with number of neurons equal to number of classification classes, Softmax activation function (for classification problem)
    model.add(tf.layers.dense({ units: CLASS_NAMES.length, activation: 'softmax' }));   
    // Get summary of model in console
    model.summary();

    // Compile model
    model.compile({
        // Adam changes the learning rate over time which is useful.
        optimizer: 'adam',
        // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
        // Else categoricalCrossentropy is used if more than 2 classes.
        loss: (CLASS_NAMES.length === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy', 
        // As this is a classification problem you can record accuracy in the logs too!
        metrics: ['accuracy']  
    });
    
    /* Model Training */
    console.log("Training model..");
    // Shuffle training data
    tf.util.shuffleCombo(training_data, training_output);
    // Convert tensor array into a 1D tensor array
    let output_tensor = tf.tensor1d(training_output, 'int32');
    // Convert into a one-hot tensor array
    let onehot_output = tf.oneHot(output_tensor, CLASS_NAMES.length);
    // Convert array of tensors into a 2D tensor
    let input_tensor = tf.stack(training_data);
    
    // Train classification head
    await model.fit(input_tensor, onehot_output, {shuffle: true, batchSize: 5, epochs: 10, callbacks: { onEpochEnd: (epoch, log) => console.log(epoch, log)}});

    // Dispose temporary tensors to release the WebGL memory allocated
    output_tensor.dispose();
    onehot_output.dispose();
    input_tensor.dispose();
    console.log("Model trained!");
    
    /* Model Testing */
    console.log("Testing model..");
    for(let i = 0; i < test_data_files.length; i++) {

        // Create an HTML5 canvas and load the image data
        const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
        // Get rendering context
        const ctx = canvas.getContext('2d');
        // Ensure image is loaded before moving on
        await loadImageAsync(test_data_files[i], canvas, ctx);

        tf.tidy(function () {
            // Create tensor from image
            let test_tensor = tf.browser.fromPixels(canvas);

            // Resize tensor (value of data is between 0-255) and ensure all values are between 0 and 1 (for inputs into mobilenet model)
            test_tensor = tf.image.resizeBilinear(test_tensor, [IMAGE_HEIGHT, IMAGE_WIDTH], true).div(255);
            
            // Get mobilenet's interemediate predicted outcome for the expanded rank tensor
            let test_image_features = mobilenet.predict(test_tensor.expandDims());

            // Get classification head's predicted outcome, and remove dimensions of 1 afterwards
            let prediction = model.predict(test_image_features).squeeze();

            // Find index with highest value and convert tensor into an array
            let highestIndex = prediction.argMax().arraySync();

            // Get prediction scores as an array
            let predictionArray = prediction.arraySync();

            // Gwr prediction results
            let prediction_txt = 'Prediction: ' + CLASS_NAMES[highestIndex] + ' with ' + predictionArray[highestIndex] * 100 + '% confidence' + '(Actual: ' + CLASS_NAMES[test_output[i]] + ')'

            // Update results
            console.log(prediction_txt);
        });
    }

    // Save model
    await model.save('file://./foodflow');
    
    console.log("Model saved!");

}

// Program entrypoint
async function main() {
    // Preload training and testing arrays
    await prepare_files(train_folder, training_data_files, training_output);
    await prepare_files(test_folder, test_data_files, test_output);

    // Temporary
    training_data_files = training_data_files.slice(0, 7).concat(training_data_files.slice(-3));
    training_output = training_output.slice(0, 7).concat(training_output.slice(-3));
    test_data_files = test_data_files.slice(0, 7).concat(test_data_files.slice(-3));
    test_output = test_output.slice(0, 7).concat(test_output.slice(-3));

    // training_data_files = training_data_files.slice(0, 70).concat(training_data_files.slice(-30));
    // training_output = training_output.slice(0, 70).concat(training_output.slice(-30));
    // test_data_files = test_data_files.slice(0, 70).concat(test_data_files.slice(-30));
    // test_output = test_output.slice(0, 70).concat(test_output.slice(-30));

    // console.log(training_data_files);
    // console.log(training_output);
    // console.log(test_data_files);
    // console.log(test_output);

    // Invoke in-browser machine learning function
    start_ml();
    
}

// Call main function
main();