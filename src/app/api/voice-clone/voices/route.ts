import { SpeechifyClient } from '@speechify/api';
import { type NextRequest, NextResponse } from 'next/server';

const client = new SpeechifyClient({
  token: process.env.SPEECHIFY_API_TOKEN || '',
});

export async function GET() {
  try {
    // Get list of available voices
    const voices = await client.tts.voices.list();

    return NextResponse.json({
      success: true,
      voices: voices,
    });
  } catch (error) {
    console.error('Failed to fetch voices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { voiceId } = await request.json();

    if (!voiceId) {
      return NextResponse.json({ error: 'Missing voiceId' }, { status: 400 });
    }

    // Delete the voice
    await client.tts.voices.delete(voiceId);

    return NextResponse.json({
      success: true,
      message: 'Voice deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete voice:', error);
    return NextResponse.json(
      { error: 'Failed to delete voice' },
      { status: 500 }
    );
  }
}
