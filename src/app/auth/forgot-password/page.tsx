import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { AUTH_ROUTE_FORGOT_PASSWORD } from "@/routes";

export const metadata = constructMetadata({
  title: "Forgot Password",
  description: "Forgot your password? Reset it.",
  canonicalUrl: `${siteConfig.url}${AUTH_ROUTE_FORGOT_PASSWORD}`,
});

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
