"use client";

import { HeaderSection } from "@/components/shared/header-section";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterCard() {
  return (
    <div className="w-full px-4 py-8 md:p-12 bg-muted rounded-lg">
      <div className="flex flex-col items-center justify-center gap-8">
        <HeaderSection
          labelAs="h2"
          label="Newsletter"
          title="Join the Community"
          titleAs="h3"
          subtitle="Subscribe to our newsletter for the latest news and updates"
        />

        <NewsletterForm />
      </div>
    </div>
  );
}
