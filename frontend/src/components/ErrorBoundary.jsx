import { Component } from "react";

/**
 * ErrorBoundary — catches runtime errors inside any child component tree
 * and renders a branded fallback UI instead of a full white-screen crash.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; wire to Sentry/Datadog in production
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080A0F",
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "var(--font-b, system-ui)",
        }}>
          {/* Ambient glow */}
          <div style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Icon */}
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            fontSize: "32px",
          }}>
            ⚠️
          </div>

          <h2 style={{
            fontFamily: "var(--font-h, system-ui)",
            fontSize: "clamp(20px, 4vw, 28px)",
            fontWeight: 700,
            color: "#EAEAEA",
            letterSpacing: "1px",
            marginBottom: "12px",
            textTransform: "uppercase",
          }}>
            Something went wrong
          </h2>

          <p style={{
            color: "#7A8499",
            fontSize: "14px",
            lineHeight: 1.7,
            maxWidth: "420px",
            marginBottom: "32px",
          }}>
            An unexpected error occurred on this page. Your data is safe.
            Try refreshing or going back to the home page.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #FFD700, #FF6B35)",
                color: "#000",
                fontFamily: "var(--font-h, system-ui)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Try Again
            </button>

            <a
              href="/"
              style={{
                padding: "12px 28px",
                borderRadius: "8px",
                background: "transparent",
                color: "#EAEAEA",
                fontFamily: "var(--font-h, system-ui)",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFD700"; e.currentTarget.style.color = "#FFD700"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#EAEAEA"; }}
            >
              ← Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
