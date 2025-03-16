'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { User2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function UpdateAvatarCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [isUploading, setIsUploading] = useState(false);
  const { data: session, error } = authClient.useSession();
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(session.user.image);
    }
  }, [session]);

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

  return (
    <Card className="max-w-md md:max-w-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {t('avatar.title')}
        </CardTitle>
        <CardDescription>
          {t('avatar.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center sm:flex-row gap-4">
          {/* avatar */}
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={avatarUrl ?? ''} alt={user.name} />
            <AvatarFallback>
              <User2Icon className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          {/* upload button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleAvatarClick}
            disabled={isUploading}
          >
            {isUploading ? t('avatar.uploading') : t('avatar.uploadAvatar')}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 flex justify-between items-center bg-muted rounded-none">
        <p className="text-sm text-muted-foreground">
          {t('avatar.recommendation')}
        </p>
      </CardFooter>
    </Card>
  );
} 