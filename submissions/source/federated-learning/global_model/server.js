/* 
    Program used to train an overall global model using the entire dataset.
*/

// Imports
const fs = require('fs').promises;
const sfs = require('fs');
const path = require('path');
const { createCanvas, Image } = require('canvas');
const tf = require('@tensorflow/tfjs-node');

// Global variables
let mobilenet = undefined;
let model = undefined;

// Constants
const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;
const MODEL_URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
const CLASS_NAMES = ['Fresh', 'Rotten'];
const MODEL_PATH = 'file://./models/global';

// Training files
var train_folder = undefined;        
var training_data_files = [];
var training_data = [];   // Array to store image features of training data
var training_output = []; // Array to store binary classification of training data

// Test files
var test_folder = undefined;        
var test_data_files = [];   
var test_output = [];     // Array to store binary classification of test data

// Metrics
var confusion_matrix = [[0,0],[0,0]]; // 0:0 Fresh:True, 0:1 Fresh:False, 1:0 Rotten:False, 1:1 Rotten:True

// Function to prepare global dataset
async function prepare_global_files(current_folder) {
    var files = sfs.readdirSync(current_folder);
    for (const file of files) {
        // Prepare file paths
        var folder = path.join(current_folder, file);
        var train_folder = path.join(folder, "train");
        var test_folder = path.join(folder, "test");
        console.log(`Preparing training and testing files for /${folder} folder..`);

        // Preload training and testing arrays
        await prepare_files(train_folder, training_data_files, training_output);
        await prepare_files(test_folder, test_data_files, test_output);

        // Debugging
        console.log(`/${folder} files prepared!\n`);
        console.log(`Size of training dataset: ${training_data_files.length}`);
        console.log(`Size of test dataset: ${test_data_files.length}\n`);
    }
}

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
    }).catch((err) => { console.error('Promise rejection:', err); });
}

// Function to prepare pre-trained mobilenet model
async function prepare_mobilenet() {
    // Load pre-trained mobilenet model (image feature vectors) from TensorFlowHub
    mobilenet = await tf.loadGraphModel(MODEL_URL, { fromTFHub: true });
    
    // NOTE: Tidy function is used for automatic memory clean ups (clean up all intermediate tensors afterwards to avoid memory leaks)
    // dispose() to release the WebGL memory allocated for the return value of predict
    tf.tidy(function() { 
        // Warm up the model by passing zeros through it once, to make first prediction faster
        mobilenet.predict(tf.zeros([1, IMAGE_HEIGHT, IMAGE_WIDTH, 3])).dispose();   // Tensor of 1 x 224px x 224px x 3 colour channels (RGB)
    });
}

// Function to train model (classification head)
async function train_ml() {
    // Prepare training data
    console.log("\n\nPreparing training data image features..\n");
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
    console.log("Training data image features loaded!\n");

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
    console.log("\nTraining model..\n");
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
    console.log("\nModel trained!");

    // Save model
    await model.save(MODEL_PATH);
    console.log("\nModel saved!");

}

// Function to load pre-saved model and test it (classification head)
async function test_model() {
    // Load model
    model = await tf.loadLayersModel(MODEL_PATH + '/model.json');

    /* Model Testing */
    console.log("\nTesting model..\n");
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

            // Update confusion matrix
            confusion_matrix[test_output[i]][highestIndex]++;

            // Check for mismatch
            if(highestIndex != test_output[i]) {
                // Get prediction results
                let prediction_txt = 'False Prediction: ' + CLASS_NAMES[highestIndex] + ' with ' + predictionArray[highestIndex] * 100 + '% confidence' + ' (Actual: ' + CLASS_NAMES[test_output[i]] + ')'
                prediction_txt += '\nFile: ' + test_data_files[i] + '\n';

                // Update results
                console.log(prediction_txt);
            }
        });
    }

    /* Model Metrics */
    const truePositive = confusion_matrix[0][0];
    const falsePositive = confusion_matrix[0][1];
    const trueNegative = confusion_matrix[1][1];
    const falseNegative = confusion_matrix[1][0];

    // Calculate percentages
    const true_fresh = ((truePositive / test_data_files.length) * 100);
    const false_fresh = ((falsePositive / test_data_files.length) * 100);
    const true_rotten = ((trueNegative / test_data_files.length) * 100);
    const false_rotten = ((falseNegative / test_data_files.length) * 100);
    const accuracy = (parseFloat(true_fresh) + parseFloat(true_rotten));
    const miss = (parseFloat(false_fresh) + parseFloat(false_rotten));
    
    // Precision: Ratio of true positives to the sum of true positives and false positives. It measures the model's ability to correctly classify positive instances and minimize false positives. It is essential when minimizing false positives is critical.
    const precision = (truePositive / (truePositive + falsePositive));
    // Recall (Sensitivity or True Positive Rate): Ratio of true positives to the sum of true positives and false negatives. It measures the model's ability to correctly identify positive instances, minimizing false negatives. Recall is crucial when missing positive instances is undesirable.
    const recall = (truePositive / (truePositive + falseNegative));
    // Specificity: Ratio of true negatives to the sum of true negatives and false positives. It measures the model's ability to correctly classify negative instances.
    const specificity = (trueNegative / (trueNegative + falsePositive));
    // F1 Score: Harmonic mean of precision and recall. It provides a balance between precision and recall. F1 Score is useful when you want to strike a balance between false positives and false negatives.
    const f1Score = (2 * (precision * recall) / (precision + recall));

    // Print results
    console.log("\n~Model Performance~");
    console.log("Confusion Matrix:");
    console.log(`True Fresh: ${truePositive} (${true_fresh.toFixed(2)}%)`);
    console.log(`False Fresh: ${falsePositive} (${false_fresh.toFixed(2)}%)`);
    console.log(`True Rotten: ${trueNegative} (${true_rotten.toFixed(2)}%)`);
    console.log(`False Rotten: ${falseNegative} (${false_rotten.toFixed(2)}%)`);
    console.log(`\nTest Size: ${test_data_files.length}`);
    console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Miss: ${miss.toFixed(2)}%\n`);
    console.log(`Precision: ${precision.toFixed(2)}`);
    console.log(`Recall: ${recall.toFixed(2)}`);
    console.log(`Specificity: ${specificity.toFixed(2)}`);
    console.log(`F1 Score: ${f1Score.toFixed(2)}`);
}

// Program entrypoint
async function main() {
    // Preload training and testing arrays
    await prepare_global_files("dataset/fruits");
    await prepare_global_files("dataset/vegetables");

    // Prepare mobilenet pre-trained model
    await prepare_mobilenet();

    // Function to train model (classification head)
    await train_ml();

    // Function to load and test model (classification head)
    test_model();
}

// Call main function
main();