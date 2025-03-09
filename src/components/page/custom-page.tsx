import { Mdx } from '@/components/shared/mdx-component';
import { getLocaleDate } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface CustomPageProps {
  title: string;
  description: string;
  date: string;
  content: any; // MDX content
}

export function CustomPage({ title, description, date, content }: CustomPageProps) {
  const formattedDate = getLocaleDate(date);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center justify-center gap-2">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <Mdx code={content} />
      </div>
    </div>
  );
} 