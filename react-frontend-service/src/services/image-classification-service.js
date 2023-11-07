import * as tf from '@tensorflow/tfjs';

// Constants
const MODEL_URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
const SERVER_URL = 'http://35.194.95.239:80';
const CLASS_NAMES = ['Fresh', 'Rotten'];

let model = undefined;      // Classification head of model (built on top of base model
let mobilenet = undefined;  // Mobilenet model (base model)
var training_size = 0;      // Training size (no of images/tensors client model is trained on)

class ImageClassifierService {

    async isModelURLAvailable(url) {
        try {
            const response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
     prepare_ml = async () => {
        if (!model && !mobilenet) {
            console.log("Preparing model")
            if (await this.isModelURLAvailable(MODEL_URL)) {
                // Load pre-trained mobilenet model (image feature vectors) from TensorFlowHub
                mobilenet = await tf.loadGraphModel(MODEL_URL, { fromTFHub: true });
            
                // NOTE: Tidy function is used for automatic memory clean ups (clean up all intermediate tensors afterwards to avoid memory leaks)
                // dispose() to release the WebGL memory allocated for the return value of predict
                tf.tidy(() => {
                    // Warm up the model by passing zeros through it once, to make first prediction faster
                    mobilenet.predict(tf.zeros([1, 224, 224, 3])).dispose();   // Tensor of 1 x 224px x 224px x 3 colour channels (RGB)
                });
            
                // Load model (classification head) from Flask endpoint
                model = await tf.loadLayersModel(`${SERVER_URL}/get_model/model.json`);
            
                // Compile model
                model.compile({
                    // Adam changes the learning rate over time which is useful.
                    optimizer: 'adam',
                    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
                    // Else categoricalCrossentropy is used if more than 2 classes.
                    loss: (CLASS_NAMES.length === 2) ? 'binaryCrossentropy' : 'categoricalCrossentropy',
                    // As this is a classification problem you can record accuracy in the logs too!
                    metrics: ['accuracy']
                });
            }else{
                console.log("Nodel Url not available...");
            }
        } else {
            console.log("Model is already loaded")
        }
        return;
    }

    readImage = (file) => {
        return new Promise((resolve, reject) => {
            // Create a new HTMLImageElement
            const img = new Image();
            img.crossOrigin = 'anonymous'; 
            img.onload = () => resolve(img);    // Resolve the Promise with the loaded image
            img.onerror = reject;               // Reject the Promise if there's an error loading the image
        
            // Use FileReader to read the image file
            const reader = new FileReader();
            reader.onload = (e) => {
            img.src = e.target.result;          // Set the image source to the result of FileReader
            };
            reader.onerror = reject;            // Reject the Promise if there's an error reading the file
            reader.readAsDataURL(file);         // Read the file as a data URL
        });
    };

    classify_image = async(imageFile, userPrediction) => {
        console.log("Classifying image...");

        // Convert file to image data
        let imageData = await this.readImage(imageFile);
        let highestIndex = -1;
        // Classify image
        tf.tidy(function () {
            // Create tensor from image
            let test_tensor = tf.browser.fromPixels(imageData);

            // Resize tensor (value of data is between 0-255) and ensure all values are between 0 and 1 (for inputs into mobilenet model)
            test_tensor = tf.image.resizeBilinear(test_tensor, [224, 224], true).div(255);

            // Get mobilenet's intermediate predicted outcome for the expanded rank tensor
            let test_image_features = mobilenet.predict(test_tensor.expandDims());

            // Get classification head's predicted outcome, and remove dimensions of 1 afterwards
            let prediction = model.predict(test_image_features).squeeze();

            // Find index with highest value and convert tensor into an array
            highestIndex = prediction.argMax().arraySync();

            // Update classification made by model
            model_classification = highestIndex;

            // Get prediction scores as an array
            let predictionArray = prediction.arraySync();

            // Get prediction results
            let prediction_txt = (userPrediction == highestIndex) ? "Correct " : "Wrong ";
            prediction_txt += 'Prediction: ' + CLASS_NAMES[highestIndex] + ' with ' + predictionArray[highestIndex] * 100 + '% confidence'
            console.log(prediction_txt);
        });
        console.log("Image classified!");
        return highestIndex;
    }

    train_model = async(imageFile, userPrediction) => {
        // Initialise variables
        let training_data = [];     // Store image features of training images
        let training_output = [];   // Store classification output of training images

        // Convert file to image data
        let imageData = await this.readImage(imageFile);
        // Augment training tensor for more diversity in training data (instead of just one basic tensor from the image)
        for(let degree = 0; degree < 360; degree+=15) {
            // Obtain image features
            let image_features = tf.tidy(function () {
                // Create tensor from image
                let test_tensor = tf.browser.fromPixels(imageData);

                // Augment tensor by rotating it every 15 degrees
                test_tensor = tf.image.rotateWithOffset(test_tensor.toFloat().expandDims(), degree * (Math.PI / 180)).squeeze();

                // Resize tensor (value of data is between 0-255) and ensure all values are between 0 and 1 (for inputs into mobilenet model)
                test_tensor = tf.image.resizeBilinear(test_tensor, [224, 224], true).div(255);

                // Get mobilenet's predicted outcome for the expanded rank tensor, and remove dimensions of 1 afterwards
                return mobilenet.predict(test_tensor.expandDims()).squeeze();
            });
            // Append image feature into array of training data
            training_data.push(image_features);
            training_output.push(userPrediction);
            training_size++;
        }
        
        /* Model Training */
        // Shuffle training data
        tf.util.shuffleCombo(training_data, training_output);
        // Convert tensor array into a 1D tensor array
        let output_tensor = tf.tensor1d(training_output, 'int32');
        // Convert into a one-hot tensor array
        let onehot_output = tf.oneHot(output_tensor, CLASS_NAMES.length);
        // Convert array of tensors into a 2D tensor
        let input_tensor = tf.stack(training_data);

        // Train classification head
        console.log("Training model locally on client device..")
        await model.fit(input_tensor, onehot_output, { shuffle: true, batchSize: 5, epochs: 10, callbacks: { onEpochEnd: (epoch, log) => console.log(epoch, log) } });

        // Dispose temporary tensors to release the WebGL memory allocated
        output_tensor.dispose();
        onehot_output.dispose();
        input_tensor.dispose();
    }

    // Function for uploading client model to the server for federated learning
    upload_model = async() => {
        model.setUserDefinedMetadata({"training_size": training_size});
        const saveResult = await model.save(`${SERVER_URL}/upload_model`);
        alert("Model uploaded for federated learning!");
    }

    dispose_models = () => {
        model = undefined;
        mobilenet = undefined;
    }
}

export default new ImageClassifierService();