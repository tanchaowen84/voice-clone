import BackButtonSmall from "@/components/shared/back-button-small";

/**
 * auth layout is different from other public layouts,
 * so auth directory is not put in (public) directory.
 *
 * https://ui.shadcn.com/blocks#authentication-04
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center relative w-full h-full min-h-screen">
      <BackButtonSmall className="absolute top-6 left-6" />
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
