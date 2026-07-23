import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupercarGiftById } from "../../../../actions";
import Link from "next/link";
import { ArrowLeft, Car, MessageCircle, Send, CheckCircle, Zap } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const res = await getSupercarGiftById(resolvedParams.id);

  if (!res.success || !res.product) {
    return {
      title: "Supercar Not Found",
      description: "This supercar listing is not available.",
    };
  }

  const p = res.product;

  return {
    title: `${p.supercarName} - Supercar Gifting | Maddy BGMI Store`,
    description: `Buy the ${p.supercarName} supercar in BGMI via our premium gifting service. Authorized and secure delivery.`,
    openGraph: {
      title: `${p.supercarName} - BGMI Supercar Gift`,
      description: `Premium supercar gifting service for ${p.supercarName}.`,
      images: p.imageUrl ? [{ url: p.imageUrl }] : [],
    },
  };
}

const contactText = (name: string, id: string) => 
  `Hi Maddy! I am interested in buying the ${name} Supercar (ID: ${id}) via your premium Gifting service. Please guide me.`;

const formatVehicle = (vehicle: string | null) => {
  if (!vehicle) return "UAZ";
  const v = vehicle.toUpperCase();
  if (["DACIA", "MIRADO", "COUPE", "ROADSTER"].includes(v) || v.includes("SEDEN") || v.includes("SEDAN")) {
    return `Sedan (${vehicle})`;
  }
  if (v.includes("UAZ")) {
    return `UAZ (${vehicle})`;
  }
  if (v.includes("BUGGY")) {
    return `Buggy`;
  }
  return vehicle;
};

export default async function SupercarDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const res = await getSupercarGiftById(resolvedParams.id);

  if (!res.success || !res.product) {
    notFound();
  }

  const product = res.product;
  const sellingPrice = parseFloat(product.sellingPrice).toLocaleString("en-IN");
  const offerPrice = parseFloat(product.offerPrice).toLocaleString("en-IN");

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "80px", paddingBottom: "100px", color: "#fff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5%" }}>
        
        {/* Back Button */}
        <Link 
          href="/services/supercar"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,0.7)", textDecoration: "none",
            marginBottom: "30px", fontSize: "14px", fontWeight: 600,
            transition: "color 0.2s"
          }}
          className="hover:text-gold"
        >
          <ArrowLeft size={16} /> Back to Showroom
        </Link>

        {/* Product Container */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px", background: "rgba(17, 21, 32, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "24px",
          padding: "30px", backdropFilter: "blur(10px)"
        }}>
          
          {/* Image Section */}
          <div style={{
            background: "rgba(0,0,0,0.5)", borderRadius: "16px", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", position: "relative",
            minHeight: "300px"
          }}>
            {product.carType && (
              <div style={{
                position: "absolute", top: "16px", left: "16px",
                background: "linear-gradient(135deg, var(--color-gold), var(--color-orange))",
                color: "#000", fontSize: "12px", fontWeight: 900,
                padding: "6px 14px", borderRadius: "8px", textTransform: "uppercase"
              }}>
                {product.carType}
              </div>
            )}
            
            {product.promoTag && product.promoTag !== "None" && (
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255, 215, 0, 0.2)", backdropFilter: "blur(4px)",
                border: "1px solid var(--color-border-gold)", color: "var(--color-gold)",
                fontSize: "12px", fontWeight: 900,
                padding: "6px 14px", borderRadius: "8px", textTransform: "uppercase"
              }}>
                {product.promoTag}
              </div>
            )}
            
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.supercarName}
                style={{ width: "100%", height: "auto", maxHeight: "400px", objectFit: "contain" }}
              />
            ) : (
              <span style={{ color: "rgba(255,255,255,0.3)" }}>No Image</span>
            )}
          </div>

          {/* Details Section */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ 
              fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, 
              fontFamily: "var(--font-h)", marginBottom: "16px",
              lineHeight: 1.2, textShadow: "0 2px 10px rgba(0,0,0,0.5)"
            }}>
              {product.supercarName}
            </h1>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              padding: "8px 16px", borderRadius: "10px", width: "fit-content",
              marginBottom: "30px", color: "rgba(255,255,255,0.8)"
            }}>
              <Car size={16} style={{ color: "var(--color-gold)" }} />
              <span style={{ fontSize: "14px" }}>
                Applicable Vehicle - <strong style={{ color: "#fff", textTransform: "capitalize" }}>
                  {formatVehicle(product.applicableVehicle)}
                </strong>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "30px" }}>
              <span style={{
                fontSize: "20px", fontWeight: 500, color: "rgba(255,255,255,0.4)",
                textDecoration: "line-through", fontFamily: "var(--font-h)"
              }}>
                ₹{sellingPrice}
              </span>
              <span style={{
                fontSize: "42px", fontWeight: 900, color: "var(--color-gold)",
                fontFamily: "var(--font-h)", textShadow: "0 2px 15px rgba(255,215,0,0.2)"
              }}>
                ₹{offerPrice}
              </span>
            </div>

            <div style={{
              background: "rgba(20,20,30,0.5)", border: "1px solid rgba(255,215,0,0.1)",
              borderRadius: "16px", padding: "20px", marginBottom: "30px"
            }}>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-gold)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={14} /> Service Guarantees
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                <li style={{ display: "flex", gap: "8px" }}><Zap size={14} style={{ color: "#4CD964", flexShrink: 0, marginTop: "2px" }} /> Instant processing upon payment confirmation</li>
                <li style={{ display: "flex", gap: "8px" }}><CheckCircle size={14} style={{ color: "#007AFF", flexShrink: 0, marginTop: "2px" }} /> 100% Authorized in-game gifting system</li>
                <li style={{ display: "flex", gap: "8px" }}><CheckCircle size={14} style={{ color: "#007AFF", flexShrink: 0, marginTop: "2px" }} /> Zero risk of account ban or restrictions</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <a 
                href={`https://wa.me/+919025391516?text=${encodeURIComponent(contactText(product.supercarName, product.id))}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                  padding: "16px", borderRadius: "12px",
                  background: "#25D366", color: "#fff",
                  fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "15px",
                  textDecoration: "none"
                }}
              >
                <MessageCircle size={18} /> Buy on WhatsApp
              </a>
              <a 
                href={`https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(product.supercarName, product.id))}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                  padding: "16px", borderRadius: "12px",
                  background: "#0088cc", color: "#fff",
                  fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "15px",
                  textDecoration: "none"
                }}
              >
                <Send size={18} /> Buy on Telegram
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
