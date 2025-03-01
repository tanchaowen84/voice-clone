import { getTranslations, setRequestLocale } from 'next-intl/server';

interface AboutPageProps {
  params: { locale: string };
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('AboutPage');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
