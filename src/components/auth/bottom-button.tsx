"use client";

import { Button } from "@/components/ui/button";

interface BottomButtonProps {
  href: string;
  label: string;
}

export const BottomButton = ({ href, label }: BottomButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full text-muted-foreground"
      size="sm"
      asChild
    >
      <a href={href} className="hover:underline underline-offset-4 hover:text-primary">
        {label}
      </a>
    </Button>
  );
};
