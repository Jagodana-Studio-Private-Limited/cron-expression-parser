import { siteConfig } from "@/config/site";

export function HowToSchema() {
  const steps = siteConfig.howToSteps;
  if (!steps || (steps as readonly unknown[]).length === 0) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${siteConfig.name}`,
    description: siteConfig.description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url ? { url: `${siteConfig.url}${step.url}` } : {}),
    })),
    tool: {
      "@type": "HowToTool",
      name: "Web browser",
    },
    totalTime: siteConfig.howToTotalTime || "PT2M",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
