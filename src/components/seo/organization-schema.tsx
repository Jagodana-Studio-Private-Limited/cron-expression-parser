import { siteConfig } from "@/config/site";

export function OrganizationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.creator,
    url: siteConfig.creatorUrl,
    logo: `${siteConfig.creatorUrl}/logo.svg`,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.website,
      ...(siteConfig.socialProfiles || []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
