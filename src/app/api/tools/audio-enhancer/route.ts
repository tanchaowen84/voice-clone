import { Client } from '@gradio/client';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/tools/audio-enhancer
 * Enhance audio quality using DeepFilterNet via Hugging Face Space
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🎵 [Audio Enhancer API] Starting audio enhancement request');

    // Get the uploaded audio file from form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      console.log('❌ [Audio Enhancer API] No audio file provided');
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!audioFile.type.startsWith('audio/')) {
      console.log('❌ [Audio Enhancer API] Invalid file type:', audioFile.type);
      return NextResponse.json(
        { error: 'File must be an audio file' },
        { status: 400 }
      );
    }

    console.log(
      `🎵 [Audio Enhancer API] Processing audio file: ${audioFile.name} (${audioFile.size} bytes, ${audioFile.type})`
    );

    // Convert File to Blob for Gradio client
    const audioBlob = new Blob([await audioFile.arrayBuffer()], {
      type: audioFile.type,
    });

    // Connect to the Hugging Face Space
    console.log('🔗 [Audio Enhancer API] Connecting to Hugging Face Space...');
    const client = await Client.connect('tanchaowen84/deepfliternet');

    // Call the prediction endpoint
    console.log('🚀 [Audio Enhancer API] Calling prediction endpoint...');
    const result = await client.predict('/predict', {
      path: audioBlob,
    });

    console.log('✅ [Audio Enhancer API] Enhancement completed successfully');

    // The result should contain the enhanced audio data
    // Based on Gradio client patterns, result.data typically contains the output
    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Audio enhanced successfully',
    });
  } catch (error) {
    console.error('❌ [Audio Enhancer API] Enhancement failed:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: 'Failed to connect to audio enhancement service' },
          { status: 503 }
        );
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Audio enhancement request timed out' },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to enhance audio' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tools/audio-enhancer
 * Get information about the audio enhancer service
 */
export async function GET() {
  return NextResponse.json({
    service: 'Audio Enhancer',
    description: 'Enhance audio quality using DeepFilterNet',
    supportedFormats: ['wav', 'mp3', 'flac', 'ogg'],
    maxFileSize: '50MB',
    endpoint: '/api/tools/audio-enhancer',
    method: 'POST',
    parameters: {
      audio: 'Audio file to enhance (multipart/form-data)',
    },
  });
}
