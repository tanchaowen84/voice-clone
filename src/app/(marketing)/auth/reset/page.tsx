import { ResetForm } from "@/components/auth/reset-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Reset Password",
  description: "Reset your password",
  canonicalUrl: `${siteConfig.url}/auth/reset`,
});

const ResetPage = () => {
  return <ResetForm />;
};

export default ResetPage;
