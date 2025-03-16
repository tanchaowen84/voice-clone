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
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

/**
 * update user name
 * 
 * NOTICE: we update username instead of name in user table
 * 
 * TODO: by default, username is empty, how can we show the username after signup?
 * 
 * https://www.better-auth.com/docs/plugins/username
 */
export function UpdateNameCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const { data: session, refetch } = authClient.useSession();

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
      name: session?.user?.username || '',
    },
  });

  useEffect(() => {
    if (session?.user?.username) {
      form.setValue('name', session.user.username);
    }
  }, [session, form]);

  // Check if user exists after all hooks are initialized
  const user = session?.user;
  if (!user) {
    return null;
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Don't update if the name hasn't changed
    if (values.name === session?.user?.username) {
      console.log("No changes to save");
      return;
    }

    const { data, error } = await authClient.updateUser(
      {
        username: values.name,
      },
      {
        onRequest: (ctx) => {
          // console.log('update name, request:', ctx.url);
          setIsSaving(true);
          setError('');
        },
        onResponse: (ctx) => {
          // console.log('update name, response:', ctx.response);
          setIsSaving(false);
        },
        onSuccess: (ctx) => {
          // update name success, user information stored in ctx.data
          // console.log("update name, success:", ctx.data);
          toast.success(t('name.success'));
          refetch();
          form.reset();
        },
        onError: (ctx) => {
          // update name fail, display the error message
          console.error('update name, error:', ctx.error);
          setError(`${ctx.error.status}: ${ctx.error.message}`);
          toast.error(t('name.fail'));
        },
      });
  };

  return (
    <Card className="max-w-md md:max-w-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          {t('name.title')}
        </CardTitle>
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
            <FormError message={error} />
          </CardContent>
          <CardFooter className="px-6 py-4 flex justify-between items-center bg-muted rounded-none">
            <p className="text-sm text-muted-foreground">
              {t('name.hint')}
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