import { Controller } from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  UploadServiceController,
  Image,
  UploadResponse,
  UploadServiceControllerMethods,
  ImageRequest,
  MultipleImageRequest,
  Response,
} from 'proto/upload';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Controller('upload')
@UploadServiceControllerMethods()
export class UploadController implements UploadServiceController {
  constructor(private readonly uploadService: UploadService) {}

  // Upload image (Create)
  // Severless function returning food validation will be returned
  async uploadImage(Image: Image): Promise<UploadResponse> {
    const imageUUID = await this.uploadService.uploadImage(Image.imageData);
    return await this.uploadService.readQueue(imageUUID);
  }

  // Get image (Read)
  async getImage(imageRequest: ImageRequest): Promise<Image> {
    return await this.uploadService.getImage(imageRequest.imageId);
  }

  // Get images (Read)
  getMultipleImages(
    multipleImageRequest: MultipleImageRequest,
  ): Observable<Image> {
    const imageIds = multipleImageRequest.imageIds.map((req) => req.imageId);
    return from(this.streamImages(imageIds));
  }

  async *streamImages(imageIds: string[]) {
    for await (const buffer of this.uploadService.getMultipleImages(imageIds)) {
      yield { imageData: buffer };
    }
  }

  // Delete images (Delete)
  async deleteImage(imageRequest: ImageRequest): Promise<Response> {
    return await this.uploadService.deleteImage(imageRequest.imageId);
  }
}
