"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      background: "var(--color-bg)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "0 24px"
    }}>
      {/* Background Glows */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(255, 140, 0, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        maxWidth: "600px"
      }}>
        
        {/* Holographic 404 Header */}
        <h1 style={{
          fontFamily: "var(--font-h)",
          fontSize: "clamp(120px, 15vw, 180px)",
          fontWeight: 900,
          lineHeight: "none",
          margin: 0,
          background: "linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.1) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-2px",
          filter: "drop-shadow(0 2px 20px rgba(255, 215, 0, 0.15))",
          userSelect: "none"
        }}>
          404
        </h1>
        
        {/* Glowing Divider */}
        <div style={{
          width: "120px",
          height: "2px",
          background: "linear-gradient(to right, transparent, var(--color-gold), transparent)",
          margin: "24px 0",
          boxShadow: "0 0 8px rgba(255, 215, 0, 0.5)",
          opacity: 0.6
        }} />
        
        {/* Title & Subtitle */}
        <h2 style={{
          fontFamily: "var(--font-h)",
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 900,
          color: "#fff",
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          Signal Lost
        </h2>
        <p style={{
          color: "var(--color-muted)",
          fontSize: "14.5px",
          lineHeight: 1.6,
          maxWidth: "460px",
          margin: "0 auto 40px"
        }}>
          The transmission was interrupted. The page you are looking for has been moved, deleted, or never existed in this sector.
        </p>

        {/* Buttons */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
          width: "100%"
        }}>
          <Link href="/" 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              fontSize: "13.5px",
              fontWeight: 700,
              borderRadius: "30px",
              textDecoration: "none",
              background: "linear-gradient(to right, var(--color-gold), #ff8c00)",
              color: "#000",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "0 4px 20px rgba(255, 215, 0, 0.25)",
              transition: "all 0.2s"
            }}
            className="notfound-btn-primary"
          >
            <Home size={16} />
            <span>Return to Base</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 32px",
              fontSize: "13.5px",
              fontWeight: 700,
              borderRadius: "30px",
              background: "transparent",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            className="notfound-btn-outline"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      <style>{`
        .notfound-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 215, 0, 0.35) !important;
        }
        .notfound-btn-outline:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
