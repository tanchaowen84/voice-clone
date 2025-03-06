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
import { ResetPasswordSchema } from "@/lib/schemas";
import { Routes } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    notFound();
  }

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("AuthPage.resetPassword");

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const { data, error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    }, {
      onRequest: (ctx) => {
        // console.log("resetPassword, request:", ctx.url);
        setIsPending(true);
        setError("");
        setSuccess("");
      },
      onResponse: (ctx) => {
        // console.log("resetPassword, response:", ctx.response);
        setIsPending(false);
      },
      onSuccess: (ctx) => {
        // console.log("resetPassword, success:", ctx.data);
        // setSuccess("Password reset successfully");
        router.push(`${Routes.Login}`);
      },
      onError: (ctx) => {
        console.log("resetPassword, error:", ctx.error);
        setError(ctx.error.message);
      },
    });
  };

  return (
    <AuthCard
      headerLabel={t("title")}
      bottomButtonLabel={t("backToLogin")}
      bottomButtonHref={`${Routes.Login}`}
      className="border-none"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
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
            <span>{t("reset")}</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
