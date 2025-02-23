"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Icons } from "@/components/icons/icons";
import { authClient } from "@/lib/auth-client";

export const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    const { data, error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/auth/reset-password",
    }, {
      onRequest: (ctx) => {
        // console.log("forgotPassword, request:", ctx.url);
        setIsPending(true);
        setError("");
        setSuccess("");
      },
      onResponse: (ctx) => {
        // console.log("forgotPassword, response:", ctx.response);
        setIsPending(false);
      },
      onSuccess: (ctx) => {
        // console.log("forgotPassword, success:", ctx.data);
        setSuccess("Please check your email inbox");
      },
      onError: (ctx) => {
        console.log("forgotPassword, error:", ctx.error);
        setError(ctx.error.message);
      },
    });
  };

  return (
    <AuthCard
      headerLabel="Froget password?"
      bottomButtonLabel="Back to login"
      bottomButtonHref="/auth/login"
      className="border-none"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="name@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            size="lg"
            type="submit"
            className="w-full flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Icons.spinner className="w-4 h-4 animate-spin" />
            ) : (
              ""
            )}
            <span>Send reset password email</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
