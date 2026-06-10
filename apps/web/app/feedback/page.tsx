/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element, @next/next/no-html-link-for-pages */
"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SocialFloat from "../../components/SocialFloat";
import { MessageSquare, Star, Send, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitFeedback } from "../actions";
import { toast } from "sonner";
import Link from "next/link";

export default function CustomerFeedbackPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [desiredItems, setDesiredItems] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    if (!comment.trim()) return toast.error("Please tell us how we can improve");

    setSubmitting(true);
    try {
      const res = await submitFeedback(name, stars, comment, desiredItems, phone);
      if (res.success) {
        toast.success("Thank you for your valuable feedback! 🚀");
        setSubmitted(true);
      } else {
        throw new Error(res.error || "Failed to submit");
      }
    } catch (err: any) {
      console.warn("Feedback submit error:", err.message);
      toast.error("Submission failed. You can direct-message us on WhatsApp!");
      // Allow fallback view
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerWhatsAppFeedback = () => {
    const textStr = `Hi Maddy!\n\n*Customer Feedback Form*\n*Name:* ${name}\n*Rating:* ${"⭐".repeat(stars)}\n*Feedback:* ${comment}\n*What I Want:* ${desiredItems || "N/A"}\n*Phone:* ${phone || "N/A"}`;
    const enc = encodeURIComponent(textStr);
    window.open(`https://wa.me/+919025391516?text=${enc}`, "_blank");
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      
      {/* Banner */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden text-center">
        <img src="/customer-feedback-banner.jpg" alt="Customer Feedback"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] brightness-50 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080a0f]/50 via-transparent to-[#080a0f] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05)_0%,transparent_65%)] z-0" />
        
        <div className="relative z-10 px-[5%] max-w-[800px] flex flex-col items-center">
          <div className="flex items-center justify-center px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/80 text-[10px] font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            STORE IMPROVEMENT
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black font-h leading-[1.1] mb-6 text-white drop-shadow-2xl">
            Customer <span className="text-yellow-500">Feedback</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-[600px] mx-auto leading-relaxed drop-shadow-lg">
            Your ideas and suggestions help us grow! Tell us what accounts, in-game items, or features you want us to add!
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-[5%] pb-32">
        <div className="max-w-[700px] mx-auto relative z-10">
          
          {submitted ? (
            <div className="p-10 rounded-3xl bg-[#0a0c10] border border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.05)] text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-yellow-500" />
              </div>
              <h2 className="text-3xl font-black font-h text-white mb-4">
                Feedback Submitted!
              </h2>
              <p className="text-muted text-sm leading-relaxed max-w-[500px] mx-auto mb-8">
                We have received your suggestions. We review every customer request to add the items, accounts, and UC packs you desire most. Thank you for making Maddy BGMI Store South India's #1 choice!
              </p>

              <button 
                onClick={triggerWhatsAppFeedback} 
                className="px-6 py-3 rounded-xl font-bold tracking-widest text-xs uppercase bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors mb-6"
              >
                Send Backup Copy via WhatsApp
              </button>

              <div>
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-yellow-500 uppercase tracking-widest hover:text-yellow-400 transition-colors no-underline">
                  Back to Store Home <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-10 rounded-3xl bg-[#0a0d14] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-h text-white mb-1">Feedback Submission Form</h3>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Public or Direct Admin Feedback</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[#111520] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-yellow-500/50 transition-colors" 
                      placeholder="e.g. Rahul Kumar" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2">WhatsApp Phone (Optional)</label>
                    <input 
                      type="tel" 
                      className="w-full bg-[#111520] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-yellow-500/50 transition-colors" 
                      placeholder="e.g. +91 90253 *****" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Overall Store Experience Rating</label>
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star 
                        key={s} 
                        size={28}
                        fill={(hoverStars || stars) >= s ? "#eab308" : "transparent"}
                        color="#eab308"
                        onClick={() => setStars(s)}
                        onMouseEnter={() => setHoverStars(s)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted font-medium">
                    {stars === 5 ? "Excellent (5 Stars)" : stars === 4 ? "Very Good (4 Stars)" : stars === 3 ? "Good (3 Stars)" : stars === 2 ? "Need Improvements (2 Stars)" : "Disappointed (1 Star)"}
                  </span>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2">What should we improve? What are your suggestions? *</label>
                  <textarea 
                    required
                    className="w-full bg-[#111520] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-yellow-500/50 transition-colors resize-y min-h-[100px]" 
                    placeholder="Share your thoughts on prices, delivery speed, payment experience or support..." 
                    value={comment} 
                    onChange={e => setComment(e.target.value)} 
                  />
                </div>

                {/* What Customers Actually Want */}
                <div className="p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-yellow-500" />
                    <label className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest">What specific items or accounts do you want next?</label>
                  </div>
                  <textarea 
                    className="w-full bg-[#0a0d14] border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-yellow-500/50 transition-colors resize-y min-h-[80px]" 
                    placeholder="e.g. Glacier Level 4 account under ₹8k, cheaper 60 UC packs, more x-suit items, etc..." 
                    value={desiredItems} 
                    onChange={e => setDesiredItems(e.target.value)} 
                  />
                  <span className="block text-[10px] text-muted mt-3">
                    This directly notifies Maddy so we can acquire these stocks for you!
                  </span>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full flex items-center justify-center gap-2 py-4 mt-8 rounded-xl font-bold tracking-widest text-xs uppercase bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-none cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {submitting ? (
                    "Uploading suggestions..."
                  ) : (
                    <><Send size={14} /> Submit Feedback</>
                  )}
                </button>

              </form>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
