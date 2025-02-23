import {
  ArrowRightIcon,
  BadgeDollarSignIcon,
  BookOpenIcon,
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
import { FaBrandsGitHub } from "../icons/github";
import { FaBrandsGoogle } from "../icons/google";
import { LogosProductHunt } from "../icons/product-hunt";
import { FaBrandsXTwitter } from "../icons/twitter";
import AuthJSIcon from "./authjs";
import { Fa6BrandsBluesky } from "./bluesky";
import { NextjsIcon } from "./nextjs";
import { SimpleIconsResend } from "./resend";
import { SimpleIconsSanity } from "./sanity";
import { SimpleIconsShadcnui } from "./shadcnui";
import { SimpleIconsStripe } from "./stripe";
import { SimpleIconsTailwindcss } from "./tailwindcss";
import { SimpleIconsVercel } from "./vercel";
import { IonLogoYoutube } from "./youtube";

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

  github: FaBrandsGitHub,
  google: FaBrandsGoogle,
  twitter: FaBrandsXTwitter,
  bluesky: Fa6BrandsBluesky,
  youtube: IonLogoYoutube,
  productHunt: LogosProductHunt,
  nextjs: NextjsIcon,
  authjs: AuthJSIcon,
  shadcnui: SimpleIconsShadcnui,
  tailwindcss: SimpleIconsTailwindcss,
  sanity: SimpleIconsSanity,
  resend: SimpleIconsResend,
  stripe: SimpleIconsStripe,
  vercel: SimpleIconsVercel,
};
