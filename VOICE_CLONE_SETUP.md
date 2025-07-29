# Voice Clone Feature Setup

This document explains how to set up and use the voice cloning feature integrated into the homepage.

## Prerequisites

1. **Speechify API Account**: Sign up at [Speechify](https://speechify.com/) and get your API token
2. **Environment Variables**: Add your Speechify API token to your environment

## Environment Setup

Add the following environment variable to your `.env.local` file:

```bash
SPEECHIFY_API_TOKEN="your_speechify_api_token_here"
```

## Features Implemented

### 1. Voice Clone Creation
- Upload audio samples (any audio format supported)
- Specify voice name and gender
- Consent confirmation required
- API endpoint: `POST /api/voice-clone/create`

### 2. Speech Generation
- Select from your cloned voices
- Enter text to convert to speech
- Generate and download MP3 audio
- API endpoint: `POST /api/voice-clone/generate`

### 3. Voice Management
- List all available voices
- Delete unwanted voices
- API endpoints: `GET /api/voice-clone/voices`, `DELETE /api/voice-clone/voices`

## Usage Instructions

1. **Create a Voice Clone**:
   - Upload a clear audio sample (at least 30 seconds recommended)
   - Enter a name for your voice
   - Select the gender
   - Check the consent checkbox
   - Click "Create Voice Clone"

2. **Generate Speech**:
   - Click "Load Voices" to refresh the voice list
   - Select a voice from the dropdown
   - Enter the text you want to convert to speech
   - Click "Generate Speech"
   - Play the generated audio or download it

3. **Manage Voices**:
   - View all your created voices in the management section
   - Delete voices you no longer need

## API Endpoints

### Create Voice Clone
```
POST /api/voice-clone/create
Content-Type: multipart/form-data

Fields:
- audio: File (audio sample)
- name: string (voice name)
- gender: string ("male" | "female")
- consent: string ("true")
```

### Generate Speech
```
POST /api/voice-clone/generate
Content-Type: application/json

Body:
{
  "text": "Text to convert to speech",
  "voiceId": "voice_id_from_creation"
}
```

### List Voices
```
GET /api/voice-clone/voices
```

### Delete Voice
```
DELETE /api/voice-clone/voices
Content-Type: application/json

Body:
{
  "voiceId": "voice_id_to_delete"
}
```

## Technical Implementation

- **Frontend**: React component with form handling and audio playback
- **Backend**: Next.js API routes using Speechify SDK
- **File Handling**: Multipart form data for audio uploads
- **Audio Processing**: Stream handling for audio generation
- **Error Handling**: Comprehensive error handling and user feedback

## Troubleshooting

1. **API Token Issues**: Ensure your Speechify API token is valid and has sufficient credits
2. **Audio Upload Errors**: Check file format and size limitations
3. **Generation Failures**: Verify the voice ID exists and is accessible
4. **Network Issues**: Check your internet connection and API endpoint availability

## Security Considerations

- API token is stored securely in environment variables
- Consent verification is required for voice cloning
- File uploads are validated on the server side
- Error messages don't expose sensitive information
