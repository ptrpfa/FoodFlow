import { UploadServiceClient } from "./grpc/aws-s3/upload_grpc_web_pb";
import {
  Image,
  ImageRequest,
  MultipleImageRequest,
} from "./grpc/aws-s3/upload_pb";

const image_client = new UploadServiceClient(
  "http://localhost:9900/grpc-s3",
  null,
  null
);

class UploadService {
  uploadImage = async (payload) => {
    let message = new Image();
    message.setImagedata(payload.imageData);

    return new Promise((resolve, reject) => {
      // gRPC
      image_client.uploadImage(message, null, (err, response) => {
        resolve({
          status: response.getStatus(),
          valid: response.getValid(),
          imageId: response.getImageid(),
        });
      });
    });
  };

  getImage = async (payload, maxRetries = 3) => {
    let message = new ImageRequest();
    message.setImageid(payload.imageId);
  
    const requestImage = () => {
      return new Promise((resolve, reject) => {
        image_client.getImage(message, null, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              imageData: response.getImagedata(),
            });
          }
        });
      });
    };
  
    let retryCount = 0;
  
    const tryRequest = async () => {
      try {
        return await requestImage();
      } catch (error) {
        retryCount++;
        if (retryCount < maxRetries) {
          console.error(`Retrying request (attempt ${retryCount})`);
          return tryRequest();
        } else {
          throw error; // Max retries exceeded, propagate the error.
        }
      }
    };
  
    return tryRequest();
  };

  getMultipleImages = async (payload) => {
    let message = new MultipleImageRequest();

    payload.forEach((imageId) => {
      const image_req = new ImageRequest();
      image_req.setImageId(imageId);
      message.addImageIds(image_req);
    });

    return new Promise((resolve, reject) => {
      // gRPC
      const stream = image_client.getMultipleImages(message);

      const images = []; // Array to store received images

      stream.on("data", (image) => {
        // Process each image received
        images.push(image);
      });

      stream.on("end", () => {
        // All images have been received; resolve the promise with the images
        resolve(images);
      });

      stream.on("error", (err) => {
        // Handle errors and reject the promise
        reject(err);
      });
    });
  };

  deleteImage = async (payload) => {
    let message = new ImageRequest();
    message.setImageId(payload.imageId);

    return new Promise((resolve, reject) => {
      // gRPC
      image_client.deleteImage(message, null, (err, response) => {
        resolve({
          status: response.getStatus(),
        });
      });
    });
  };
}

export default new UploadService();
