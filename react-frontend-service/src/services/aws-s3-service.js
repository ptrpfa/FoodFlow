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

  getImage = async (payload) => {
    let message = new ImageRequest();
    message.setImageid(payload.imageId);

    return new Promise((resolve, reject) => {
      // gRPC
      image_client.getImage(message, null, (err, response) => {
        resolve({
          imageData: response.getImagedata(),
        });
      });
    });
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
