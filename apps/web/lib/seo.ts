/**
 * Generates an SEO-friendly URL slug by merging the product title and its UUID.
 * Example: "Glacier Max Level ID" + "UUID" -> "glacier-max-level-id-UUID"
 */
export function getProductSlug(title: string, id: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)/g, "");     // trim leading/trailing hyphens
  return `${cleanTitle}-${id}`;
}

/**
 * Extracts the UUID suffix from an SEO-friendly slug.
 * Example: "glacier-max-level-id-3b82f6a9-8588-4222-b222-3bbbbbbbbbbb" -> "3b82f6a9-8588-4222-b222-3bbbbbbbbbbb"
 */
export function extractIdFromSlug(slug: string): string {
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidPattern);
  if (match) {
    return match[0];
  }
  return slug; // fallback
}
