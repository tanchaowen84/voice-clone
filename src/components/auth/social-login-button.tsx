"use client";

import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaBrandsGitHub } from "@/components/icons/github";
import { FaBrandsGoogle } from "@/components/icons/google";
import { authClient } from "@/lib/auth-client";

/**
 * social login buttons
 */
export const SocialLoginButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState<"google" | "github" | null>(null);

  const onClick = async (provider: "google" | "github") => {
    // setIsLoading(provider);
    // signIn(provider, {
    //   callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    // });
    // no need to reset the loading state, keep loading before webpage redirects
    // setIsLoading(null);

    await authClient.signIn.social({
      /**
       * The social provider id
       * @example "github", "google", "apple"
       */
      provider: "github",
      /**
       * a url to redirect after the user authenticates with the provider
       * @default "/"
       */
      callbackURL: "/dashboard",
      /**
       * a url to redirect if an error occurs during the sign in process
       */
      errorCallbackURL: "/auth/error",
      /**
       * a url to redirect if the user is newly registered
       */
      // newUserCallbackURL: "/auth/welcome",
      /**
       * disable the automatic redirect to the provider. 
       * @default false
       */
      // disableRedirect: true,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      // disabled={isLoading === "google"}
      >
        {isLoading === "google" ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <FaBrandsGoogle className="size-5 mr-2" />
        )}
        <span>Login with Google</span>
      </Button>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      // disabled={isLoading === "github"}
      >
        {isLoading === "github" ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <FaBrandsGitHub className="size-5 mr-2" />
        )}
        <span>Login with GitHub</span>
      </Button>
    </div>
  );
};
