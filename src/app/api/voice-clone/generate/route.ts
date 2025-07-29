import { SpeechifyClient } from '@speechify/api';
import { type NextRequest, NextResponse } from 'next/server';

const client = new SpeechifyClient({
  token: process.env.SPEECHIFY_API_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId } = await request.json();

    if (!text || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required fields: text, voiceId' },
        { status: 400 }
      );
    }

    // Generate speech using the cloned voice
    const response = await client.tts.audio.speech({
      input: text,
      voiceId: voiceId,
    });

    // Extract audio data from the response object
    if (!response.audioData) {
      throw new Error('No audio data received from Speechify API');
    }

    // Convert base64 audio data to buffer
    const audioBuffer = Buffer.from(response.audioData, 'base64');

    // Determine content type based on audio format
    const contentType =
      response.audioFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';
    const fileExtension = response.audioFormat === 'wav' ? 'wav' : 'mp3';

    // Return the audio data
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="generated-speech.${fileExtension}"`,
      },
    });
  } catch (error) {
    console.error('Speech generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
