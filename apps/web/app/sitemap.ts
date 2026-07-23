import { MetadataRoute } from "next";
import { db, products } from "@repo/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maddybgmistore.in";

  // Fetch all available products to build dynamic product page slugs
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const dbProducts = await db.select().from(products);
    productEntries = dbProducts.map((p) => {
      // Replicate the slug-generation logic
      const cleanTitle = p.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const slug = `${cleanTitle}-${p.id}`;

      return {
        url: `${baseUrl}/readystocks/${slug}`,
        lastModified: p.createdAt ? new Date(p.createdAt) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Sitemap dynamic product generation failed:", error);
  }

  // Static Marketing & Transactional Slugs
  const staticPages = [
    "",
    "/buy",
    "/sell",
    "/exchange",
    "/reviews",
    "/proofs",
    "/faq",
    "/connectwithus",
    "/services/uc",
    "/services/xsuit",
    "/services/supercargifts",
    "/blog",
    "/about",
    "/why-trust-us",
    "/success-stories",
    "/guides/valuation",
    "/locations",
  ];

  const staticEntries = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? (1.0 as const) : (0.9 as const),
  }));

  // Dynamic Blog Slugs
  const blogSlugs = [
    "bgmi-account-buying-guide",
    "bgmi-mythics-explained",
    "best-xsuits-in-bgmi",
    "safe-bgmi-trading-guide",
    "bgmi-account-value-calculator",
    "bgmi-account-selling-guide",
  ];

  const blogEntries = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic Local City Slugs
  const citySlugs = [
    "chennai",
    "coimbatore",
    "madurai",
    "trichy",
    "salem",
    "south-india"
  ];

  const cityEntries = citySlugs.map((city) => ({
    url: `${baseUrl}/locations/${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries, ...cityEntries];
}
