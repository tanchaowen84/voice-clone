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
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteAccountCardProps {
  className?: string;
}

/**
 * Delete user account
 * 
 * This component allows users to permanently delete their account.
 * It includes a confirmation dialog to prevent accidental deletions.
 */
export function DeleteAccountCard({ className }: DeleteAccountCardProps) {
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
    await authClient.deleteUser(
      {},
      {
        onRequest: () => {
          setIsDeleting(true);
          setError('');
        },
        onResponse: () => {
          setIsDeleting(false);
          setShowConfirmation(false);
        },
        onSuccess: () => {
          toast.success(t('deleteAccount.success'));
          refetch();
          router.replace('/');
        },
        onError: (ctx) => {
          console.error('delete account error:', ctx.error);
          // { "message": "Session expired. Re-authenticate to perform this action.", 
          // "code": "SESSION_EXPIRED_REAUTHENTICATE_TO_PERFORM_THIS_ACTION", 
          // "status": 400, "statusText": "BAD_REQUEST" }
          // set freshAge to 0 to disable session refreshness check for user deletion
          setError(`${ctx.error.status}: ${ctx.error.message}`);
          toast.error(t('deleteAccount.fail'));
        },
      }
    );
  };

  return (
    <Card className={cn("w-full max-w-lg md:max-w-xl border-destructive/50 overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-destructive">
          {t('deleteAccount.title')}
        </CardTitle>
        <CardDescription>
          {t('deleteAccount.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t('deleteAccount.warning')}
        </p>

        {error && (
          <div className="mt-4">
            <FormError message={error} />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 py-4 flex justify-end items-center bg-muted rounded-none">
        <Button
          variant="destructive"
          onClick={() => setShowConfirmation(true)}
        >
          {t('deleteAccount.button')}
        </Button>
      </CardFooter>

      {/* Confirmation AlertDialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t('deleteAccount.confirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteAccount.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3">
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
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 