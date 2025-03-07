"use client";

import { buttonVariants } from "@/components/ui/button";
import { LocaleLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BottomButtonProps {
  href: string
  label: string;
}

/**
 * TODO: solve this error: href={href as any}
 */
export const BottomButton = ({ href, label }: BottomButtonProps) => {
  return (
    <LocaleLink
      href={href as any}
      className={cn(
        buttonVariants({ variant: "link", size: "sm" }),
        "font-normal w-full text-muted-foreground hover:underline underline-offset-4 hover:text-primary"
      )}
    >
      {label}
    </LocaleLink>
  );
};
