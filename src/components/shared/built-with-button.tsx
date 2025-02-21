import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function BuiltWithButton() {
  return (
    <Link
      target="_blank"
      href="https://mkdirs.com?utm_source=mkdirs&utm_medium=website&utm_campaign=built-with-mkdirs-button&utm_content=built-with-mkdirs"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "px-4 rounded-md",
      )}
    >
      <span>Built with</span>
      <span>
        <Logo className="size-4 rounded-full" />
      </span>
      <span className="font-bold">MkSaaS</span>
    </Link>
  );
}
