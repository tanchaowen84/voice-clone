'use client';

import { Button } from '@/components/ui/button';
import { useVoiceCloneStore } from '@/stores/voice-clone-store';
import {
  formatDuration,
  formatFileSize,
  validateAudioFileWithMetadata,
} from '@/utils/audio-validation';
import { AlertCircle, Clock, FileAudio, Info, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * File Uploader Component
 * Handles file upload with drag & drop functionality and validation
 */
export function FileUploader() {
  const { setAudioFile } = useVoiceCloneStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  // Create audio preview URL safely on client side
  useEffect(() => {
    if (uploadedFile && typeof window !== 'undefined') {
      const url = URL.createObjectURL(uploadedFile);
      setAudioPreviewUrl(url);

      // Cleanup function to revoke the URL
      return () => {
        URL.revokeObjectURL(url);
        setAudioPreviewUrl(null);
      };
    }
    setAudioPreviewUrl(null);
  }, [uploadedFile]);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsValidating(true);
      setError('');
      setWarnings([]);
      setAudioDuration(null);

      try {
        const validation = await validateAudioFileWithMetadata(file);

        if (!validation.isValid) {
          setError(validation.error || 'Invalid file');
          setUploadedFile(null);
          setIsValidating(false);
          return;
        }

        setWarnings(validation.warnings || []);
        setUploadedFile(file);
        setAudioFile(file);

        if (validation.metadata?.duration) {
          setAudioDuration(validation.metadata.duration);
        }
      } catch (err) {
        setError('Failed to validate file. Please try again.');
        setUploadedFile(null);
      } finally {
        setIsValidating(false);
      }
    },
    [setAudioFile]
  );

  // Handle file input change
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const audioFile = files.find((file) => file.type.startsWith('audio/'));

      if (audioFile) {
        handleFileSelect(audioFile);
      } else {
        setError('Please drop an audio file.');
      }
    },
    [handleFileSelect]
  );

  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError('');
    setWarnings([]);
    setAudioDuration(null);
    setAudioFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="text-center py-12">
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
            ${
              isDragOver
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/20'
                : 'border-muted-foreground/30 bg-muted/30 hover:bg-muted/40'
            }
            ${error ? 'border-red-400 bg-red-50 dark:bg-red-950/20' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {!uploadedFile ? (
            <>
              <p className="text-muted-foreground mb-6">
                {isDragOver
                  ? 'Drop your audio file here'
                  : 'Drag and drop an audio file or click to select'}
              </p>

              <Button
                size="lg"
                variant="outline"
                className="h-16 px-8 rounded-xl"
              >
                <Upload className="mr-2 h-6 w-6" />
                Select Audio File
              </Button>
            </>
          ) : (
            // File Preview
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileAudio className="h-8 w-8 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    {uploadedFile.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    {audioDuration && (
                      <>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(audioDuration)}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Audio Preview */}
              {audioPreviewUrl && (
                <audio
                  controls
                  src={audioPreviewUrl}
                  className="w-full max-w-md mx-auto"
                >
                  <track
                    kind="captions"
                    src=""
                    srcLang="en"
                    label="English captions"
                  />
                </audio>
              )}
            </div>
          )}
        </div>

        {/* Validation Status */}
        {isValidating && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Upload className="h-5 w-5 animate-pulse" />
              <p>Validating audio file...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Info className="h-5 w-5" />
                <p className="font-semibold">Recommendations:</p>
              </div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 ml-7">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
