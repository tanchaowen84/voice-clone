"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { Icons } from "@/components/icons/icons";
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
import { authClient } from "@/lib/auth-client";
import { LoginSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export const LoginForm = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    // 1. if callbackUrl is provided, user will be redirected to the callbackURL after login successfully.
    // if user email is not verified, a new verification email will be sent to the user with the callbackURL.
    // 2. if callbackUrl is not provided, we should redirect manually in the onSuccess callback.
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: callbackUrl || "/dashboard",
    }, {
      onRequest: (ctx) => {
        // console.log("login, request:", ctx.url);
        setIsPending(true);
        setError("");
        setSuccess("");
      },
      onResponse: (ctx) => {
        // console.log("login, response:", ctx.response);
        setIsPending(false);
      },
      onSuccess: (ctx) => {
        // console.log("login, success:", ctx.data);
        // setSuccess("Login successful");
        // router.push(callbackUrl || "/dashboard");
      },
      onError: (ctx) => {
        console.log("login, error:", ctx.error);
        setError(ctx.error.message);
      },
    });
  };

  return (
    <AuthCard
      headerLabel="Welcome back"
      bottomButtonLabel="Don't have an account? Sign up"
      bottomButtonHref="/auth/register"
      showSocialLoginButton
      className={cn("", className)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal text-muted-foreground"
                    >
                      <Link href="/auth/forgot-password" className="text-xs underline">
                        Forgot password?
                      </Link>
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
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
            <span>Login</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
