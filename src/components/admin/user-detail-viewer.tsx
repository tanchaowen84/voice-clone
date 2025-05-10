import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { UserAvatar } from '@/components/layout/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2Icon, MailCheckIcon, MailQuestionIcon } from 'lucide-react';
import type { SafeActionResult } from 'next-safe-action';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  createdAt: Date;
  customerId: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
}

interface UserDetailViewerProps {
  user: User;
  onBan: (
    userId: string,
    reason: string,
    expiresAt: Date | null
  ) => Promise<SafeActionResult<string, any, any, any, any>>;
  onUnban: (
    userId: string
  ) => Promise<SafeActionResult<string, any, any, any, any>>;
}

export function UserDetailViewer({
  user,
  onBan,
  onUnban,
}: UserDetailViewerProps) {
  const t = useTranslations('Dashboard.admin.users');
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [banReason, setBanReason] = useState('');
  const [banExpiresAt, setBanExpiresAt] = useState<string>('');

  const handleBan = async () => {
    if (!banReason) {
      setError(t('ban.error'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const expiresAt = banExpiresAt ? new Date(banExpiresAt) : null;
      const result = await onBan(user.id, banReason, expiresAt);

      if (
        result?.data &&
        typeof result.data === 'object' &&
        'success' in result.data &&
        result.data.success
      ) {
        toast.success(t('ban.success'));
        // Reset form
        setBanReason('');
        setBanExpiresAt('');
      } else {
        const errorMessage =
          result?.data &&
          typeof result.data === 'object' &&
          'error' in result.data
            ? String(result.data.error)
            : t('ban.error');
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('ban user error:', error);
      setError(t('ban.error'));
      toast.error(t('ban.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await onUnban(user.id);

      if (
        result?.data &&
        typeof result.data === 'object' &&
        'success' in result.data &&
        result.data.success
      ) {
        toast.success(t('unban.success'));
      } else {
        const errorMessage =
          result?.data &&
          typeof result.data === 'object' &&
          'error' in result.data
            ? String(result.data.error)
            : t('unban.error');
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('unban user error:', error);
      setError(t('unban.error'));
      toast.error(t('unban.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="cursor-pointer text-foreground w-fit px-0 text-left"
        >
          <div className="flex items-center gap-2 pl-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-8 border"
            />
            <span className="hover:underline hover:underline-offset-4">
              {user.name}
            </span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-12 border"
            />
            <div>
              <DrawerTitle>{user.name}</DrawerTitle>
              <DrawerDescription>{user.email}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-muted-foreground px-1.5">
                {user.emailVerified ? (
                  <MailCheckIcon className="stroke-green-500 dark:stroke-green-400" />
                ) : (
                  <MailQuestionIcon className="stroke-red-500 dark:stroke-red-400" />
                )}
                {user.emailVerified
                  ? t('email.verified')
                  : t('email.unverified')}
              </Badge>
              <Badge
                variant={user.role === 'admin' ? 'default' : 'outline'}
                className="px-1.5"
              >
                {user.role || 'user'}
              </Badge>
              {user.banned && (
                <Badge variant="destructive" className="px-1.5">
                  {t('banned')}
                </Badge>
              )}
            </div>
            <div className="text-muted-foreground">
              {t('joined')}: {format(user.createdAt, 'PPP')}
            </div>
          </div>
          <Separator />
          {error && <div className="text-sm text-destructive">{error}</div>}
          {user.banned ? (
            <div className="grid gap-4">
              <div className="text-muted-foreground">
                {t('ban.reason')}: {user.banReason}
              </div>
              {user.banExpires && (
                <div className="text-muted-foreground">
                  {t('ban.expires')}: {format(user.banExpires, 'PPP')}
                </div>
              )}
              <Button
                variant="destructive"
                onClick={handleUnban}
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {t('unban.button')}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleBan();
              }}
              className="grid gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="ban-reason">{t('ban.reason')}</Label>
                <Textarea
                  id="ban-reason"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder={t('ban.reasonPlaceholder')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ban-expires">{t('ban.expires')}</Label>
                <Input
                  id="ban-expires"
                  type="datetime-local"
                  value={banExpiresAt}
                  onChange={(e) => setBanExpiresAt(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading || !banReason}
              >
                {isLoading && (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                )}
                {t('ban.button')}
              </Button>
            </form>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{t('close')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
