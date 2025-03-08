"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { LocaleLink } from "@/i18n/navigation";

export default function AllPostsButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      className="inline-flex items-center gap-2 group"
      asChild
    >
      <LocaleLink href="/blog">
        <ArrowLeftIcon
          className="w-5 h-5 
                    transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>All Posts</span>
      </LocaleLink>
    </Button>
  );
}
