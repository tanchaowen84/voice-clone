import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Navigation APIs
 * 
 * https://next-intl.dev/docs/routing/navigation
 */
export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
