# Storage Module

This module provides a unified interface for storing and retrieving files using various cloud storage providers. Currently, it supports Amazon S3 and compatible services like Cloudflare R2.

## Features

- Upload files to cloud storage
- Generate pre-signed URLs for direct browser-to-storage uploads
- Delete files from storage
- Client-side upload helpers for both small and large files

## Basic Usage

```typescript
import { uploadFile, deleteFile, getPresignedUploadUrl } from '@/src/storage';

// Upload a file
const { url, key } = await uploadFile(
  fileBuffer,
  'original-filename.jpg',
  'image/jpeg',
  'uploads/images'
);

// Delete a file
await deleteFile(key);

// Generate a pre-signed URL for direct upload
const { url, key } = await getPresignedUploadUrl(
  'filename.jpg',
  'image/jpeg',
  'uploads/images'
);
```

## Client-Side Upload

For client-side uploads, use the `uploadFileFromBrowser` function:

```typescript
'use client';

import { uploadFileFromBrowser } from '@/src/storage';

// In your component
async function handleFileUpload(event) {
  const file = event.target.files[0];
  
  try {
    // This will automatically use the most appropriate upload method
    // based on the file size
    const { url, key } = await uploadFileFromBrowser(file, 'uploads/images');
    console.log('File uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

## Configuration

The storage module is configured using environment variables:

```
# Required
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY_ID=your-access-key
STORAGE_SECRET_ACCESS_KEY=your-secret-key
STORAGE_BUCKET_NAME=your-bucket-name

# Optional
STORAGE_ENDPOINT=https://custom-endpoint.com
STORAGE_PUBLIC_URL=https://cdn.example.com
STORAGE_FORCE_PATH_STYLE=true
```

## Advanced Usage

### Using the Storage Provider Directly

If you need more control, you can interact with the storage provider directly:

```typescript
import { getStorageProvider } from '@/src/storage';

const provider = getStorageProvider();

// Use provider methods directly
const result = await provider.uploadFile({
  file: fileBuffer,
  filename: 'example.pdf',
  contentType: 'application/pdf',
  folder: 'documents'
});
```

### Using a Custom Provider Implementation

You can create and use your own storage provider implementation:

```typescript
import { StorageProvider, UploadFileParams, UploadFileResult } from '@/src/storage';

class CustomStorageProvider implements StorageProvider {
  // Implement the required methods
  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    // Your implementation
  }

  async deleteFile(key: string): Promise<void> {
    // Your implementation
  }

  async getPresignedUploadUrl(params: PresignedUploadUrlParams): Promise<UploadFileResult> {
    // Your implementation
  }

  getProviderName(): string {
    return 'CustomProvider';
  }
}

// Then use it
const customProvider = new CustomStorageProvider();
const result = await customProvider.uploadFile({
  file: fileBuffer,
  filename: 'example.jpg',
  contentType: 'image/jpeg'
});
```

## API Reference

### Main Functions

- `uploadFile(file, filename, contentType, folder?)`: Upload a file to storage
- `deleteFile(key)`: Delete a file from storage
- `getPresignedUploadUrl(filename, contentType, folder?, expiresIn?)`: Generate a pre-signed URL
- `uploadFileFromBrowser(file, folder?)`: Upload a file from the browser

### Provider Interface

The `StorageProvider` interface defines the following methods:

- `uploadFile(params)`: Upload a file to storage
- `deleteFile(key)`: Delete a file from storage
- `getPresignedUploadUrl(params)`: Generate a pre-signed URL
- `getProviderName()`: Get the provider name

### Configuration

The `StorageConfig` interface defines the configuration options:

- `region`: Storage region (e.g., 'us-east-1')
- `endpoint?`: Custom endpoint URL for S3-compatible services
- `accessKeyId`: Access key ID for authentication
- `secretAccessKey`: Secret access key for authentication
- `bucketName`: Storage bucket name
- `publicUrl?`: Public URL for accessing files
- `forcePathStyle?`: Whether to use path-style URLs 