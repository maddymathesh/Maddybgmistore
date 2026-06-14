/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "../posts";
import { BreadcrumbSchema } from "../../../components/SEO";
import { ArrowLeft, Calendar, Clock, User, Tag, ShoppingCart, Banknote, RefreshCw } from "lucide-react";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "This informational BGMI guide is not available.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://maddybgmistore.in/blog/${post.slug}`,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostDetailsPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Generate dynamic Article Schema JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [
      `https://maddybgmistore.in${post.image}`
    ],
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": [{
      "@type": "Person",
      "name": post.author,
      "url": "https://maddybgmistore.in"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Maddy BGMI Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maddybgmistore.in/logo.png"
      }
    },
    "description": post.excerpt
  };

  return (
    <div className="blog-post-page min-h-screen py-12 bg-[#080a0f] text-[#eaeaea]">
      {/* 1. Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* 2. Breadcrumbs schema */}
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://maddybgmistore.in" },
          { name: "Blog", item: "https://maddybgmistore.in/blog" },
          { name: post.category, item: `https://maddybgmistore.in/blog?category=${post.category}` },
          { name: post.title, item: `https://maddybgmistore.in/blog/${post.slug}` },
        ]}
      />

      <div className="max-w-[840px] mx-auto px-5">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-yellow-500 hover:text-white uppercase tracking-wider mb-8 transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-wider mb-4">
            <Tag size={10} />
            <span>{post.category}</span>
          </span>

          <h1 className="font-h font-black text-2xl sm:text-4xl lg:text-5xl text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author/Date/ReadTime strip */}
          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-white/10 text-muted text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-yellow-500" />
              <span>By {post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{post.readTime}</span>
            </span>
          </div>
        </header>

        {/* Hero image banner */}
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-10 bg-black/30">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Article Content */}
        <div className="article-body text-[#c5cdd6] leading-relaxed text-sm sm:text-base mb-12">
          {post.content.split("\n\n").map((para, i) => {
            const trimmed = para.trim();
            if (trimmed.startsWith("###")) {
              return <h3 key={i} className="font-h font-bold text-lg sm:text-xl text-white mt-8 mb-4">{trimmed.replace("###", "").trim()}</h3>;
            }
            if (trimmed.startsWith("1.") || trimmed.startsWith("-")) {
              return (
                <ul key={i} className="list-disc pl-6 my-4 flex flex-col gap-2">
                  {trimmed.split("\n").map((li, idx) => (
                    <li key={idx} className="text-[#c5cdd6]">{li.replace(/^-\s*|^\d+\.\s*/, "")}</li>
                  ))}
                </ul>
              );
            }
            // Markdown tables check
            if (trimmed.includes("|")) {
              const rows = trimmed.split("\n").filter(r => r.trim() !== "");
              const headers = rows[0]?.split("|").map(h => h.trim()).filter(h => h !== "") || [];
              const bodyRows = rows.slice(2).map(r => r.split("|").map(col => col.trim()).filter(col => col !== "")) || [];
              return (
                <div key={i} className="overflow-x-auto my-6 border border-white/5 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        {headers.map((h, idx) => (
                          <th key={idx} className="p-3 font-h font-black text-white uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bodyRows.map((r, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-white/5 hover:bg-white/[0.02]">
                          {r.map((col, colIdx) => (
                            <td key={colIdx} className="p-3 text-muted">{col}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            return <p key={i} className="mb-5" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-yellow-500 hover:underline">$1</a>') }} />;
          })}
        </div>

        {/* Transaction Actions Hub (Contextual Internal Linking) */}
        <section className="bg-[#111520] border border-white/5 rounded-2xl p-6 sm:p-8 text-center my-12">
          <h4 className="font-h font-black text-lg text-white uppercase tracking-wider mb-2">Ready to Start Trading?</h4>
          <p className="text-muted text-xs sm:text-sm max-w-[500px] mx-auto leading-relaxed mb-6">
            Maddy BGMI Store coordinates secure hands-on transactions with WhatsApp/Telegram escrow protection and local face-to-face deals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/readystocks" className="btn-action buy inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-h text-black bg-[#ffd700] hover:scale-[1.02] transition-transform">
              <ShoppingCart size={14} />
              <span>BUY VERIFIED ID</span>
            </Link>
            <Link href="/sell" className="btn-action sell inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-h text-white border border-white/10 hover:bg-white/5 hover:scale-[1.02] transition-transform">
              <Banknote size={14} />
              <span>SELL MY ID</span>
            </Link>
            <Link href="/exchange" className="btn-action exchange inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-h text-[#229ED9] bg-[#229ED9]/5 border border-[#229ED9]/20 hover:bg-[#229ED9]/10 hover:scale-[1.02] transition-transform">
              <RefreshCw size={14} />
              <span>EXCHANGE ID</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
