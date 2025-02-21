import type { FeatureLdg, InfoLdg, MkdirsInfoLdg, PoweredLdg, TestimonialType } from "@/types";

export const homeFeatures: MkdirsInfoLdg[] = [
  {
    title: "Feature Rich Directory",
    description: "Everything you need to run a directory website.",
    images: ["/images/feature-item-detail-page.png", "/images/feature-search-page.png", "/images/feature-filter.png", "/images/feature-filter-category.png"],
    list: [
      {
        title: "Advanced Search",
        description:
          "Search by keywords from name, description, or rich text content.",
        icon: "search",
      },
      {
        title: "Filterable and Sortable",
        description:
          "Filter items by categories, tags, or sort them by latest, or name.",
        icon: "filter",
      },
      {
        title: "Detailed Item Page",
        description:
          "Each item has a detailed page with rich text content (Markdown).",
        icon: "blog",
      },
    ],
    button: {
      text: "Explore the demo directory",
      icon: "eye",
      href: "https://demo.mkdirs.com",
      variant: "default",
    },
  },
  {
    title: "Sanity CMS Integrated",
    description: "Deeply integrated with the world-class headless CMS, Sanity.",
    images: ["/images/feature-sanity-item-content.png", "/images/feature-sanity-item-image.png", "/images/feature-sanity-item-desc.png", "/images/feature-sanity-category.png"],
    list: [
      {
        title: "Content Management",
        description:
          "Manage items, categories, tags, blogs, users, and more in Sanity Studio.",
        icon: "dashboard",
      },
      {
        title: "Fully Customizable",
        description:
          "Tailor Sanity Studio with versatile plugins to meet your needs.",
        icon: "wrench",
      },
      {
        title: "No Database or Storage Setup",
        description:
          "Sanity integration eliminates database and storage configuration.",
        icon: "database",
      },
    ],
    button: {
      text: "Contact us to preview the Sanity Studio",
      icon: "dashboard",
      href: "mailto:support@mkdirs.com",
      variant: "default",
    },
  },
  {
    title: "Secure Authentication",
    description: "Built-in secure authentication system, powered by Auth.js.",
    images: ["/images/feature-account-register.png", "/images/feature-account-login.png", "/images/feature-account.png", "/images/feature-account-forget-password.png"],
    list: [
      {
        title: "Email/Password Login",
        description: "Email verification and password reset are supported.",
        icon: "email",
      },
      {
        title: "Google or GitHub Login",
        description:
          "Supports Google/GitHub login, easy to add more social logins.",
        icon: "githubLucide",
      },
      {
        title: "User Account Settings",
        description:
          "Users can update their name or link or password in settings.",
        icon: "shieldCheck",
      },
    ],
    button: {
      text: "Explore the Login Page",
      icon: "user",
      href: "https://demo.mkdirs.com/login",
      variant: "default",
    },
  },
  {
    title: "Built-in Submission",
    description: "Free and paid submissions, easily monetize your directory.",
    images: ["/images/feature-submit.png", "/images/feature-submit-payment.png", "/images/feature-submit-publish.png", "/images/feature-submit-dashboard.png", "/images/feature-submit-edit.png", "/images/feature-sanity-item-desc.png"],
    list: [
      {
        title: "Submission Form (AI Suppported)",
        description:
          "AI Autofill supported, rich text editing and image uploads.",
        icon: "submit",
      },
      {
        title: "Paid Submission",
        description:
          "Paid submission with Stripe, easy to monetize your directory.",
        icon: "money",
      },
      {
        title: "Sponsor Ad Submission",
        description:
          "Show sponsor ad in the listing page and detail page once paid.",
        icon: "sponsor",
      },
    ],
    button: {
      text: "Explore the Submission Workflow",
      icon: "submit",
      href: "https://demo.mkdirs.com/submit",
      variant: "default",
    },
  },
  {
    title: "Blog",
    description: "Blog system, easy to share your content.",
    images: ["/images/feature-blog.png", "/images/feature-blog-category.png", "/images/feature-blog-detail.png", "/images/feature-blog-image.png", "/images/feature-blog-more.png", "/images/feature-blog-sanity.png"],
    list: [
      {
        title: "Blog System",
        description: "Blog with categories, authors and rich text content.",
        icon: "newspaper",
      },
      {
        title: "Blog Categories",
        description:
          "Blog with categories, easy to organize your blog posts.",
        icon: "category",
      },
      {
        title: "Rich Text Content",
        description:
          "Supports Image and Code blocks, easy to write blog posts.",
        icon: "notebook",
      },
    ],
    button: {
      text: "Explore the Blog Page",
      icon: "blog",
      href: "https://demo.mkdirs.com/blog",
      variant: "default",
    },
  },
  {
    title: "Email",
    description: "React email templates, easy to send emails.",
    images: ["/images/feature-email-newsletter.png", "/images/feature-email-example.png", "/images/feature-email-preview.png", "/images/feature-email-preview-submission.png"],
    list: [
      {
        title: "Email Templates",
        description:
          "Built-in emails, automatically send emails to the user and admin.",
        icon: "mailbox",
      },
      {
        title: "Customizable Email",
        description:
          "Support for customizing and previewing email templates.",
        icon: "email",
      },
      {
        title: "Newsletter Subscription",
        description: "Support for newsletter subscription and unsubscription.",
        icon: "mailcheck",
      },
    ],
    button: {
      text: "Explore the Newsletter subscription",
      icon: "mailbox",
      href: "https://demo.mkdirs.com/#newsletter",
      variant: "default",
    },
  },
  {
    title: "Layouts and Components",
    description: "Built-in layouts and components, easy to customize your directory website.",
    images: ["/images/feature-layout-1.png", "/images/feature-layout-2.png", "/images/feature-layout-3.png", "/images/feature-layout-4.png"],
    list: [
      {
        title: "Layouts",
        description:
          "Multiple pre-built page layouts to showcase your directory.",
        icon: "layout",
      },
      {
        title: "Components",
        description:
          "Ready-to-use UI components for search, filters, cards, and more.",
        icon: "component",
      },
      {
        title: "Item Cards",
        description:
          "Flexible item cards with both icon and image layouts.",
        icon: "grid",
      },
    ],
    button: {
      text: "Explore the demo directory",
      icon: "mailbox",
      href: "https://demo.mkdirs.com/home2",
      variant: "default",
    },
  },
  {
    title: "Docs and Videos",
    description: "Comprehensive documentation and video tutorials to help you get started.",
    images: ["/images/feature-docs-en.png", "/images/feature-docs-cn.png", "/images/feature-video-home.png", "/images/feature-video-playlist.png"],
    list: [
      {
        title: "Documentation",
        description:
          "Comprehensive documentation to help you get started.",
        icon: "docs",
      },
      {
        title: "Video Tutorials",
        description:
          "High-quality video tutorials to help you get started.",
        icon: "video",
      },
      {
        title: "Multiple Languages",
        description:
          "Docs and videos are available in English and Chinese.",
        icon: "globe",
      },
    ],
    button: {
      text: "Explore the Documentation",
      icon: "mailbox",
      href: "https://docs.mkdirs.com",
      variant: "default",
    },
  },
  {
    title: "SEO Optimization",
    description: "SEO optimized, including OG metadata and auto-generated sitemap.",
    images: ["/images/feature-seo.png", "/images/feature-seo-item.png", "/images/feature-seo-item-image.png", "/images/feature-seo-item-heading.png", "/images/feature-seo-blog.png"] ,
    list: [
      {
        title: "SEO Metadata",
        description:
          "Built-in SEO metadata for all pages (especially items and blogs).",
        icon: "blog",
      },
      {
        title: "Open Graph",
        description: "Built-in Open Graph metadata for social media sharing.",
        icon: "image",
      },
      {
        title: "Auto-generated Sitemap",
        description: "Auto-generated sitemap for search engines.",
        icon: "map",
      },
    ],
    button: {
      text: "View the performance results",
      icon: "chartNoAxes",
      href: "https://pagespeed.web.dev/analysis/https-demo-mkdirs-com/egj0638v8m?form_factor=desktop",
      variant: "default",
    },
  },
  {
    title: "Batteries Included",
    description: "Dark mode, responsive design, and customizable theme.",
    images: ["/images/feature-ui-theme.png", "/images/feature-ui-theme-blue.png", "/images/feature-ui-dark.png", "/images/feature-ui-dark-item.png", "/images/feature-ui-responsive.png"] ,
    list: [
      {
        title: "Customizable Theme",
        description: "Customize the theme to match your brand and style.",
        icon: "palette",
      },
      {
        title: "Dark Mode & Responsive",
        description:
          "Supports dark mode and responsive design.",
        icon: "image",
      },
      {
        title: "Built-in Analytics",
        description: "Supports Google Analytics and OpenPanel Analytics.",
        icon: "chartLine",
      },
    ],
    button: {
      text: "Explore the demo directory",
      icon: "eye",
      href: "https://demo.mkdirs.com",
      variant: "default",
    },
  },
];

