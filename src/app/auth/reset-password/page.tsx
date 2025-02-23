import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Reset Password",
  description: "Set a new password",
  canonicalUrl: `${siteConfig.url}/auth/reset-password`,
});

const ResetPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
