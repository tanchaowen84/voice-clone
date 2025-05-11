import { UserAvatar } from '@/components/layout/user-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { authClient } from '@/lib/auth-client';
import type { User } from '@/lib/auth-types';
import { formatDate } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { useUsersStore } from '@/stores/users-store';
import {
  CalendarIcon,
  Loader2Icon,
  MailCheckIcon,
  MailQuestionIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserDetailViewerProps {
  user: User;
}

export function UserDetailViewer({ user }: UserDetailViewerProps) {
  const t = useTranslations('Dashboard.admin.users');
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [banReason, setBanReason] = useState('');
  const [banExpiresAt, setBanExpiresAt] = useState<Date | undefined>();
  const triggerRefresh = useUsersStore((state) => state.triggerRefresh);

  const handleBan = async () => {
    if (!banReason) {
      setError(t('ban.error'));
      return;
    }

    if (!user.id) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authClient.admin.banUser({
        userId: user.id,
        banReason,
        banExpiresIn: banExpiresAt
          ? Math.floor((banExpiresAt.getTime() - Date.now()) / 1000)
          : undefined,
      });

      toast.success(t('ban.success'));
      // Reset form
      setBanReason('');
      setBanExpiresAt(undefined);
      // Trigger refresh
      triggerRefresh();
    } catch (err) {
      const error = err as Error;
      console.error('Failed to ban user:', error);
      setError(error.message || t('ban.error'));
      toast.error(error.message || t('ban.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!user.id) {
      setError('User ID is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authClient.admin.unbanUser({
        userId: user.id,
      });

      toast.success(t('unban.success'));
      // Trigger refresh
      triggerRefresh();
    } catch (err) {
      const error = err as Error;
      console.error('Failed to unban user:', error);
      setError(error.message || t('unban.error'));
      toast.error(error.message || t('unban.error'));
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
              {/* role */}
              <Badge
                variant={user.role === 'admin' ? 'default' : 'outline'}
                className="px-1.5"
              >
                {user.role || 'user'}
              </Badge>
              {/* email verified */}
              <Badge
                variant="outline"
                className="text-muted-foreground px-1.5 hover:bg-accent"
              >
                {user.emailVerified ? (
                  <MailCheckIcon className="stroke-green-500 dark:stroke-green-400" />
                ) : (
                  <MailQuestionIcon className="stroke-red-500 dark:stroke-red-400" />
                )}
                {user.emailVerified
                  ? t('email.verified')
                  : t('email.unverified')}
              </Badge>

              {/* user banned */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-muted-foreground px-1.5 hover:bg-accent"
                >
                  {user.banned ? (
                    <UserRoundXIcon className="stroke-red-500 dark:stroke-red-400" />
                  ) : (
                    <UserRoundCheckIcon className="stroke-green-500 dark:stroke-green-400" />
                  )}
                  {user.banned ? t('banned') : t('active')}
                </Badge>
              </div>
            </div>

            {/* information */}
            <div className="text-muted-foreground">
              {t('joined')}: {formatDate(user.createdAt)}
            </div>
            <div className="text-muted-foreground">
              {t('updated')}: {formatDate(user.updatedAt)}
            </div>
          </div>
          <Separator />

          {/* error */}
          {error && <div className="text-sm text-destructive">{error}</div>}

          {/* ban or unban user */}
          {user.banned ? (
            <div className="grid gap-4">
              <div className="text-muted-foreground">
                {t('ban.reason')}: {user.banReason}
              </div>
              {user.banExpires && (
                <div className="text-muted-foreground">
                  {t('ban.expires')}: {formatDate(user.banExpires)}
                </div>
              )}
              <Button
                variant="destructive"
                onClick={handleUnban}
                disabled={isLoading}
                className="mt-4 cursor-pointer"
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
                <Label>{t('ban.expires')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal cursor-pointer',
                        !banExpiresAt && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon />
                      {banExpiresAt ? (
                        formatDate(banExpiresAt)
                      ) : (
                        <span>{t('ban.selectDate')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={banExpiresAt}
                      onSelect={setBanExpiresAt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading || !banReason}
                className="mt-4 cursor-pointer"
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
