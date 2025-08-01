/**
 * Audio conversion utilities for voice cloning
 * Converts WebM audio to WAV format for better API compatibility
 */

/**
 * Converts a WebM audio blob to WAV format using Web Audio API
 * @param webmBlob - The WebM audio blob to convert
 * @returns Promise<Blob> - The converted WAV audio blob
 */
export async function convertWebMToWAV(webmBlob: Blob): Promise<Blob> {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Convert blob to array buffer
    const arrayBuffer = await webmBlob.arrayBuffer();
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Convert to WAV format
    const wavBlob = await audioBufferToWAV(audioBuffer);
    
    // Close audio context to free resources
    await audioContext.close();
    
    return wavBlob;
  } catch (error) {
    console.error('Error converting WebM to WAV:', error);
    throw new Error('Failed to convert audio format. Please try recording again.');
  }
}

/**
 * Converts an AudioBuffer to WAV format blob
 * @param audioBuffer - The audio buffer to convert
 * @returns Promise<Blob> - The WAV format blob
 */
async function audioBufferToWAV(audioBuffer: AudioBuffer): Promise<Blob> {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  
  // Create interleaved buffer
  const interleavedBuffer = new Float32Array(length * numberOfChannels);
  
  // Interleave channels
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      interleavedBuffer[i * numberOfChannels + channel] = channelData[i];
    }
  }
  
  // Convert to 16-bit PCM
  const pcmBuffer = new Int16Array(interleavedBuffer.length);
  for (let i = 0; i < interleavedBuffer.length; i++) {
    // Clamp values to [-1, 1] and convert to 16-bit
    const sample = Math.max(-1, Math.min(1, interleavedBuffer[i]));
    pcmBuffer[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
  }
  
  // Create WAV header
  const wavHeader = createWAVHeader(pcmBuffer.length * 2, sampleRate, numberOfChannels);
  
  // Combine header and data
  const wavBuffer = new ArrayBuffer(wavHeader.length + pcmBuffer.length * 2);
  const view = new Uint8Array(wavBuffer);
  
  // Copy header
  view.set(wavHeader, 0);
  
  // Copy PCM data
  const pcmView = new Uint8Array(pcmBuffer.buffer);
  view.set(pcmView, wavHeader.length);
  
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

/**
 * Creates a WAV file header
 * @param dataLength - Length of the audio data in bytes
 * @param sampleRate - Sample rate of the audio
 * @param numberOfChannels - Number of audio channels
 * @returns Uint8Array - The WAV header
 */
function createWAVHeader(dataLength: number, sampleRate: number, numberOfChannels: number): Uint8Array {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // File size - 8
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Sub-chunk size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, numberOfChannels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * numberOfChannels * 2, true); // Byte rate
  view.setUint16(32, numberOfChannels * 2, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // Data size
  
  return new Uint8Array(header);
}

/**
 * Writes a string to a DataView at the specified offset
 * @param view - The DataView to write to
 * @param offset - The offset to start writing at
 * @param string - The string to write
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Checks if the browser supports the required Web Audio API features
 * @returns boolean - True if supported, false otherwise
 */
export function isAudioConversionSupported(): boolean {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
}
