import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageError } from '@/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    const bucket = process.env.STORAGE_BUCKET_NAME;
    const region = process.env.STORAGE_REGION;
    const endpoint = process.env.STORAGE_ENDPOINT;
    const publicUrl = process.env.STORAGE_PUBLIC_URL;

    if (!bucket || !region) {
      return NextResponse.json(
        { error: 'Storage configuration is incomplete' },
        { status: 500 }
      );
    }

    let url: string;

    // If a public URL is configured, use it
    if (publicUrl) {
      url = `${publicUrl.replace(/\/$/, '')}/${key}`;
    } else {
      // Otherwise, generate a pre-signed URL
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

      const s3 = new S3Client(clientOptions);

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 * 7 }); // 7 days
    }

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error getting file URL:', error);

    if (error instanceof StorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while getting the file URL' },
      { status: 500 }
    );
  }
} 