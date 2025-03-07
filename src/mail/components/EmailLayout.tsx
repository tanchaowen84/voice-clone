import {
  Container,
  Font,
  Head,
  Html,
  Section,
  Tailwind,
} from "@react-email/components";
import React, { type PropsWithChildren } from "react";

/**
 * Email Layout
 * 
 * https://react.email/docs/components/tailwind
 */
export default function EmailLayout({ children }: PropsWithChildren) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Section className="bg-background p-4">
          <Container className="rounded-lg bg-card p-6 text-card-foreground">
            {children}
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
