/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "./posts";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "BGMI Guides & Informational Hub | Blog",
  description: "Read expert BGMI account buying guides, account value calculator tips, safe trading instructions, mummy skins, and upgradable X-Suits tutorials.",
  keywords: [
    "BGMI Account Buying Guide",
    "BGMI Mythics Explained",
    "Safe BGMI Trading Guide",
    "BGMI Account Value Calculator",
    "BGMI Blog",
  ],
};

export default function BlogIndexPage() {
  return (
    <div className="blog-index-page">
      {/* Cinematic Hero Banner */}
      <section className="blog-hero">
        <div className="overlay" />
        <div className="blog-hero-content text-center">
          <span className="badge mb-4">
            <BookOpen size={12} className="mr-1 text-gold" /> Learning Center
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-h uppercase text-white leading-none">
            Guides &amp; <span className="g">Resources</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Everything you need to know about buying, selling, and exchanging BGMI IDs safely in South India.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 px-5 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug}
              className="group flex flex-col justify-between bg-[#111520]/80 border border-white/5 rounded-2xl overflow-hidden shadow-lg hover:border-yellow-500/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                {/* Header Image */}
                <div className="relative aspect-video bg-black/40 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[#080a0f]/80 backdrop-blur-md border border-white/10 text-yellow-500 text-[9px] font-black uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                {/* Metadata & Title */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-muted text-[11px] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-h font-black text-lg text-white group-hover:text-yellow-500 leading-snug mb-3 transition-colors duration-200">
                    {post.title}
                  </h2>

                  <p className="text-muted text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-yellow-500 group-hover:text-white uppercase tracking-wider transition-colors duration-150"
                >
                  <span>Read Article</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .blog-index-page {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .blog-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/guides-banner.jpg') no-repeat center center;
          background-size: cover;
        }
        .blog-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.95) 100%);
        }
        .blog-hero-content {
          position: relative;
          z-index: 5;
          padding: 0 20px;
        }
        .g {
          background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffd700;
        }
      `}</style>
    </div>
  );
}
