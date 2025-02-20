"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/auth/auth-dialog";
import { LoginForm } from "@/components/auth/login-form";
import { useMediaQuery } from "@/hooks/use-media-query";
// import { authRoutes } from "@/routes";
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
    router.push("/auth/login");
  };

  // Close the modal on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    setIsModalOpen(false);
  }, [pathname, searchParams]);

  // don't open the modal if the user is already in the auth pages
  // keep isTablet or isDesktop open, if user resizes the window
  
  // TODO: add auth routes
  // const isAuthRoute = authRoutes.includes(pathname);
  if (mode === "modal" && /* !isAuthRoute &&  */(isTablet || isDesktop)) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 bg-transparent border-none">
          <DialogHeader>
            {/* `DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users. */}
            <DialogTitle />
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  );
};
