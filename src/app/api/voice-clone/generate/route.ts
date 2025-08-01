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
    // Note: SDK uses camelCase, not snake_case like REST API
    const response = await client.tts.audio.speech({
      input: text,
      voiceId: voiceId,
      audioFormat: 'mp3', // Explicitly set format
    });

    // Extract audio data from the response object
    if (!response.audioData) {
      throw new Error('No audio data received from Speechify API');
    }

    // Determine content type based on audio format
    const contentType =
      response.audioFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';

    // Create data URL for frontend consumption
    const audioUrl = `data:${contentType};base64,${response.audioData}`;

    // Return JSON response as expected by frontend
    return NextResponse.json({
      audioUrl: audioUrl,
      audioFormat: response.audioFormat,
      billableCharacters: response.billableCharactersCount || 0,
    });
  } catch (error) {
    console.error('Speech generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
