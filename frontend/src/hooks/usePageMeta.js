import { useEffect } from "react";

/**
 * usePageMeta — sets page-specific title and meta description on mount.
 * Helps search engines index each route with unique, relevant metadata.
 *
 * @param {Object} params
 * @param {string} params.title        - Page title (appended with site name)
 * @param {string} params.description  - Meta description for this page
 * @param {string} [params.ogUrl]      - Canonical URL override (optional)
 */
export function usePageMeta({ title, description, ogUrl }) {
  useEffect(() => {
    const siteName = "Maddy BGMI Store";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;

    // Title
    document.title = fullTitle;

    // Meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", description || "");

    // OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    // OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description || "");

    // OG URL
    if (ogUrl) {
      let ogUrlMeta = document.querySelector('meta[property="og:url"]');
      if (ogUrlMeta) ogUrlMeta.setAttribute("content", ogUrl);
    }

    // Restore defaults on unmount
    return () => {
      document.title = siteName;
    };
  }, [title, description, ogUrl]);
}
