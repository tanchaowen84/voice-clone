import { CustomMDXContent } from '@/components/shared/custom-mdx-content';
import { formatDate } from '@/lib/formatter';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface CustomPageProps {
  title: string;
  description: string;
  date: string;
  content: any; // MDX content
}

export function CustomPage({
  title,
  description,
  date,
  content,
}: CustomPageProps) {
  const formattedDate = formatDate(new Date(date));

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
      <Card className="mb-8">
        <CardContent>
          <div className="max-w-none prose prose-neutral dark:prose-invert prose-img:rounded-lg">
            <CustomMDXContent
              code={content}
              includeFumadocsComponents={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
