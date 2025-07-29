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

    // Convert response to buffer if it's a stream
    let audioBuffer: Buffer;
    if (response instanceof Buffer) {
      audioBuffer = response;
    } else if (response instanceof ArrayBuffer) {
      audioBuffer = Buffer.from(response);
    } else {
      // If it's a stream, convert to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of response as any) {
        chunks.push(chunk);
      }
      audioBuffer = Buffer.concat(chunks);
    }

    // Return the audio data
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="generated-speech.mp3"',
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
