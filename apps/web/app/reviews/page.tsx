/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Award } from "lucide-react";
import { getReviews } from "../actions";
import ReviewsClient, { SerializedReview } from "./ReviewsClient";
import { AggregateRatingSchema, BreadcrumbSchema } from "../../components/SEO";

export const metadata: Metadata = {
  title: "Customer Reviews | Maddy BGMI Store Verified Trust Score",
  description: "Read real client reviews and successful middleman transaction ratings for Maddy BGMI Store. Safe account delivery and UC transfer verified by South Indian gamers.",
  alternates: {
    canonical: "/reviews",
  },
};

export default async function ReviewsPage() {
  const res = await getReviews(0);
  const initialReviews = res.success && res.reviews 
    ? res.reviews.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString()
      })) as SerializedReview[]
    : [];

  const stats = {
    averageRating: res.averageRating || 5.0,
    totalReviews: res.totalReviews || 0
  };

  const hasMore = res.success && res.reviews ? res.reviews.length === 6 : false;

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      {/* 1. Inject Structured Ratings Schemas */}
      {stats.totalReviews > 0 && (
        <AggregateRatingSchema
          ratingValue={stats.averageRating}
          reviewCount={stats.totalReviews}
        />
      )}

      {/* 2. Inject Breadcrumbs Schema */}
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://maddybgmistore.in" },
          { name: "Reviews", item: "https://maddybgmistore.in/reviews" },
        ]}
      />

      {/* HERO BANNER */}
      <section style={{
        position: "relative",
        width: "100%",
        minHeight: "60vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden"
      }}>
        <img 
          src="/reviews-banner.webp" 
          alt="Maddy BGMI Store Customer Reviews Banner" 
          style={{ 
            position: "absolute", inset: 0, width: "100%", height: "100%", 
            objectFit: "cover", filter: "brightness(0.5)" 
          }} 
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(8,10,15,0.4) 0%, transparent 40%, transparent 60%, rgba(8,10,15,0.95) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%" }}>
          <div className="badge mb-4 animate-pulse">
            <Award size={14} style={{ marginRight: "6px" }} /> 100% Satisfied Customers
          </div>
          <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,72px)", fontWeight: 900 }} className="uppercase text-white leading-none">
            What Our<br /><span className="g">Buyers Say</span>
          </h1>
          <p style={{ color: "rgba(234,234,234,0.85)", fontSize: "15px", maxWidth: "600px", margin: "20px auto 0", lineHeight: 1.6 }}>
            Explore thousands of real transaction proofs and reviews from South Indian players. Real feedback, 100% verified safety.
          </p>
        </div>
      </section>

      {/* Interactive Client Section */}
      <ReviewsClient 
        initialReviews={initialReviews}
        initialStats={stats}
        initialHasMore={hasMore}
      />
    </div>
  );
}
