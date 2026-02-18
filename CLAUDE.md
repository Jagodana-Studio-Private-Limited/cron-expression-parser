# Jagodana Tool Template

This is the base template for all Jagodana free tool websites. When creating a new tool from this template, follow these instructions exactly.

## Tech Stack (DO NOT CHANGE)

- **Framework**: Next.js 16.x with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with OKLCH color tokens
- **UI Components**: shadcn/ui (new-york style) + Radix UI primitives
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Fonts**: Geist Sans + Geist Mono (Google Fonts)
- **Theme**: next-themes (light/dark/system)
- **Toasts**: sonner
- **Env Validation**: @t3-oss/env-nextjs + zod
- **Analytics**: Google Analytics (via NEXT_PUBLIC_GA_ID env var)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (global metadata + title template, fonts, providers)
│   ├── page.tsx            # Home page (SERVER component → exports metadata, renders HomePage)
│   ├── globals.css         # Tailwind v4 theme tokens (OKLCH)
│   ├── robots.ts           # SEO robots.txt (disallows /api/, /_next/, /private/)
│   ├── sitemap.ts          # SEO sitemap.xml (auto-generated from siteConfig.pages)
│   ├── api/                # API routes (if needed)
│   └── (examples)/         # Example sub-page with per-page metadata (DELETE when starting)
│       └── about/page.tsx
├── components/
│   ├── home-page.tsx        # Home page CLIENT component (hero + tool + features)
│   ├── header.tsx           # Sticky header with gradient logo + theme toggle
│   ├── footer.tsx           # Footer with about + features + copyright
│   ├── theme-provider.tsx   # next-themes wrapper
│   ├── theme-toggle.tsx     # Animated sun/moon toggle
│   ├── google-analytics.tsx # GA4 script loader
│   ├── animated-gradient-text.tsx # Animated gradient text effect
│   ├── seo/
│   │   └── structured-data.tsx    # JSON-LD WebApplication schema
│   └── ui/                  # shadcn/ui components (DO NOT MODIFY)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       └── tabs.tsx
├── config/
│   └── site.ts             # ALL tool-specific config + pages registry
├── lib/
│   ├── utils.ts            # cn() helper
│   └── seo.ts              # generatePageMetadata() helper for per-page SEO
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
└── env.mjs                 # Environment variable validation
```

## How to Create a New Tool

### Step 1: Clone and Rename

```bash
git clone <template-repo-url> <new-tool-name>
cd <new-tool-name>
rm -rf .git
git init
```

### Step 2: Update `src/config/site.ts`

This is the SINGLE SOURCE OF TRUTH for all tool-specific content. Update every `{{PLACEHOLDER}}` value:

- `name` - Display name (e.g., "Favicon Generator")
- `title` - SEO title (e.g., "Favicon Generator - Create All Favicon Sizes + Manifest")
- `description` - SEO description
- `url` - Production URL (e.g., "https://favicon-generator.jagodana.com")
- `headerIcon` - lucide-react icon name for the header
- `headerGradient` - Tailwind color pair (from/to)
- `keywords` - SEO keywords array
- `applicationCategory` - Schema.org category
- `themeColor` - Hex color for manifest/meta
- `hero.*` - All hero section content
- `featureCards` - 3 feature cards with emoji icons
- `footer.*` - Footer content

### Step 3: Update `package.json`

Change the `"name"` field to your tool's slug.

### Step 4: Update `public/site.webmanifest`

Replace all `{{PLACEHOLDER}}` values with your tool's info.

### Step 5: Add Tool-Specific Dependencies

Install any additional packages needed for your tool's functionality.

### Step 6: Build the Tool UI

Replace the placeholder in `src/components/home-page.tsx` (the `TODO` section) with your tool's main component. The `page.tsx` is a server component that exports metadata and renders `<HomePage />`.

### Step 6b: Add Sub-Pages (if needed)

For each new page:
1. Add the route to `siteConfig.pages` in `src/config/site.ts`
2. Create `src/app/<route>/page.tsx` as a **server component**
3. Export metadata: `export const metadata = generatePageMetadata("/<route>");`
4. The sitemap auto-includes it (reads from `siteConfig.pages`)
5. Delete the `src/app/(examples)/` folder (it's just a reference)

### Step 7: Add favicon.svg

Create or place a custom `public/favicon.svg` for the tool.

### Step 8: Create og-image.png

Create a 1200x630 Open Graph image at `public/og-image.png`.

### Step 9: Update Environment

Copy `.env.example` to `.env.local` and set values.

## Page Layout Pattern (MUST FOLLOW)

Every tool page follows this exact structure:

1. **Header** - Sticky, blurred backdrop, gradient logo, theme toggle
2. **Hero Section**
   - Animated badge (Sparkles icon + text)
   - Large heading with AnimatedGradientText
   - Subtitle paragraph
3. **Tool Interface** - The main interactive area
4. **Feature Cards** - 3-column grid (shown when no results)
5. **Footer** - About + features list + copyright + "More Tools" link

## Animation Pattern

All sections use framer-motion staggered animations:
- `initial={{ opacity: 0, y: 20 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ delay: 0.1 * index }}`

## Color Scheme

Each tool has a unique gradient defined in `siteConfig.headerGradient`. Common choices:
- `emerald-500` / `cyan-500` (favicon-generator, sitemap-checker)
- `blue-500` / `indigo-500` (sitemap-url-extractor)
- `purple-500` / `pink-500` (screenshot-beautifier)
- `orange-500` / `amber-500`
- `rose-500` / `red-500`

**Important**: When using dynamic Tailwind classes from siteConfig, ensure the classes are included in the safelist or use them somewhere statically so Tailwind doesn't purge them.

## Per-Page SEO Pattern (CRITICAL)

Every page MUST be a **server component** to export metadata. Use this pattern:

```tsx
// src/app/some-page/page.tsx (SERVER component - NO "use client")
import { generatePageMetadata } from "@/lib/seo";
import { SomePageClient } from "@/components/some-page-client";

