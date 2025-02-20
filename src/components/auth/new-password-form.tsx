"use client";

// import { newPassword } from "@/actions/new-password";
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
import { NewPasswordSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    // startTransition(() => {
    //   newPassword(values, token)
    //     .then((data) => {
    //       if (data?.status === "error") {
    //         console.log("newPassword, error:", data.message);
    //         setError(data.message);
    //       }

    //       if (data?.status === "success") {
    //         console.log("newPassword, success:", data.message);
    //         setSuccess(data.message);
    //       }
    //     })
    //     .catch(() => {
    //       console.log("newPassword, error:", error);
    //       setError("Something went wrong");
    //     });
    // });
  };

  return (
    <AuthCard
      headerLabel="Reset password"
      bottomButtonLabel="Back to login"
      bottomButtonHref="/auth/login"
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
                  <FormLabel>Password</FormLabel>
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
            <span>Reset password</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
