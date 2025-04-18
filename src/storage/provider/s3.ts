import { randomUUID } from 'node:crypto';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storageConfig } from '../config/storage-config';
import {
  ConfigurationError,
  type PresignedUploadUrlParams,
  type StorageConfig,
  StorageError,
  type StorageProvider,
  UploadError,
  type UploadFileParams,
  type UploadFileResult,
} from '../types';

/**
 * Amazon S3 storage provider implementation
 *
 * This provider works with Amazon S3 and compatible services like Cloudflare R2
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
 * https://www.npmjs.com/package/@aws-sdk/client-s3
 * https://developers.cloudflare.com/r2/
 */
export class S3Provider implements StorageProvider {
  private config: StorageConfig;
  private s3Client: S3Client | null = null;

  constructor(config: StorageConfig = storageConfig) {
    this.config = config;
  }

  /**
   * Get the provider name
   */
  public getProviderName(): string {
    return 'S3';
  }

  /**
   * Get the S3 client instance
   */
  private getS3Client(): S3Client {
    if (this.s3Client) {
      return this.s3Client;
    }

    const { region, endpoint, accessKeyId, secretAccessKey, forcePathStyle } =
      this.config;

    if (!region) {
      throw new ConfigurationError('Storage region is not configured');
    }

    const clientOptions: any = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    // Add custom endpoint for S3-compatible services like Cloudflare R2
    if (endpoint) {
      clientOptions.endpoint = endpoint;
      clientOptions.forcePathStyle = forcePathStyle !== false;
    }

    this.s3Client = new S3Client(clientOptions);
    return this.s3Client;
  }

  /**
   * Generate a unique filename with the original extension
   */
  private generateUniqueFilename(originalFilename: string): string {
    const extension = originalFilename.split('.').pop() || '';
    const uuid = randomUUID();
    return `${uuid}${extension ? `.${extension}` : ''}`;
  }

  /**
   * Upload a file to S3
   */
  public async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    try {
      const { file, filename, contentType, folder } = params;
      const s3 = this.getS3Client();
      const { bucketName } = this.config;

      if (!bucketName) {
        throw new ConfigurationError('Storage bucket name is not configured');
      }

      const uniqueFilename = this.generateUniqueFilename(filename);
      const key = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;

      // Convert Blob to Buffer if needed
      let fileBuffer: Buffer;
      if (file instanceof Blob) {
        fileBuffer = Buffer.from(await file.arrayBuffer());
      } else {
        fileBuffer = file;
      }

      // Upload the file
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await s3.send(command);

      // Generate the URL
      const { publicUrl } = this.config;
      let url: string;

      if (publicUrl) {
        // Use custom domain if provided
        url = `${publicUrl.replace(/\/$/, '')}/${key}`;
        console.log('uploadFile, public url', url);
      } else {
        // Generate a pre-signed URL if no public URL is provided
        const getCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        });
        url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 * 24 * 7 }); // 7 days
        console.log('uploadFile, signed url', url);
      }

      return { url, key };
    } catch (error) {
      if (error instanceof ConfigurationError) {
        console.error('uploadFile, configuration error', error);
        throw error;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during file upload';
      console.error('uploadFile, error', message);
      throw new UploadError(message);
    }
  }

  /**
   * Delete a file from S3
   */
  public async deleteFile(key: string): Promise<void> {
    try {
      const s3 = this.getS3Client();
      const { bucketName } = this.config;

      if (!bucketName) {
        throw new ConfigurationError('Storage bucket name is not configured');
      }

      const command = {
        Bucket: bucketName,
        Key: key,
      };

      await s3.send(
        new PutObjectCommand({
          ...command,
          Body: '',
        })
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred during file deletion';
      console.error('deleteFile, error', message);
      throw new StorageError(message);
    }
  }

  /**
   * Generate a pre-signed URL for direct browser uploads
   */
  public async getPresignedUploadUrl(
    params: PresignedUploadUrlParams
  ): Promise<UploadFileResult> {
    try {
      const { filename, contentType, folder, expiresIn = 3600 } = params;
      const s3 = this.getS3Client();
      const { bucketName } = this.config;

      if (!bucketName) {
        throw new ConfigurationError('Storage bucket name is not configured');
      }

      const uniqueFilename = this.generateUniqueFilename(filename);
      const key = folder ? `${folder}/${uniqueFilename}` : uniqueFilename;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(s3, command, { expiresIn });
      return { url, key };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while generating presigned URL';
      console.error('getPresignedUploadUrl, error', message);
      throw new StorageError(message);
    }
  }
}
