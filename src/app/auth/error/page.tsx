import { ErrorCard } from "@/components/auth/error-card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Auth Error",
  description: "Auth Error",
  canonicalUrl: `${siteConfig.url}/auth/error`,
});

const AuthErrorPage = () => {
  return <ErrorCard />;
};

export default AuthErrorPage;
