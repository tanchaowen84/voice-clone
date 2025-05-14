/**
 * Tailwind Indicator, shows the current tailwind breakpoint
 */
export function TailwindIndicator() {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-10 right-10 z-50 flex size-10 items-center justify-center rounded-full bg-gray-800 p-3 text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:max-md:block">sm</div>
      <div className="hidden md:max-lg:block">md</div>
      <div className="hidden lg:max-xl:block">lg</div>
      <div className="hidden xl:max-2xl:block">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
}
