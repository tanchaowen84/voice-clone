import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Login",
  description: "Login to your account",
  canonicalUrl: `${siteConfig.url}/auth/login`,
});

const LoginPage = () => {
  return <LoginForm className="border-none" />;
};

export default LoginPage;
