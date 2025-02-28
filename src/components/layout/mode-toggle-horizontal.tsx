"use client";

import { Button } from "@/components/ui/button";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ModeToggleHorizontal() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only show the UI after hydration to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 rounded-full border bg-background p-1">
        <div className="size-6 px-0 rounded-full" />
        <div className="size-6 px-0 rounded-full" />
        <div className="size-6 px-0 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background p-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-6 px-0 rounded-full",
          theme === "light" && "bg-muted text-foreground"
        )}
        onClick={() => setTheme("light")}
        aria-label="Light mode"
      >
        <SunIcon className="size-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-6 px-0 rounded-full",
          theme === "dark" && "bg-muted text-foreground"
        )}
        onClick={() => setTheme("dark")}
        aria-label="Dark mode"
      >
        <MoonIcon className="size-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "size-6 px-0 rounded-full",
          theme === "system" && "bg-muted text-foreground"
        )}
        onClick={() => setTheme("system")}
        aria-label="System mode"
      >
        <LaptopIcon className="size-4" />
      </Button>
    </div>
  );
}