import type { MarketingConfig } from "@/types";

export const marketingConfig: MarketingConfig = {
  menus: [
    {
      title: "Features",
      href: "/#features",
      icon: "features",
    },
    {
      title: "Pricing",
      href: "/#pricing",
      icon: "pricing",
    },
    {
      title: "Blog",
      href: "/blog",
      icon: "blog",
    },
    {
      title: "Pages",
      href: "#",
      icon: "about",
      items: [
        {
          title: "Waitlist",
          href: "/waitlist",
          icon: "about",
        },
        {
          title: "Contact",
          href: "/contact",
          icon: "about",
        },
        {
          title: "About",
          href: "/about",
          icon: "about",
        },
      ],
    },
  ],
};
