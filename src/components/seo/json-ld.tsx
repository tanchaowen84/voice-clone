interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script suppressHydrationWarning type="application/ld+json">
      {json}
    </script>
  );
}
