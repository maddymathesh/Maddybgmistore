import React from "react";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductDetails {
  name: string;
  description: string;
  image: string;
  price: string;
  availability: "InStock" | "OutOfStock" | "PreOrder" | "SoldOut";
  sku: string;
  category: string;
  sellerName: string;
  ratingValue?: number;
  reviewCount?: number;
}

// 1. Breadcrumb Structured Data Component
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 2. FAQ Structured Data Component
export function FAQSchema({ items }: { items: FAQItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 3. Product Structured Data Component
export function ProductSchema({ details }: { details: ProductDetails }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": details.name,
    "image": details.image,
    "description": details.description,
    "sku": details.sku,
    "mpn": details.sku,
    "brand": {
      "@type": "Brand",
      "name": "Maddy BGMI Store",
    },
    "offers": {
      "@type": "Offer",
      "url": `https://maddybgmistore.in/readystocks/${details.sku}`,
      "priceCurrency": "INR",
      "price": details.price,
      "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split("T")[0],
      "itemCondition": "https://schema.org/UsedCondition",
      "availability": `https://schema.org/${details.availability}`,
      "seller": {
        "@type": "Organization",
        "name": details.sellerName,
      },
    },
  };

  if (details.ratingValue && details.reviewCount) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": details.ratingValue.toString(),
      "reviewCount": details.reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 4. Local Business Schema Component
interface LocalBusinessProps {
  cityName?: string;
  latitude?: string;
  longitude?: string;
  postalCode?: string;
  addressLocality?: string;
}

export function LocalBusinessSchema({ cityName = "Chennai", latitude = "13.0827", longitude = "80.2707", postalCode = "600001", addressLocality = "Chennai" }: LocalBusinessProps = {}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Maddy BGMI Store - ${cityName} Branch`,
    "image": "https://maddybgmistore.in/logo.png",
    "@id": `https://maddybgmistore.in/#localbusiness-${cityName.toLowerCase()}`,
    "url": "https://maddybgmistore.in",
    "telephone": "+91-9025391516",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": addressLocality,
      "addressRegion": "Tamil Nadu",
      "postalCode": postalCode,
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude,
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "23:00"
    },
    "sameAs": [
      "https://www.instagram.com/maddy_bgmistore/",
      "https://t.me/maddy_bgmistore",
      "https://whatsapp.com/channel/0029VbAuBtrIXnlpr3jvnN13"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 5. About Page Schema Component
export function AboutPageSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Maddy BGMI Store",
    "description": "Learn about Maddy BGMI Store, South India's premium tactical secure marketplace for verified BGMI accounts, UC purchase, and secure middleman escrow trading since 2019.",
    "publisher": {
      "@type": "Organization",
      "name": "Maddy BGMI Store",
      "logo": "https://maddybgmistore.in/logo.png"
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 6. Article & Guide Schema Component
interface ArticleProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  image?: string;
}

export function ArticleSchema({ title, description, datePublished, dateModified, authorName, url, image }: ArticleProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maddy BGMI Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maddybgmistore.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "image": image || "https://maddybgmistore.in/logo.png"
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 7. Aggregate Rating & Review Schema Component
interface AggregateRatingProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function AggregateRatingSchema({ ratingValue, reviewCount, bestRating = 5, worstRating = 1 }: AggregateRatingProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Maddy BGMI Store Services",
    "image": "https://maddybgmistore.in/logo.png",
    "description": "Premium BGMI accounts, UC, and skins secure trading services.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toString(),
      "reviewCount": reviewCount.toString(),
      "bestRating": bestRating.toString(),
      "worstRating": worstRating.toString(),
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
