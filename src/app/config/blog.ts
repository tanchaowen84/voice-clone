export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description: "Updates and announcements from MkSaaS Starter.",
  },
  {
    title: "Education",
    slug: "education",
    description: "Educational content about SaaS management.",
  },
];

export const BLOG_AUTHORS = {
  mksaas: {
    name: "mksaas",
    image: "/_static/avatars/mksaas.png",
    twitter: "mksaas",
  },
  mkdirs: {
    name: "mkdirs",
    image: "/_static/avatars/mkdirs.png",
    twitter: "mkdirs",
  },
};
