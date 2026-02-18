import { generatePageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/home-page";

export const metadata = generatePageMetadata("/");

export default function Page() {
  return <HomePage />;
}
