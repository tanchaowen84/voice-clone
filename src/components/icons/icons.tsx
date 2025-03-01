import {
  ArrowRightIcon,
  BadgeDollarSignIcon,
  BookOpenIcon,
  Building2Icon,
  ChartLineIcon,
  ChartNoAxesCombinedIcon,
  CircleDollarSignIcon,
  CircleUserRoundIcon,
  ComponentIcon,
  CreditCardIcon,
  DatabaseIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  GiftIcon,
  GithubIcon,
  GlobeIcon,
  GridIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LayoutPanelLeftIcon,
  Loader2Icon,
  LockKeyholeIcon,
  type LucideIcon,
  MailCheckIcon,
  MailIcon,
  MailboxIcon,
  MapIcon,
  NewspaperIcon,
  NotebookPenIcon,
  PaletteIcon,
  RocketIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  SmileIcon,
  SquareChartGanttIcon,
  TagsIcon,
  UploadIcon,
  VideoIcon,
  WandSparklesIcon,
  WorkflowIcon,
  WrenchIcon
} from "lucide-react";
import { GitHubIcon } from "../icons/github";
import { GoogleIcon } from "../icons/google";
import { ProductHuntIcon } from "../icons/product-hunt";
import { TwitterIcon } from "../icons/twitter";
import { XTwitterIcon } from "../icons/x";
import { BlueskyIcon } from "./bluesky";
import { NextjsIcon } from "./nextjs";
import { ResendIcon } from "./resend";
import { ShadcnuiIcon } from "./shadcnui";
import { StripeIcon } from "./stripe";
import { TailwindcssIcon } from "./tailwindcss";
import { VercelIcon } from "./vercel";
import { YouTubeIcon } from "./youtube";
import { ExternalLinkIcon } from "./external-link";
import { TikTokIcon } from "./tiktok";
import { LinkedInIcon } from "./linkedin";
import { InstagramIcon } from "./instagram";
import { FacebookIcon } from "./facebook";

export type Icon = LucideIcon;

/**
 * 1. Lucide Icons
 * https://lucide.dev/icons/
 *
 * 2. Radix Icons
 * https://www.radix-ui.com/icons
 */
export const Icons = {
  spinner: Loader2Icon,

  // used by name
  arrowRight: ArrowRightIcon,
  search: SearchIcon,
  category: LayoutGridIcon,
  tag: TagsIcon,
  blog: FileTextIcon,
  features: WandSparklesIcon,
  pricing: CreditCardIcon,
  demo: RocketIcon,
  showcase: LayoutGridIcon,
  docs: BookOpenIcon,
  globe: GlobeIcon,
  home: HomeIcon,
  dashboard: LayoutDashboardIcon,
  submit: UploadIcon,
  settings: SettingsIcon,
  email: MailIcon,
  layout: LayoutPanelLeftIcon,
  component: ComponentIcon,
  grid: GridIcon,
  eye: EyeIcon,
  rocket: RocketIcon,
  image: ImageIcon,
  smartphone: SmartphoneIcon,
  palette: PaletteIcon,
  chartLine: ChartLineIcon,
  gift: GiftIcon,
  user: CircleUserRoundIcon,
  chartNoAxes: ChartNoAxesCombinedIcon,

  map: MapIcon,
  video: VideoIcon,
  notebook: NotebookPenIcon,
  mailcheck: MailCheckIcon,
  mailbox: MailboxIcon,
  newspaper: NewspaperIcon,
  smile: SmileIcon,
  wrench: WrenchIcon,
  database: DatabaseIcon,
  githubLucide: GithubIcon,
  filter: FilterIcon,
  money: BadgeDollarSignIcon,
  sponsor: CircleDollarSignIcon,
  shieldCheck: ShieldCheckIcon,
  workflow: WorkflowIcon,
  squareChartGantt: SquareChartGanttIcon,

  admin: LockKeyholeIcon,
  about: Building2Icon,
  externalLink: ExternalLinkIcon,

  github: GitHubIcon,
  google: GoogleIcon,
  twitter: TwitterIcon,
  x: XTwitterIcon,
  bluesky: BlueskyIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  tiktok: TikTokIcon,

  productHunt: ProductHuntIcon,
  nextjs: NextjsIcon,
  shadcnui: ShadcnuiIcon,
  tailwindcss: TailwindcssIcon,
  resend: ResendIcon,
  stripe: StripeIcon,
  vercel: VercelIcon,
};
