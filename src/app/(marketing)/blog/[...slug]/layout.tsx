import Container from "@/components/container";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import type React from "react";

export default function BlogPostLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <Container className="mt-8">{children}</Container>

      <Container className="mt-16">
        <NewsletterCard />
      </Container>
    </div>
  );
}
