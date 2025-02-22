"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function AllPostsButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      className="inline-flex items-center gap-2 group"
      asChild
    >
      <Link href="/blog" prefetch={false}>
        <ArrowLeftIcon
          className="w-5 h-5 
                    transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>All Posts</span>
      </Link>
    </Button>
  );
}
