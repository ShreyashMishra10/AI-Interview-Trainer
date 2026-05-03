import type { MetadataRoute } from "next";

const BASE = "https://ai-interview-trainer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/pricing`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/services`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
