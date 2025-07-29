import { Readable } from 'stream';
import { SpeechifyClient } from '@speechify/api';
import { type NextRequest, NextResponse } from 'next/server';

const client = new SpeechifyClient({
  token: process.env.SPEECHIFY_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const voiceName = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const consent = formData.get('consent') as string;

    if (!audioFile || !voiceName || !gender || !consent) {
      return NextResponse.json(
        { error: 'Missing required fields: audio, name, gender, consent' },
        { status: 400 }
      );
    }

    if (consent !== 'true') {
      return NextResponse.json(
        { error: 'Consent must be provided' },
        { status: 400 }
      );
    }

    // Convert File to ReadableStream for Speechify API
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // Create voice clone using Speechify API
    const response = await client.tts.voices.create({
      sample: stream,
      name: voiceName,
      gender: gender as 'male' | 'female',
      consent: consent,
    });

    return NextResponse.json({
      success: true,
      voiceId: response.id,
      message: 'Voice cloned successfully',
    });
  } catch (error) {
    console.error('Voice cloning error:', error);
    return NextResponse.json(
      { error: 'Failed to clone voice' },
      { status: 500 }
    );
  }
}
