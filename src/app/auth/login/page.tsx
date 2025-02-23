import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Login",
  description: "Login to your account",
  canonicalUrl: `${siteConfig.url}/auth/login`,
});

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <LoginForm />
      <div className="text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms-of-service"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};

export default LoginPage;
