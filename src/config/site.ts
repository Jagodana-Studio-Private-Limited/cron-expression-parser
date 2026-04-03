export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "Cron Expression Parser",
  title: "Cron Expression Parser - Parse, Explain & Visualize Cron Jobs",
  description:
    "Parse and understand cron expressions instantly. Get human-readable descriptions, next run times, timezone support, and visual field breakdowns. Free, 100% client-side.",
  url: "https://cron-expression-parser.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Clock", // lucide-react icon name
  brandAccentColor: "#a855f7", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "cron expression parser",
    "cron job parser",
    "cron expression explainer",
    "cron schedule calculator",
    "cron expression validator",
    "cron next run time",
    "unix cron parser",
    "crontab parser",
    "cron expression tool",
    "cron human readable",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#8b5cf6", // used in manifest and meta tags

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/cron-expression-parser",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "Cron Expression Parser is a free developer tool that helps you understand, debug, and validate cron expressions. No backend, no uploads — everything runs in your browser.",
    featuresTitle: "Features",
    features: [
      "Human-readable descriptions",
      "Next 10 run times",
      "Timezone support",
      "Visual field breakdown",
      "Common presets",
      "Copy to clipboard",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free Developer Tool",
    titleLine1: "Parse & Understand",
    titleGradient: "Cron Expressions",
    subtitle:
      "Instantly decode any cron expression into plain English. View the next run times, explore field breakdowns, and pick from common presets — all in your browser.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "📖",
      title: "Human-Readable",
      description:
        "Converts complex cron expressions into clear English descriptions like 'Every Monday at 9:00 AM'.",
    },
    {
      icon: "🕐",
      title: "Next Run Times",
      description:
        "See the next 10 scheduled executions with full timezone support using your local time.",
    },
    {
      icon: "🔍",
      title: "Field Breakdown",
      description:
        "Visual explanation of each cron field — minute, hour, day, month, and weekday.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "Regex Playground",
      url: "https://regex-playground.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "Favicon Generator",
      url: "https://favicon-generator.jagodana.com",
      icon: "🎨",
      description: "Generate all favicon sizes + manifest from any image.",
    },
    {
      name: "Sitemap Checker",
      url: "https://sitemap-checker.jagodana.com",
      icon: "🔍",
      description: "Discover and validate sitemaps on any website.",
    },
    {
      name: "Screenshot Beautifier",
      url: "https://screenshot-beautifier.jagodana.com",
      icon: "📸",
      description: "Transform screenshots into beautiful images.",
    },
    {
      name: "Color Palette Explorer",
      url: "https://color-palette-explorer.jagodana.com",
      icon: "🎭",
      description: "Extract color palettes from any image.",
    },
    {
      name: "Logo Maker",
      url: "https://logo-maker.jagodana.com",
      icon: "✏️",
      description: "Create a professional logo in 60 seconds.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Enter a cron expression",
      text: "Type or paste your cron expression (5 fields: minute, hour, day-of-month, month, day-of-week) into the input box, or choose a preset from the dropdown.",
      url: "",
    },
    {
      name: "Read the description",
      text: "See an instant human-readable explanation of your cron schedule, such as 'Every 5 minutes' or 'At 3:00 AM on Mondays'.",
      url: "",
    },
    {
      name: "Check next run times",
      text: "View the next 10 scheduled execution times in your local timezone. Optionally switch to any timezone for planning.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M", // ISO 8601 duration (e.g., PT1M = 1 minute)

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What is a cron expression?",
      answer:
        "A cron expression is a string of 5 (or 6) fields separated by spaces that defines a recurring schedule for automated tasks. The standard 5-field format is: minute (0–59), hour (0–23), day-of-month (1–31), month (1–12), and day-of-week (0–7, where 0 and 7 are both Sunday). For example, '0 9 * * 1' means 'At 9:00 AM every Monday'.",
    },
    {
      question: "What special characters are supported?",
      answer:
        "This parser supports: * (any value), , (list separator, e.g. 1,3,5), - (range, e.g. 1-5), and / (step values, e.g. */5 means every 5 units). You can combine them, such as '1-30/5' to mean every 5 minutes in the first half of an hour.",
    },
    {
      question: "How are next run times calculated?",
      answer:
        "Next run times are calculated entirely in your browser using JavaScript's Date API. Starting from the current moment, the tool finds the next 10 timestamps that satisfy all five cron fields simultaneously. Timezone conversion uses the built-in Intl.DateTimeFormat API.",
    },
    {
      question: "Does this tool send my data to a server?",
      answer:
        "No. This tool is 100% client-side. Your cron expressions are parsed locally in your browser using JavaScript — nothing is sent to any server. It works fully offline once loaded.",
    },
    {
      question: "What is the difference between day-of-week 0 and 7?",
      answer:
        "Both 0 and 7 represent Sunday in cron syntax. This dual representation exists for historical compatibility between different Unix systems. Monday through Saturday are represented by 1 through 6.",
    },
    {
      question: "Why does my cron expression say 'Invalid'?",
      answer:
        "A cron expression is invalid if it has a wrong number of fields (not exactly 5), contains out-of-range values (e.g. hour 25, month 13), or uses unsupported syntax. Make sure each field is separated by a single space.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title:
        "Cron Expression Parser - Parse, Explain & Visualize Cron Jobs",
      description:
        "Parse and understand cron expressions instantly. Get human-readable descriptions, next run times, timezone support, and visual field breakdowns. Free, 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
