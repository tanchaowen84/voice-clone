import { RegisterForm } from "@/components/auth/register-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { AUTH_ROUTE_REGISTER } from "@/routes";

export const metadata = constructMetadata({
  title: "Register",
  description: "Create an account to get started",
  canonicalUrl: `${siteConfig.url}${AUTH_ROUTE_REGISTER}`,
});

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
