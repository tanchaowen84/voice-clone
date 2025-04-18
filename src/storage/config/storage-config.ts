import type { StorageConfig } from '../types';

/**
 * Default storage configuration
 *
 * This configuration is loaded from environment variables
 */
export const storageConfig: StorageConfig = {
  region: process.env.STORAGE_REGION || '',
  endpoint: process.env.STORAGE_ENDPOINT,
  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
  bucketName: process.env.STORAGE_BUCKET_NAME || '',
  publicUrl: process.env.STORAGE_PUBLIC_URL,
  forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== 'false',
};
