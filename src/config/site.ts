export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "{{TOOL_NAME}}",
  title: "{{TOOL_TITLE}}",
  description: "{{TOOL_DESCRIPTION}}",
  url: "https://{{TOOL_SLUG}}.jagodana.com",
  ogImage: "/og-image.png",

  // Header
  headerIcon: "Wrench", // lucide-react icon name (e.g., Image, Map, Code, Palette, Globe, FileSearch)
  headerGradient: {
    from: "emerald-500",
    to: "cyan-500",
  },

  // SEO
  keywords: [
    "{{KEYWORD_1}}",
    "{{KEYWORD_2}}",
    "{{KEYWORD_3}}",
  ],
  applicationCategory: "DeveloperApplication", // or "DesignApplication", "UtilitiesApplication"

  // Theme
  themeColor: "#10b981", // used in manifest and meta tags

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/{{TOOL_SLUG}}",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about: "{{FOOTER_ABOUT_DESCRIPTION}}",
    featuresTitle: "Features",
    features: [
      "{{FEATURE_1}}",
      "{{FEATURE_2}}",
      "{{FEATURE_3}}",
      "{{FEATURE_4}}",
    ],
  },

  // Hero Section
  hero: {
    badge: "{{HERO_BADGE_TEXT}}",
    titleLine1: "{{HERO_TITLE_LINE_1}}",
    titleGradient: "{{HERO_TITLE_GRADIENT_TEXT}}",
    subtitle: "{{HERO_SUBTITLE}}",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "{{FEATURE_ICON_1}}",
      title: "{{FEATURE_CARD_TITLE_1}}",
      description: "{{FEATURE_CARD_DESC_1}}",
    },
    {
      icon: "{{FEATURE_ICON_2}}",
      title: "{{FEATURE_CARD_TITLE_2}}",
      description: "{{FEATURE_CARD_DESC_2}}",
    },
    {
      icon: "{{FEATURE_ICON_3}}",
      title: "{{FEATURE_CARD_TITLE_3}}",
      description: "{{FEATURE_CARD_DESC_3}}",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  // Add every route here. Sitemap and generatePageMetadata() read from this.
  pages: {
    "/": {
      title: "{{TOOL_TITLE}}",
      description: "{{TOOL_DESCRIPTION}}",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    // Example: uncomment and add more pages as needed
    // "/about": {
    //   title: "About - {{TOOL_NAME}}",
    //   description: "Learn more about {{TOOL_NAME}} and how it works.",
    //   changeFrequency: "monthly" as const,
    //   priority: 0.7,
    // },
    // "/blog": {
    //   title: "Blog - {{TOOL_NAME}}",
    //   description: "Tips, tutorials, and updates about {{TOOL_NAME}}.",
    //   changeFrequency: "weekly" as const,
    //   priority: 0.8,
    // },
  },
} as const;

export type SiteConfig = typeof siteConfig;
