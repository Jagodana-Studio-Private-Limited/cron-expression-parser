import { ImageResponse } from "@vercel/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export const alt = siteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        {/* Gradient accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(to right, ${siteConfig.themeColor}, #06b6d4)`,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
          }}
        >
          {/* Tool name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: `linear-gradient(to right, ${siteConfig.themeColor}, #06b6d4)`,
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            {siteConfig.name}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            {siteConfig.description.length > 120
              ? siteConfig.description.slice(0, 120) + "..."
              : siteConfig.description}
          </div>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#71717a",
            }}
          >
            Free tool by
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fafafa",
            }}
          >
            {siteConfig.creator}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
