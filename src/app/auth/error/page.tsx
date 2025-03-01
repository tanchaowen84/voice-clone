import { ErrorCard } from "@/components/auth/error-card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { Routes } from "@/routes";

export const metadata = constructMetadata({
  title: "Auth Error",
  description: "Auth Error",
  canonicalUrl: `${siteConfig.url}${Routes.AuthError}`,
});

const AuthErrorPage = () => {
  return <ErrorCard />;
};

export default AuthErrorPage;
