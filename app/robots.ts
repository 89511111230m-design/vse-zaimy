import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/personal-data", "/privacy", "/terms"] }, sitemap: `${siteConfig.url}/sitemap.xml` }; }
