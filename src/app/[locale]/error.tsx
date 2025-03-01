"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Learned how to recover from a server component error in Next.js from @asidorenko_
 *
 * https://x.com/asidorenko_/status/1841547623712407994
 */
export default function ErrorPage({ reset }: { reset: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo className="size-12" />

      <h1 className="text-2xl text-center">Oops! Something went wrong!</h1>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="default"
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              router.refresh();
              reset();
            });
          }}
        >
          {isPending ? (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          ) : (
            ""
          )}
          Try again
        </Button>

        <Button
          type="submit"
          variant="outline"
          onClick={() => router.push("/")}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}
