'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function UpdateAvatarCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: session, error } = authClient.useSession();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const handleAvatarClick = () => {
    // Create a hidden file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);
    setAvatarUrl(tempUrl);
    
    // Here you would typically upload the file to your server
    // For now, we're just simulating the upload
    setTimeout(() => {
      setIsUploading(false);
      // In a real implementation, you would set the avatar URL to the URL returned by your server
    }, 1000);
  };

  // Get initials from username for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('avatar.title')}</CardTitle>
        <CardDescription>
          {t('avatar.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <div 
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl ?? ''} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-muted-foreground">
              {t('avatar.recommendation')}
            </p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={handleAvatarClick}
              disabled={isUploading}
            >
              {isUploading ? t('avatar.uploading') : t('avatar.uploadAvatar')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 