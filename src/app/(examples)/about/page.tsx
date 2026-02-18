/**
 * EXAMPLE: Per-page metadata for a sub-page.
 *
 * This shows how every new page gets its own SEO metadata.
 * To use this pattern:
 *
 * 1. Add the route to siteConfig.pages in src/config/site.ts
 * 2. Export metadata using generatePageMetadata() in your page.tsx
 * 3. The sitemap.ts will auto-include it
 *
 * Delete this (examples) folder when starting your tool.
 */

import { generatePageMetadata } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Step 1: Make sure "/about" exists in siteConfig.pages
// Step 2: Export metadata (works because this is a server component)
export const metadata = generatePageMetadata("/about" as never, {
  title: "About",
  description: "Learn more about this tool and how it works.",
});

// Step 3: Build your page (server or client component)
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-screen-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">About</h1>
        <p className="text-muted-foreground">
          This is an example sub-page with its own SEO metadata.
          Delete the <code>(examples)</code> folder when starting your tool.
        </p>
      </main>
      <Footer />
    </div>
  );
}
