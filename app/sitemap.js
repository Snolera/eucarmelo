import { getSiteUrl } from "@/lib/siteUrl";

// One-page: uma única URL
export default function sitemap() {
  return [{ url: getSiteUrl(), changeFrequency: "monthly", priority: 1 }];
}
