"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackButtonSmallProps {
  href?: string;
  className?: string;
}

export default function BackButtonSmall({
  href,
  className,
}: BackButtonSmallProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className={cn("size-8 px-0", className)}
      asChild
    >
      {/* if href is provided, use it, otherwise use the router.back() */}
      <Link href={href || "#"} onClick={handleBack}>
        <ArrowLeftIcon className="size-5" />
      </Link>
    </Button>
  );
}
