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
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const consentAgreed = formData.get('consent') as string;

    if (
      !audioFile ||
      !voiceName ||
      !gender ||
      !fullName ||
      !email ||
      !consentAgreed
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: audio, name, gender, fullName, email, consent',
        },
        { status: 400 }
      );
    }

    if (consentAgreed !== 'true') {
      return NextResponse.json(
        { error: 'Consent must be provided' },
        { status: 400 }
      );
    }

    // Create consent JSON string as required by Speechify API
    const consentData = JSON.stringify({
      fullName: fullName,
      email: email,
    });

    // Create voice clone using Speechify API
    // According to the API docs, sample should be a File object directly
    const response = await client.tts.voices.create({
      sample: audioFile,
      name: voiceName,
      gender: gender as 'male' | 'female',
      consent: consentData,
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
