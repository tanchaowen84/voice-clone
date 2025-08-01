/**
 * Audio File Validation Utilities
 * Provides comprehensive validation for audio files
 */

export interface AudioMetadata {
  duration: number;
  sampleRate?: number;
  channels?: number;
  bitRate?: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
  metadata?: AudioMetadata;
}

/**
 * Validate audio file format and size
 */
export function validateAudioFile(file: File): ValidationResult {
  const supportedFormats = [
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp4',
    'audio/aac',
    'audio/flac',
    'audio/webm',
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const minFileSize = 1024; // 1KB
  const warnings: string[] = [];

  // Check file type
  if (!supportedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format: ${file.type}. Please use MP3, WAV, M4A, OGG, AAC, FLAC, or WebM files.`,
    };
  }

  // Check file size
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File size too large: ${formatFileSize(file.size)}. Maximum allowed size is 50MB.`,
    };
  }

  if (file.size < minFileSize) {
    return {
      isValid: false,
      error: `File size too small: ${formatFileSize(file.size)}. Minimum file size is 1KB.`,
    };
  }

  // Add warnings for suboptimal formats
  if (file.type === 'audio/mp3' && file.size < 1024 * 1024) {
    warnings.push('MP3 files under 1MB may have low quality. Consider using a higher bitrate.');
  }

  if (file.type === 'audio/ogg') {
    warnings.push('OGG format may have compatibility issues. WAV or MP3 is recommended.');
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Get audio file metadata using Web Audio API
 */
export async function getAudioMetadata(file: File): Promise<AudioMetadata | null> {
  try {
    // Create audio element to get basic metadata
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        const metadata: AudioMetadata = {
          duration: audio.duration,
        };
        
        URL.revokeObjectURL(url);
        resolve(metadata);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve(null);
      });

      audio.src = url;
    });
  } catch (error) {
    console.error('Error getting audio metadata:', error);
    return null;
  }
}

/**
 * Comprehensive audio file validation with metadata
 */
export async function validateAudioFileWithMetadata(file: File): Promise<ValidationResult> {
  // First, do basic validation
  const basicValidation = validateAudioFile(file);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  // Get metadata
  const metadata = await getAudioMetadata(file);
  const warnings = [...(basicValidation.warnings || [])];

  if (metadata) {
    // Check duration
    if (metadata.duration < 10) {
      warnings.push('Audio is shorter than 10 seconds. Longer recordings (30+ seconds) produce better voice clones.');
    } else if (metadata.duration > 300) {
      warnings.push('Audio is longer than 5 minutes. Consider using a shorter clip for faster processing.');
    }

    // Optimal duration range
    if (metadata.duration >= 30 && metadata.duration <= 120) {
      // This is the sweet spot - no warning needed
    } else if (metadata.duration < 30) {
      warnings.push('For best results, use audio clips between 30-120 seconds long.');
    }
  } else {
    warnings.push('Could not read audio metadata. The file may be corrupted or in an unsupported format.');
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    metadata: metadata || undefined,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
