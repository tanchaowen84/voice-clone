'use client';

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
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function UpdatePasswordCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { data: session, error } = authClient.useSession();

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
    setIsSaving(true);

    // Here you would typically send the data to your server
    // For now, we're just simulating the request
    setTimeout(() => {
      setIsSaving(false);
      form.reset();
      // In a real implementation, you would handle the response from your server
    }, 1000);
  };

  return (
    <Card className="max-w-md md:max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t('password.title')}</CardTitle>
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
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
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
          </CardContent>
          <CardFooter className="px-6 py-4 flex justify-between items-center bg-muted">
            <p className="text-sm text-muted-foreground">
              {t('password.newMinLength')}
            </p>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('saving') : t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 