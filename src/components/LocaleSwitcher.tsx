import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

/**
 * This component is used to render a locale switcher.
 */
export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {routing.locales.map((item) => (
        <option key={item} value={item}>
          {t("locale", { locale: item })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
