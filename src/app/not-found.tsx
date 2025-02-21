import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo className="size-12" />

      <h1 className="text-4xl font-bold">404</h1>

      <p className="text-balance text-center text-xl font-medium px-4">
        Sorry, the page you are looking for does not exist.
      </p>

      <Button asChild size="lg" variant="default">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
