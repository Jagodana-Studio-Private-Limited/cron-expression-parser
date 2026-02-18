"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ToolEvents } from "@/lib/analytics";

interface GitHubStarProps {
  className?: string;
}

export function GitHubStar({ className }: GitHubStarProps) {
  const handleClick = () => {
    ToolEvents.toolUsed("github_star");
    window.open(siteConfig.links.github, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={className}
    >
      <Star className="h-3.5 w-3.5" />
      <span>Star on GitHub</span>
    </Button>
  );
}
