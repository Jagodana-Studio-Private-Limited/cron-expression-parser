"use client";

import { Check, Copy, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ToolEvents } from "@/lib/analytics";

interface SocialShareProps {
  title?: string;
  text?: string;
  url?: string;
}

export function SocialShare({
  title = siteConfig.name,
  text = siteConfig.description,
  url = siteConfig.url,
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} - ${text}`);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      ToolEvents.shareClicked("copy_link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    ToolEvents.shareClicked(platform);
    window.open(shareLinks[platform], "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        className="gap-1.5"
      >
        <Twitter className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Tweet</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        className="gap-1.5"
      >
        <Linkedin className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="gap-1.5"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
      </Button>
    </div>
  );
}
