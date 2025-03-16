"use client";

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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function ContactFormCard() {
  const t = useTranslations('ContactPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>('');

  // Create a schema for contact form validation
  const formSchema = z.object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters' })
      .max(30, { message: 'Name must not exceed 30 characters' }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' }),
    message: z
      .string()
      .min(10, { message: 'Message must be at least 10 characters' })
      .max(500, { message: 'Message must not exceed 500 characters' }),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Here you would typically send the form data to your API
      console.log('Form submitted:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast.success('Your message has been sent successfully!');
      
      // Reset form
      form.reset();
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to send your message. Please try again.');
      toast.error('Failed to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t('title')}</CardTitle>
        <CardDescription>{t('formDescription')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('name')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('message')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('message')}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormError message={error} />
          </CardContent>
          <CardFooter className="px-6 py-4 flex justify-between items-center bg-muted">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : t('submit')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 