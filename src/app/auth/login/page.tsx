import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { AUTH_ROUTE_LOGIN } from "@/routes";

export const metadata = constructMetadata({
  title: "Login",
  description: "Login to your account",
  canonicalUrl: `${siteConfig.url}${AUTH_ROUTE_LOGIN}`,
});

const LoginPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <LoginForm />
      <div className="text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
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
