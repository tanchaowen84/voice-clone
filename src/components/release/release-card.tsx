import { getLocaleDate } from '@/lib/utils';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MDXContent } from '@content-collections/mdx/react';
import defaultMdxComponents from 'fumadocs-ui/mdx';

interface ReleaseCardProps {
  title: string;
  description: string;
  date: string;
  version: string;
  content: any; // MDX content
}

export function ReleaseCard({
  title,
  description,
  date,
  version,
  content,
}: ReleaseCardProps) {
  const formattedDate = getLocaleDate(date);

  return (
    <Card className="mb-8">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Badge variant="default" className="w-fit">
            <TagIcon className="mr-1 size-3" />
            {version}
          </Badge>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="max-w-none prose prose-neutral dark:prose-invert prose-img:rounded-lg">
          <MDXContent code={content} components={defaultMdxComponents} />
        </div>
      </CardContent>
    </Card>
  );
}
