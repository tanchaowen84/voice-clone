'use client';

import { Progress } from '@/components/ui/progress';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'uploading' | 'success' | 'error';
  fileName?: string;
  error?: string;
}

/**
 * Upload Progress Component
 * Shows upload progress with visual feedback
 */
export function UploadProgress({ progress, status, fileName, error }: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return `Uploading ${fileName}... ${progress}%`;
      case 'success':
        return `${fileName} uploaded successfully!`;
      case 'error':
        return error || 'Upload failed';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {status === 'uploading' && (
        <Progress 
          value={progress} 
          className="w-full h-2"
        />
      )}
    </div>
  );
}
