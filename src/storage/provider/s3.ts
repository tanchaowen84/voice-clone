import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

// Define error types for better error handling
export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export class ConfigurationError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class UploadError extends StorageError {
  constructor(message: string) {
    super(message);
    this.name = 'UploadError';
  }
}

/**
 * S3 client configuration
 * 
 * https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html
 * https://www.npmjs.com/package/@aws-sdk/client-s3
 * https://www.cloudflare.com/lp/pg-cloudflare-r2-vs-aws-s3/
 * https://docs.uploadthing.com/uploading-files
 */
const getS3Client = (): S3Client => {
  const region = process.env.STORAGE_REGION;
  const endpoint = process.env.STORAGE_ENDPOINT;

  // TODO: set region to 'auto' if not set???
  if (!region) {
    throw new ConfigurationError('STORAGE_REGION environment variable is not set');
  }

  const clientOptions: any = {
    region,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
    },
  };

  // Add custom endpoint for S3-compatible services like Cloudflare R2
  if (endpoint) {
    clientOptions.endpoint = endpoint;
    // For services like R2 that don't use path-style URLs
    if (process.env.STORAGE_FORCE_PATH_STYLE === 'false') {
      clientOptions.forcePathStyle = false;
    } else {
      clientOptions.forcePathStyle = true;
    }
  }

  return new S3Client(clientOptions);
};

// Generate a unique filename with the original extension
const generateUniqueFilename = (originalFilename: string): string => {
  const extension = originalFilename.split('.').pop() || '';
  const uuid = randomUUID();
  return `${uuid}${extension ? `.${extension}` : ''}`;
};

// Upload a file to S3
export const uploadFile = async (
  file: Buffer | Blob,
  originalFilename: string,
  contentType: string,
  folder?: string
): Promise<{ url: string; key: string }> => {
  try {
    const s3 = getS3Client();
    const bucket = process.env.STORAGE_BUCKET_NAME;

    if (!bucket) {
      console.error('STORAGE_BUCKET_NAME environment variable is not set');
      throw new ConfigurationError('STORAGE_BUCKET_NAME environment variable is not set');
    }

    const filename = generateUniqueFilename(originalFilename);
    const key = folder ? `${folder}/${filename}` : filename;

    // Convert Blob to Buffer if needed
    let fileBuffer: Buffer;
    if (file instanceof Blob) {
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      fileBuffer = file;
    }

    // Upload the file
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3.send(command);

    // Generate the URL
    const publicUrl = process.env.STORAGE_PUBLIC_URL;
    let url: string;

    if (publicUrl) {
      // Use custom domain if provided
      url = `${publicUrl.replace(/\/$/, '')}/${key}`;
      console.log('uploadFile, public url', url);
    } else {
      // Generate a pre-signed URL if no public URL is provided
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 * 24 * 7 }); // 7 days
      console.log('uploadFile, signed url', url);
    }

    return { url, key };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error('ConfigurationError', error.message);
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Unknown error occurred during file upload';
    throw new UploadError(message);
  }
};

// Delete a file from S3
export const deleteFile = async (key: string): Promise<void> => {
  try {
    const s3 = getS3Client();
    const bucket = process.env.STORAGE_BUCKET_NAME;

    if (!bucket) {
      throw new ConfigurationError('STORAGE_BUCKET_NAME environment variable is not set');
    }

    const command = {
      Bucket: bucket,
      Key: key,
    };

    await s3.send(new PutObjectCommand({
      ...command,
      Body: '',
    }));
  } catch (error) {
    console.error('deleteFile', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred during file deletion';
    throw new StorageError(message);
  }
};

// Generate a pre-signed URL for direct browser uploads
export const getPresignedUploadUrl = async (
  filename: string,
  contentType: string,
  folder?: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ url: string; key: string }> => {
  try {
    const s3 = getS3Client();
    const bucket = process.env.STORAGE_BUCKET_NAME;

    if (!bucket) {
      throw new ConfigurationError('STORAGE_BUCKET_NAME environment variable is not set');
    }

    const key = folder ? `${folder}/${filename}` : filename;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn });
    console.log('getPresignedUploadUrl', url);
    return { url, key };
  } catch (error) {
    console.error('getPresignedUploadUrl', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred while generating presigned URL';
    throw new StorageError(message);
  }
};
