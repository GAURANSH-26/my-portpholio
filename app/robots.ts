import type { MetadataRoute } from "next";
import { siteContent } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteContent.profile.siteUrl}/sitemap.xml`
  };
}
