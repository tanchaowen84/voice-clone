import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl } from '@/storage';
import { randomUUID } from 'crypto';
import { StorageError } from '@/storage/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, folder } = body;

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }

    // Validate content type (optional, based on your requirements)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Generate a unique filename to prevent collisions
    const extension = filename.split('.').pop() || '';
    const uniqueFilename = `${randomUUID()}${extension ? `.${extension}` : ''}`;

    // Get pre-signed URL
    const result = await getPresignedUploadUrl(
      uniqueFilename,
      contentType,
      folder || undefined
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);

    if (error instanceof StorageError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong while generating pre-signed URL' },
      { status: 500 }
    );
  }
} 