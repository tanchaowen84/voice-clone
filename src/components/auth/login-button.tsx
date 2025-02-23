"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AUTH_ROUTE_LOGIN, authRoutes } from "@/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginWrapperProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginWrapper = ({
  children,
  mode = "redirect",
  asChild,
}: LoginWrapperProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTablet, isDesktop } = useMediaQuery();

  const handleLogin = () => {
    router.push(`${AUTH_ROUTE_LOGIN}`);
  };

  // Close the modal on route change
  useEffect(() => {
    setIsModalOpen(false);
  }, [pathname, searchParams]);

  // 1. don't open the modal if the user is already in the auth pages
  // 2. keep isTablet or isDesktop open, if user resizes the window
  const isAuthRoute = authRoutes.includes(pathname);
  if (mode === "modal" && !isAuthRoute && (isTablet || isDesktop)) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0">
          <DialogHeader>
            {/* `DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users. */}
            <DialogTitle />
          </DialogHeader>
          <LoginForm className="" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  );
};
