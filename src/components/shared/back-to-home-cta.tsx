import { Button } from '@/components/ui/button';
import { LocaleLink } from '@/i18n/navigation';
import { Routes } from '@/routes';
import { ArrowLeft, Home } from 'lucide-react';

interface BackToHomeCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function BackToHomeCTA({
  title = 'Explore More AI Tools',
  description = 'Discover our complete suite of voice and audio AI tools to enhance your content creation workflow.',
  buttonText = 'Voice Clone',
}: BackToHomeCTAProps) {
  return (
    <div className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <LocaleLink href={Routes.Root}>
              <Button size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                {buttonText}
              </Button>
            </LocaleLink>

            <LocaleLink href={Routes.Tools}>
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                All Tools
              </Button>
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