export const metadata = generatePageMetadata("/some-page");

export default function SomePage() {
  return <SomePageClient />;
}
```

```tsx
// src/components/some-page-client.tsx (CLIENT component)
"use client";
export function SomePageClient() {
  // Interactive UI here
}
```

**Why this split?** Next.js only allows metadata exports from server components. Client interactivity goes in a separate `"use client"` component.

### Title Template

`layout.tsx` uses a title template: `%s | {{TOOL_NAME}}`. Per-page metadata titles like "About" become "About | Tool Name" automatically. The homepage uses `default` to show the full title without the template.

### generatePageMetadata() Helper

Located at `src/lib/seo.ts`. It:
- Reads page config from `siteConfig.pages`
- Generates full Metadata object (title, description, OG, Twitter, canonical URL)
- Supports overrides for custom title/description per page
- Supports `noIndex: true` for private pages

### siteConfig.pages Registry

Every route must be registered in `siteConfig.pages`:

```ts
pages: {
  "/": { title: "...", description: "...", changeFrequency: "weekly", priority: 1 },
  "/about": { title: "...", description: "...", changeFrequency: "monthly", priority: 0.7 },
}
```

This feeds both:
- `sitemap.ts` - auto-generates sitemap.xml from all registered pages
- `generatePageMetadata()` - reads title/description from here

## SEO Checklist

Every tool MUST have:
- [x] `layout.tsx` global metadata (title template, description, keywords, OG, Twitter)
- [x] Per-page metadata via `generatePageMetadata()` on every page.tsx
- [x] `robots.ts` with sitemap reference + disallow rules (/api/, /_next/, /private/)
- [x] `sitemap.ts` auto-generated from `siteConfig.pages`
- [x] JSON-LD structured data (WebApplication schema)
- [x] `site.webmanifest` in public/
- [x] `favicon.svg` in public/
- [x] `og-image.png` (1200x630) in public/
- [x] Canonical URL per page via `alternates.canonical`
- [x] `viewport` export with themeColor
- [x] Every new page registered in `siteConfig.pages`

## Security Headers (next.config.ts)

Already configured:
- HSTS
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Common Patterns

### Client-Side Processing
Most tools process data client-side for privacy. Emphasize "100% client-side" and "No uploads to server" in copy.

### Toast Notifications
```tsx
import { toast } from "sonner";
toast.success("Done!");
toast.error("Something went wrong");
```

### Adding shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### API Routes (if needed)
Place in `src/app/api/[route]/route.ts`. Add env vars to `src/env.mjs`.

## DO NOT

- Change the base UI components in `src/components/ui/`
- Remove security headers from `next.config.ts`
- Hardcode secrets or API keys
- Change the font from Geist
- Remove Google Analytics integration
- Skip structured data / JSON-LD
- Use Tailwind v3 patterns (use v4 @theme inline)