export const powereds: PoweredLdg[] = [
  {
    title: "Next.js",
    description: "Full stack React framework for production.",
    link: "https://nextjs.org/",
    icon: "nextjs",
  },
  {
    title: "Auth.js",
    description: "Open source authentication library for Next.js.",
    link: "https://authjs.dev/",
    icon: "authjs",
  },
  {
    title: "Shadcn UI",
    description: "Components for building modern websites.",
    link: "https://ui.shadcn.com/",
    icon: "shadcnui",
  },
  {
    title: "Tailwind CSS",
    description: "CSS framework for rapid UI development.",
    link: "https://tailwindcss.com/",
    icon: "tailwindcss",
  },
  {
    title: "Sanity",
    description: "Headless CMS for modern websites.",
    link: "https://www.sanity.io/",
    icon: "sanity",
  },
  {
    title: "Resend",
    description: "Modern email service for developers.",
    link: "https://resend.com/",
    icon: "resend",
  },
  {
    title: "Stripe",
    description: "Best and most secure online payment service.",
    link: "https://stripe.com/",
    icon: "stripe",
  },
  {
    title: "Vercel AI SDK",
    description: "The open source AI Toolkit for TypeScript.",
    link: "https://sdk.vercel.ai/",
    icon: "vercel",
  },
];

