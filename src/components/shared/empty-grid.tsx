import { useTranslations } from 'next-intl';

export default function EmptyGrid() {
  const t = useTranslations('BlogPage');

  return (
    <div>
      <div className="my-8 h-32 w-full flex items-center justify-center">
        <p className="font-medium text-muted-foreground">{t('noPostsFound')}</p>
      </div>
    </div>
  );
}
