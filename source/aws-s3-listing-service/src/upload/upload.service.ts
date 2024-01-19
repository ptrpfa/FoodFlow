import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import {
  ReceiveMessageCommand,
  SQSClient,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  private readonly sqsClient = new SQSClient({
    region: process.env.AWS_S3_REGION,
  });

  constructor() {}

  async uploadImage(image: Uint8Array) {
    const imageUUID = uuidv4();
    const bucket_name = process.env.AWS_S3_BUCKET;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket_name,
        Key: imageUUID + '.jpg',
        Body: image,
      }),
    );

    return imageUUID;
  }

  async readQueue(imageuuid: string) {
    let running = true;
    setTimeout(() => {
      running = false;
    }, 10000);

    while (running) {
      const response_queue = await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: process.env.QUEUE_URL,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 10,
        }),
      );

      if (response_queue) {
        for (const message of response_queue.Messages) {
          const body = JSON.parse(message.Body);
          if (body['responsePayload']['body']['key'] === imageuuid + '.jpg') {
            const valid = body['responsePayload']['body']['valid'];
            // Remove the message from the queue
            await this.sqsClient.send(
              new DeleteMessageCommand({
                QueueUrl: process.env.QUEUE_URL,
                ReceiptHandle: message.ReceiptHandle,
              }),
            );
            return { valid: valid, status: 0, imageId: imageuuid };
          }
        }
      }
    }
    return { valid: false, status: -1, imageId: imageuuid };
  }

  async *getMultipleImages(imageIds: string[]) {
    const bucket_name = process.env.AWS_S3_BUCKET;
    for (const key of imageIds) {
      const data = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: bucket_name,
          Key: key,
        }),
      );

      if (data.Body) {
        const imagedata = data.Body.transformToByteArray();
        yield imagedata;
      }
    }
  }

  async getImage(imageId: string) {
    const bucket_name = process.env.AWS_S3_BUCKET;
    const data = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: bucket_name,
        Key: imageId,
      }),
    );

    const imageData = await data.Body.transformToByteArray();
    return { imageData: imageData };
  }

  async deleteImage(imageId: string) {
    const bucket_name = process.env.AWS_S3_BUCKET;
    const data = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket_name,
        Key: imageId,
      }),
    );
    return { status: data.$metadata.httpStatusCode };
  }
}
