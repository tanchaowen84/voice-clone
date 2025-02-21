import type { UserButtonConfig } from "@/types";

export const userButtonConfig: UserButtonConfig = {
  menus: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
    {
      title: "Submit Directory",
      href: "/submit",
      icon: "submit",
    },
  ],
};
