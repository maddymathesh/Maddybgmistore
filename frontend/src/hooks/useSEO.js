import { useEffect } from "react";

export default function useSEO(title, description, image = "https://maddybgmistore.com/og-image.webp") {
  useEffect(() => {
    // 1. Update Title
    const finalTitle = title ? `${title} | Maddy BGMI Store` : "Maddy BGMI Store — Buy & Sell BGMI Accounts | South India's #1";
    document.title = finalTitle;

    // Helper to get or create a meta tag
    const setMetaTag = (selector, attrName, attrValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to get or create a link tag
    const setLinkTag = (selector, rel, href) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Update Standard Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', "name", "description", description);
    }

    // 3. Update Canonical URL
    const currentUrl = window.location.href;
    setLinkTag('link[rel="canonical"]', "canonical", currentUrl);

    // 4. Update Open Graph Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", title ? title : "Maddy BGMI Store");
    if (description) {
      setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    }
    setMetaTag('meta[property="og:url"]', "property", "og:url", currentUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", image);

    // 5. Update Twitter Tags
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title ? title : "Maddy BGMI Store");
    if (description) {
      setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);

  }, [title, description, image]);
}
