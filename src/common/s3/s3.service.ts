import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { FileUploadOptions } from "./file-upload-options.interface";

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  constructor(private readonly configService: ConfigService) {
    const accessKey = this.configService.get("AWS_ACCESS_KEY");
    const secretAccessKey = this.configService.get("AWS_SECRET_ACCESS_KEY");
    const clientConfig: S3ClientConfig = {
      region: this.configService.get("AWS_REGION"),
    };

    if (accessKey || secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
      };
    }

    this.client = new S3Client(clientConfig);
  }

  async upload({ bucket, key, file }: FileUploadOptions) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
      })
    );
  }

  getObjectUrl(bucket: string, key: string) {
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }
}
