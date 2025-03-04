import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { constructMetadata } from "@/lib/metadata";
import { Routes } from "@/routes";
import { useTranslations } from "next-intl";

export const metadata = constructMetadata({
  title: "Login",
  description: "Login to your account",
  canonicalUrl: `${siteConfig.url}${Routes.Login}`,
});

/**
 * TODO: href={Routes.TermsOfService as any}
 */
const LoginPage = () => {
  const t = useTranslations("AuthPage.login");

  return (
    <div className="flex flex-col gap-4">
      <LoginForm />
      <div className="text-balance text-center text-xs text-muted-foreground">
        {t("byClickingContinue")}
        <Link
          href={Routes.TermsOfService as any}
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("termsOfService")}
        </Link>{" "}
        {t("and")}{" "}
        <Link
          href={Routes.PrivacyPolicy as any}
          className="underline underline-offset-4 hover:text-primary"
        >
          {t("privacyPolicy")}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
