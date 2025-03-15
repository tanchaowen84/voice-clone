'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { authClient } from '@/lib/auth-client';
import { User2Icon } from 'lucide-react';

export function UpdateNameCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { data: session, error } = authClient.useSession();

  // Create a schema for name validation
  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: t('name.minLength') })
      .max(30, { message: t('name.maxLength') }),
  });

  // Initialize the form with empty string as fallback if user.name is undefined
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user?.name || '',
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
      // In a real implementation, you would handle the response from your server
    }, 1000);
  };

  return (
    <Card className="max-w-md md:max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t('name.title')}</CardTitle>
        <CardDescription>
          {t('name.description')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t('name.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="px-6 py-4 flex justify-between items-center bg-muted">
            <p className="text-sm text-muted-foreground">
              {t('name.maxLength')}
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