import { SpeechifyClient } from '@speechify/api';
import { NextRequest, NextResponse } from 'next/server';

const token = process.env.SPEECHIFY_API_KEY || process.env.SPEECHIFY_API_TOKEN || '';

const client = new SpeechifyClient({ token });

const CONTENT_TYPE_BY_FORMAT: Record<string, string> = {
  wav: 'audio/wav',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  pcm: 'audio/wav',
};

export async function POST(request: NextRequest) {
  try {
    if (!token) {
      return NextResponse.json(
        { error: 'Speechify API token is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const input = (body?.input || '').trim();
    const voiceId = (body?.voiceId || body?.voice_id || process.env.SPEECHIFY_DEFAULT_VOICE_ID || 'george').trim();
    const language = body?.language || 'en-US';
    const audioFormat = body?.audioFormat || body?.audio_format || 'mp3';
    const model = body?.model || (language.startsWith('en') ? 'simba-english' : 'simba-multilingual');

    if (!input || !voiceId) {
      return NextResponse.json(
        { error: 'Missing required fields: input and voiceId' },
        { status: 400 }
      );
    }

    const response = await client.tts.audio.speech({
      input,
      voiceId,
      language,
      audioFormat,
      model,
      options: {
        textNormalization: true,
        loudnessNormalization: false,
      },
    });

    if (!response?.audioData) {
      return NextResponse.json(
        { error: 'No audio data returned by Speechify' },
        { status: 502 }
      );
    }

    const normalizedFormat = response.audioFormat || audioFormat;
    const contentType = CONTENT_TYPE_BY_FORMAT[normalizedFormat] || 'audio/mpeg';
    const audioUrl = `data:${contentType};base64,${response.audioData}`;

    return NextResponse.json({
      audioUrl,
      audioFormat: normalizedFormat,
      billableCharactersCount: response.billableCharactersCount ?? input.length,
    });
  } catch (error) {
    console.error('[TTS Speech API] failed:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}
