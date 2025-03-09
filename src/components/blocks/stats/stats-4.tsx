/**
 * https://nsui.irung.me/stats
 *
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/stats-4.json
 *
 * 1. fix number text colors
 */
export default function Stats4() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="relative z-10 max-w-xl space-y-6">
          <h2 className="text-4xl font-medium lg:text-5xl">
            The Gemini ecosystem brings together our models.
          </h2>
          <p>
            Gemini is evolving to be more than just the models.{' '}
            <span className="font-medium">It supports an entire ecosystem</span>{' '}
            — from products innovate.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div>
            <p>
              It supports an entire ecosystem — from products to the APIs and
              platforms helping developers and businesses innovate
            </p>
            <div className="mb-12 mt-12 grid grid-cols-2 gap-2 md:mb-0">
              <div className="space-y-4">
                <div className="bg-transparent text-primary text-5xl font-bold">
                  +1200
                </div>
                <p>Stars on GitHub</p>
              </div>
              <div className="space-y-4">
                <div className="bg-transparent text-primary text-5xl font-bold">
                  +500
                </div>
                <p>Powered Apps</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <blockquote className="border-l-4 pl-4">
              <p>
                Using TailsUI has been like unlocking a secret design
                superpower. It's the perfect fusion of simplicity and
                versatility, enabling us to create UIs that are as stunning as
                they are user-friendly.
              </p>

              <div className="mt-6 space-y-3">
                <cite className="block font-medium">John Doe, CEO</cite>
                <img
                  className="h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nvidia.svg"
                  alt="Nvidia Logo"
                  height="20"
                  width="auto"
                />
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
