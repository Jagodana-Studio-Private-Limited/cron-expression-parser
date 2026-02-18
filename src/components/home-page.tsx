"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedGradientText } from "@/components/animated-gradient-text";
import { FAQSection } from "@/components/faq-section";
import { RelatedTools } from "@/components/related-tools";
import { siteConfig } from "@/config/site";

export function HomePage() {
  const [hasResults, setHasResults] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-screen-xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${siteConfig.headerGradient.from}/10 border border-${siteConfig.headerGradient.from}/20 mb-6`}
          >
            <Sparkles className={`h-4 w-4 text-${siteConfig.headerGradient.from}`} />
            <span className={`text-sm text-${siteConfig.headerGradient.from} font-medium`}>
              {siteConfig.hero.badge}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            {siteConfig.hero.titleLine1}
            <br className="hidden sm:block" />
            <AnimatedGradientText>{siteConfig.hero.titleGradient}</AnimatedGradientText>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {siteConfig.hero.subtitle}
          </motion.p>

          {/* ============================================ */}
          {/* TODO: Replace this section with your tool UI */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">
                Your tool interface goes here.
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                Replace this placeholder with your tool&apos;s main component.
              </p>
            </div>
          </motion.div>

          {/* Feature Cards - shown when no results */}
          {!hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20"
            >
              {siteConfig.featureCards.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-muted/30 border border-border/50"
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Related Tools - Cross-linking for SEO */}
          <RelatedTools />

          {/* FAQ Section */}
          <FAQSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
