import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";

export default function BuiltWithButton() {
  return (
    <Link
      target="_blank"
      href="https://mksaas.com?utm_source=mksaas&utm_medium=website&utm_campaign=built-with-mksaas-button&utm_content=built-with-mksaas"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "px-4 rounded-md",
      )}
    >
      <span>Built with</span>
      <span>
        <Logo className="size-5 rounded-full" />
      </span>
      <span className="font-semibold">MkSaaS</span>
    </Link>
  );
}
