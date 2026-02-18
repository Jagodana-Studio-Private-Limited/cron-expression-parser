"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function RelatedTools() {
  const tools = siteConfig.relatedTools;
  if (!tools || (tools as readonly unknown[]).length === 0) {
    return null;
  }

  return (
    <aside aria-label="Related tools" className="max-w-4xl mx-auto mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          More Free Tools
        </h2>
        <p className="text-muted-foreground">
          Check out our other free tools built for developers and designers.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <motion.a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="group flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <span className="text-2xl shrink-0">{tool.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 font-medium group-hover:text-foreground transition-colors">
                <span className="truncate">{tool.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {tool.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </aside>
  );
}
