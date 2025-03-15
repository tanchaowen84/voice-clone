'use client';

import { FormError } from '@/components/shared/form-error';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Delete user account
 * 
 * This component allows users to permanently delete their account.
 * It includes a confirmation dialog to prevent accidental deletions.
 */
export function DeleteAccountCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const { data: session, refetch } = authClient.useSession();
  const router = useLocaleRouter();

  // Check if user exists
  const user = session?.user;
  if (!user) {
    return null;
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    await authClient.deleteUser(
      {},
      {
        onRequest: () => {
          setIsDeleting(true);
          setError('');
        },
        onResponse: () => {
          setIsDeleting(false);
        },
        onSuccess: () => {
          toast.success(t('deleteAccount.success'));
          refetch();
          router.push('/');
        },
        onError: (ctx) => {
          console.error('delete account error:', ctx.error);
          // { "message": "Session expired. Re-authenticate to perform this action.", "code": "SESSION_EXPIRED_REAUTHENTICATE_TO_PERFORM_THIS_ACTION", "status": 400, "statusText": "BAD_REQUEST" }
          setError(`${ctx.error.status}: ${ctx.error.message}`);
          toast.error(t('deleteAccount.fail'));
        },
      }
    );
  };

  return (
    <Card className="max-w-md md:max-w-lg border-destructive/50">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-destructive">{t('deleteAccount.title')}</CardTitle>
        <CardDescription>
          {t('deleteAccount.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t('deleteAccount.warning')}
        </p>

        <div className="mt-4">
          <FormError message={error} />
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 flex justify-end items-center bg-muted">
        <Button
          variant="destructive"
          onClick={() => setShowConfirmation(true)}
        >
          {t('deleteAccount.button')}
        </Button>
      </CardFooter>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">{t('deleteAccount.confirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('deleteAccount.confirmDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleteAccount.deleting') : t('deleteAccount.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 