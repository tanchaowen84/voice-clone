import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

/**
 * https://nsui.irung.me/pricing
 */
export default function Pricing3() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing that Scales with You
          </h1>
          <p>
            Gemini is evolving to be more than just the models. It supports an
            entire to the APIs and platforms helping developers and businesses
            innovate.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-medium">Free</CardTitle>

              <span className="my-3 block text-2xl font-semibold">$0 / mo</span>

              <CardDescription className="text-sm">Per editor</CardDescription>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Basic Analytics Dashboard",
                  "5GB Cloud Storage",
                  "Email and Chat Support",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="relative">
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full px-3 py-1 text-xs font-medium bg-primary text-primary-foreground">
              Popular
            </span>

            <CardHeader>
              <CardTitle className="font-medium">Pro</CardTitle>

              <span className="my-3 block text-2xl font-semibold">
                $19 / mo
              </span>

              <CardDescription className="text-sm">Per editor</CardDescription>

              <Button asChild className="mt-4 w-full">
                <Link href="">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Free Plan",
                  "5GB Cloud Storage",
                  "Email and Chat Support",
                  "Access to Community Forum",
                  "Single User Access",
                  "Access to Basic Templates",
                  "Mobile App Access",
                  "1 Custom Report Per Month",
                  "Monthly Product Updates",
                  "Standard Security Features",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Startup</CardTitle>

              <span className="my-3 block text-2xl font-semibold">
                $29 / mo
              </span>

              <CardDescription className="text-sm">Per editor</CardDescription>

              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="">Get Started</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Pro Plan",
                  "5GB Cloud Storage",
                  "Email and Chat Support",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
