import { NewPasswordForm } from "@/components/auth/new-password-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "New Password",
  description: "Set a new password",
  canonicalUrl: `${siteConfig.url}/auth/new-password`,
});

const NewPasswordPage = () => {
  return <NewPasswordForm />;
};

export default NewPasswordPage;
