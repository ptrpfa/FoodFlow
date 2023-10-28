/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "upload";

export interface Image {
  imageData: Uint8Array;
}

export interface ImageRequest {
  imageId: string;
}

export interface MultipleImageRequest {
  imageIds: ImageRequest[];
}

export interface UploadResponse {
  status: number;
  valid: boolean;
  imageId: string;
}

export interface Response {
  status: number;
}

export const UPLOAD_PACKAGE_NAME = "upload";

export interface UploadServiceClient {
  uploadImage(request: Image): Observable<UploadResponse>;

  getImage(request: ImageRequest): Observable<Image>;

  getMultipleImages(request: MultipleImageRequest): Observable<Image>;

  deleteImage(request: ImageRequest): Observable<Response>;
}

export interface UploadServiceController {
  uploadImage(request: Image): Promise<UploadResponse> | Observable<UploadResponse> | UploadResponse;

  getImage(request: ImageRequest): Promise<Image> | Observable<Image> | Image;

  getMultipleImages(request: MultipleImageRequest): Observable<Image>;

  deleteImage(request: ImageRequest): Promise<Response> | Observable<Response> | Response;
}

export function UploadServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["uploadImage", "getImage", "getMultipleImages", "deleteImage"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UploadService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UploadService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const UPLOAD_SERVICE_NAME = "UploadService";
