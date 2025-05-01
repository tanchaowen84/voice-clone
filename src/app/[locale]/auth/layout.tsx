import BackButtonSmall from '@/components/shared/back-button-small';

/**
 * auth layout is different from other public layouts,
 * so auth directory is not put in (public) directory.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <BackButtonSmall className="absolute top-6 left-6" />
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}
