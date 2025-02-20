"use client";

// import { reset } from "@/actions/reset";
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
import { ResetSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Icons } from "../icons/icons";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    // startTransition(() => {
    //   reset(values)
    //     .then((data) => {
    //       if (data.status === "error") {
    //         console.log("reset, error:", data.message);
    //         setError(data.message);
    //       }
    //       if (data.status === "success") {
    //         console.log("reset, success:", data.message);
    //         setSuccess(data.message);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("reset, error:", error);
    //       setError("Something went wrong");
    //     });
    // });
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
            <span>Send reset email</span>
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
