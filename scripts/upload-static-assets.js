#!/usr/bin/env node

/**
 * Upload Static Assets to Cloudflare R2
 *
 * This script uploads the specified static assets to your Cloudflare R2 bucket
 * using the configured CDN domain.
 */

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Load environment variables
require('dotenv').config();

// Configuration from environment variables
const config = {
  region: process.env.STORAGE_REGION || 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
  secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  bucketName: process.env.STORAGE_BUCKET_NAME,
  forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== 'false',
};

// Helper: recursively collect files under a directory (relative to public)
function listFilesRecursively(relativeDir) {
  const dirFullPath = path.join(process.cwd(), 'public', relativeDir);
  if (!fs.existsSync(dirFullPath)) return [];
  const entries = fs.readdirSync(dirFullPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relPath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(relPath));
    } else {
      files.push(relPath.replace(/\\/g, '/'));
    }
  }
  return files;
}

// Assets to upload (relative to public directory)
const ASSETS_TO_UPLOAD = [
  'aicapabilities.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon.ico',
  'features1.png',
  'features2.png',
  'features3.png',
  'features4.png',
  'howitworks.png',
  'logo.png',
  'logo-dark.png',
  'og.png',
  // Blog & author images
  'images/avatars/voice-clone.png',
  'images/blog/voice-enhancer.png',
  'images/blog/how-to-clone-a-voice-for-free.png',
  // Include all audio files under /public/audio for CDN acceleration
  ...listFilesRecursively('audio'),
];

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: config.region,
  endpoint: config.endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  forcePathStyle: config.forcePathStyle,
});

/**
 * Upload a single file to R2
 * @param {string} filePath - Path to the file relative to public directory
 */
async function uploadFile(filePath) {
  const fullPath = path.join(process.cwd(), 'public', filePath);

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    return false;
  }

  try {
    // Read file
    const fileContent = fs.readFileSync(fullPath);

    // Determine content type
    const contentType = mime.lookup(filePath) || 'application/octet-stream';

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: filePath,
      Body: fileContent,
      ContentType: contentType,
      // Set cache control for static assets
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await s3Client.send(command);
    console.log(`✅ Uploaded: ${filePath} (${contentType})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Upload all static assets
 */
async function uploadAllAssets() {
  console.log('🚀 Starting static assets upload to Cloudflare R2...\n');

  // Validate configuration
  if (
    !config.endpoint ||
    !config.accessKeyId ||
    !config.secretAccessKey ||
    !config.bucketName
  ) {
    console.error(
      '❌ Missing required environment variables. Please check your .env file.'
    );
    console.error(
      'Required variables: STORAGE_ENDPOINT, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, STORAGE_BUCKET_NAME'
    );
    process.exit(1);
  }

  console.log(`📦 Bucket: ${config.bucketName}`);
  console.log(`🌐 Endpoint: ${config.endpoint}`);
  console.log(`📁 Assets to upload: ${ASSETS_TO_UPLOAD.length}\n`);

  let successCount = 0;
  let failCount = 0;

  // Upload each asset
  for (const asset of ASSETS_TO_UPLOAD) {
    const success = await uploadFile(asset);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📈 Total: ${ASSETS_TO_UPLOAD.length}`);

  if (failCount > 0) {
    console.log('\n⚠️  Some uploads failed. Please check the errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All assets uploaded successfully!');
    console.log(
      '🔗 Your assets are now available at: https://cdn.voice-clone.org/'
    );
  }
}

// Run the upload
if (require.main === module) {
  uploadAllAssets().catch((error) => {
    console.error('💥 Upload script failed:', error);
    process.exit(1);
  });
}

module.exports = { uploadAllAssets, uploadFile };
