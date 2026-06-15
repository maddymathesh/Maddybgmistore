import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SocialFloat from "../components/SocialFloat";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { LocalBusinessSchema } from "../components/SEO";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maddybgmistore.in"),
  title: {
    default: "Maddy BGMI Store — Buy & Sell BGMI Accounts | South India's #1",
    template: "%s | Maddy BGMI Store",
  },
  description: "Buy and sell verified BGMI accounts safely. Budget to premium range. Glacier M416, X-Suits, supercar gifts, and UC purchases with instant secure delivery. 2000+ happy buyers since 2019. South India's most trusted BGMI marketplace.",
  keywords: [
    "buy BGMI account",
    "sell BGMI account",
    "BGMI account marketplace",
    "BGMI store India",
    "verified BGMI accounts",
    "cheap BGMI account",
    "premium BGMI account",
    "South India BGMI",
    "Glacier M416",
    "X-Suit",
    "supercar gift",
    "UC purchase",
    "Maddy BGMI Store",
    "bgmi account",
    "bgmi accounts for sale",
    "bgmi account store tamil nadu",
    "bgmi account seller chennai",
    "trusted bgmi store",
    "bgmi uc purchase",
    "bgmi xsuit account",
    "bgmi account exchange",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Maddy BGMI Store — Buy & Sell BGMI Accounts",
    description: "South India's most trusted BGMI marketplace. Buy verified accounts or sell yours safely. 2000+ happy buyers since 2019.",
    url: "https://maddybgmistore.in",
    siteName: "Maddy BGMI Store",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Maddy BGMI Store — Buy & Sell BGMI Accounts",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maddy BGMI Store — Buy & Sell BGMI Accounts",
    description: "South India's most trusted BGMI marketplace. Buy verified accounts or sell yours safely. 2000+ happy buyers since 2019.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Global organization structured data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Maddy BGMI Store",
  "url": "https://maddybgmistore.in",
  "logo": "https://maddybgmistore.in/logo.png",
  "description": "South India's most trusted BGMI account marketplace. Safe, verified, and serving players since 2019.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9025391516",
    "contactType": "customer support",
    "areaServed": "IN",
    "availableLanguage": ["English", "Tamil"]
  },
  "sameAs": [
    "https://www.instagram.com/maddy_bgmistore/",
    "https://t.me/maddy_bgmistore",
    "https://whatsapp.com/channel/0029VbAuBtrIXnlpr3jvnN13"
  ]
};

// Global website search box structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Maddy BGMI Store",
  "url": "https://maddybgmistore.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://maddybgmistore.in/readystocks?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <LocalBusinessSchema />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080a0f] text-[#eaeaea]`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#eab308",
              colorBackground: "#0a0c10",
              colorInputBackground: "#111520",
              colorInputText: "#eaeaea",
            },
            elements: {
              card: "border border-white/5 shadow-2xl rounded-2xl",
              formButtonPrimary: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold tracking-widest uppercase border-none hover:opacity-90",
              footerActionLink: "text-yellow-500 hover:text-yellow-400 font-bold",
            }
          }}
        >
          <Navbar />
          <div className="pt-[64px] min-h-[calc(100vh-64px)] flex flex-col justify-between">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <SocialFloat />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
