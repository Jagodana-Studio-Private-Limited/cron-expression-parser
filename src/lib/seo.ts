import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { env } from "@/env.mjs";

type PagePath = keyof typeof siteConfig.pages;

interface PageMetadataOverrides {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate per-page metadata from siteConfig.pages.
 *
 * Usage in any page.tsx (server component):
 *
 *   import { generatePageMetadata } from "@/lib/seo";
 *   export const metadata = generatePageMetadata("/about");
 *
 * With overrides:
 *
 *   export const metadata = generatePageMetadata("/about", {
 *     title: "Custom Title",
 *     description: "Custom description",
 *   });
 */
export function generatePageMetadata(
  path: PagePath,
  overrides: PageMetadataOverrides = {}
): Metadata {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || siteConfig.url;
  const page = siteConfig.pages[path];

  const title = overrides.title || page.title;
  const description = overrides.description || page.description;
  const ogImage = overrides.ogImage || siteConfig.ogImage;
  const canonicalUrl = path === "/" ? baseUrl : `${baseUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
    ...(overrides.noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
