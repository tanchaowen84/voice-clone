import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

/**
 * https://nsui.irung.me/content-4
 * 
 * pnpm dlx shadcn@canary add https://nsui.irung.me/r/content-4.json
 */
export default function Content4() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">The Lyra ecosystem brings together our models, products and platforms.</h2>
          <div className="space-y-6">
            <p>Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.</p>
            <p>
              Tailus UI. <span className="font-bold">It supports an entire ecosystem</span> — from products innovate. Sit minus, quod debitis autem quia aspernatur delectus impedit modi, neque non id ad dignissimos? Saepe deleniti perferendis beatae.
            </p>
            <Button asChild variant="secondary" size="sm" className="gap-1 pr-1.5">
              <Link href="#">
                <span>Learn More</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
