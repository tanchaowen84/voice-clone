import { ErrorCard } from "@/components/auth/error-card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { AUTH_ROUTE_ERROR } from "@/routes";

export const metadata = constructMetadata({
  title: "Auth Error",
  description: "Auth Error",
  canonicalUrl: `${siteConfig.url}${AUTH_ROUTE_ERROR}`,
});

const AuthErrorPage = () => {
  return <ErrorCard />;
};

export default AuthErrorPage;
