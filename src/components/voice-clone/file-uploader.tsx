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
        {/* Upload Area - Neumorphic Design */}
        <div
          className={`
            relative rounded-2xl p-8 transition-all duration-300 cursor-pointer
            ${
              isDragOver
                ? 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 shadow-[inset_4px_4px_8px_#c084fc,inset_-4px_-4px_8px_#e879f9] dark:shadow-[inset_4px_4px_8px_#581c87,inset_-4px_-4px_8px_#7c3aed]'
                : error
                  ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 shadow-[inset_4px_4px_8px_#f87171,inset_-4px_-4px_8px_#fca5a5] dark:shadow-[inset_4px_4px_8px_#7f1d1d,inset_-4px_-4px_8px_#dc2626]'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] dark:shadow-[inset_8px_8px_16px_#1e293b,inset_-8px_-8px_16px_#475569] hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] dark:hover:shadow-[inset_6px_6px_12px_#1e293b,inset_-6px_-6px_12px_#475569]'
            }
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

              <button
                type="button"
                className="h-16 px-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#1e293b,-4px_-4px_8px_#475569] hover:shadow-[2px_2px_4px_#d1d5db,-2px_-2px_4px_#ffffff] dark:hover:shadow-[2px_2px_4px_#1e293b,-2px_-2px_4px_#475569] active:shadow-[inset_2px_2px_4px_#d1d5db,inset_-2px_-2px_4px_#ffffff] dark:active:shadow-[inset_2px_2px_4px_#1e293b,inset_-2px_-2px_4px_#475569] transition-all duration-200 text-foreground font-medium flex items-center gap-2"
              >
                <Upload className="h-6 w-6" />
                Select Audio File
              </button>
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
