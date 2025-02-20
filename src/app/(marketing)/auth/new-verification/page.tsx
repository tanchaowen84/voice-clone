import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "New Verification",
  description: "New Verification",
  canonicalUrl: `${siteConfig.url}/auth/new-verification`,
});

const NewVerificationPage = () => {
  return <NewVerificationForm />;
};

export default NewVerificationPage;
