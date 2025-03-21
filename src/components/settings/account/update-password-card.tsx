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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';

interface UpdatePasswordCardProps {
  className?: string;
}

/**
 * Update user password
 * 
 * This component allows users to update their password.
 * NOTE: This should only be used for users with credential providers (email/password login).
 * For conditional rendering based on provider type, use ConditionalUpdatePasswordCard instead.
 * 
 * @see ConditionalUpdatePasswordCard
 * @see https://www.better-auth.com/docs/authentication/email-password#update-password
 */
export function UpdatePasswordCard({ className }: UpdatePasswordCardProps) {
  const router = useLocaleRouter();
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const { data: session } = authClient.useSession();

  // Create a schema for password validation
  const formSchema = z.object({
    currentPassword: z
      .string()
      .min(1, { message: t('password.currentRequired') }),
    newPassword: z
      .string()
      .min(8, { message: t('password.newMinLength') }),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  // Check if user exists after all hooks are initialized
  const user = session?.user;
  if (!user) {
    return null;
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await authClient.changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      },
      {
        onRequest: (ctx) => {
          // console.log('update password, request:', ctx.url);
          setIsSaving(true);
          setError('');
        },
        onResponse: (ctx) => {
          // console.log('update password, response:', ctx.response);
          setIsSaving(false);
        },
        onSuccess: (ctx) => {
          // update password success, user information stored in ctx.data
          // console.log("update password, success:", ctx.data);
          toast.success(t('password.success'));
          router.refresh();
          form.reset();
        },
        onError: (ctx) => {
          // update password fail, display the error message
          // { "message": "Invalid password", "code": "INVALID_PASSWORD", "status": 400, "statusText": "BAD_REQUEST" }
          console.error('update password, error:', ctx.error);
          setError(`${ctx.error.status}: ${ctx.error.message}`);
          toast.error(t('password.fail'));
        },
      });
  };

  return (
    <Card className={cn("w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-0", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {t('password.title')}
        </CardTitle>
        <CardDescription>
          {t('password.description')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('password.currentPassword')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder={t('password.currentPassword')}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showCurrentPassword ? t('password.hidePassword') : t('password.showPassword')}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password.newPassword')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder={t('password.newPassword')}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                        <span className="sr-only">
                          {showNewPassword ? t('password.hidePassword') : t('password.showPassword')}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
          </CardContent>
          <CardFooter className="mt-6 px-6 py-4 flex justify-between items-center bg-muted rounded-none">
            <p className="text-sm text-muted-foreground">
              {t('password.hint')}
            </p>

            <Button type="submit" disabled={isSaving} className="cursor-pointer">
              {isSaving ? t('saving') : t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 