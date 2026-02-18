/**
 * GA4 custom event tracking helper.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("tool_used", { action: "export", format: "png" });
 *   trackEvent("file_uploaded", { fileType: "svg", fileSize: 1024 });
 *   trackEvent("result_copied");
 */

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
}

/**
 * Pre-defined events for common tool actions.
 * Extend these as needed per tool.
 */
export const ToolEvents = {
  toolUsed: (action: string) =>
    trackEvent("tool_used", { action }),

  fileUploaded: (fileType: string, fileSize: number) =>
    trackEvent("file_uploaded", { file_type: fileType, file_size: fileSize }),

  resultExported: (format: string) =>
    trackEvent("result_exported", { format }),

  resultCopied: () =>
    trackEvent("result_copied"),

  shareClicked: (platform: string) =>
    trackEvent("share_clicked", { platform }),
} as const;
