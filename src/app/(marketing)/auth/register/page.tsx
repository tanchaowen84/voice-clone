import { RegisterForm } from "@/components/auth/register-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Register",
  description: "Create an account to get started",
  canonicalUrl: `${siteConfig.url}/auth/register`,
});

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