export const infos: InfoLdg[] = [
  {
    title: "Empower your projects",
    description:
      "Unlock the full potential of your projects with our open-source SaaS platform. Collaborate seamlessly, innovate effortlessly, and scale limitlessly.",
    image: "/og.png",
    list: [
      {
        title: "Collaborative",
        description: "Work together with your team members in real-time.",
        icon: "settings",
      },
      {
        title: "Innovative",
        description: "Stay ahead of the curve with access constant updates.",
        icon: "settings",
      },
      {
        title: "Scalable",
        description:
          "Our platform offers the scalability needed to adapt to your needs.",
        icon: "search",
      },
    ],
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate our open-source SaaS seamlessly into your existing workflows. Effortlessly connect with your favorite tools and services for a streamlined experience.",
    image: "/og.png",
    list: [
      {
        title: "Flexible",
        description:
          "Customize your integrations to fit your unique requirements.",
        icon: "settings",
      },
      {
        title: "Efficient",
        description: "Streamline your processes and reducing manual effort.",
        icon: "search",
      },
      {
        title: "Reliable",
        description:
          "Rely on our robust infrastructure and comprehensive documentation.",
        icon: "settings",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Feature 1",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
    icon: "settings",
  },
  {
    title: "Feature 2",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
    icon: "settings",
  },
  {
    title: "Feature 3",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
    icon: "settings",
  },
  {
    title: "Feature 4",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
    icon: "settings",
  },
  {
    title: "Feature 5",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
    icon: "settings",
  },
  {
    title: "Feature 6",
    description:
      "Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.",
    link: "/",
    icon: "settings",
  },
];

// The documentation is clear and concise, making it easy to navigate through the setup process.
export const testimonials: TestimonialType[] = [
  {
    name: "Tom Anderson",
    job: "Niche Blogger",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    review:
      "This directory website template has revolutionized how I present my curated content. It's intuitive, visually appealing, and has significantly improved my site's organization. My readers can now easily find the resources they need. Highly recommended for any content curator!",
  },
  {
    name: "Mike Johnson",
    job: "Local Business Owner",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    review:
      "As a small business owner, I needed an efficient way to showcase local services. This template made creating a town directory website a piece of cake. It's user-friendly, looks professional, and has boosted community engagement significantly.",
  },
  {
    name: "Carlos Mendoza",
    job: "Tech Review Blogger",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    review:
      "I used this template to build a comprehensive tech product directory, and I'm impressed with the results. The category system is flexible, and the search function works flawlessly. It's helped me organize my reviews in a way that's much more accessible to my readers.",
  },
  {
    name: "Ryan Zhang",
    job: "Affiliate Marketer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "I've tried several directory templates, but this one is a cut above. It's SEO-friendly, mobile-responsive, and a breeze to customize. My affiliate links are now organized beautifully, leading to increased click-through rates. It's become an essential tool in my marketing arsenal.",
  },
  {
    name: "Ahmed Hassan",
    job: "Online Course Creator",
    image: "https://randomuser.me/api/portraits/men/19.jpg",
    review:
      "This directory website template has been perfect for organizing my online courses and resources. The clean layout and easy navigation have received praise from my students. It's made managing and presenting my educational content so much easier.",
  },
  {
    name: "Daniel Lee",
    job: "Freelance Web Designer",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    review:
      "As a web designer, I appreciate the thought put into this template. It's a solid foundation that I can easily customize for clients needing directory sites. The code is clean, well-documented, and saves me tons of time on each project. A real asset to my business!",
  },
];
