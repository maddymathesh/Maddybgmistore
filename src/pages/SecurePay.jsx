import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, CheckCircle, Copy,
  AlertTriangle, CreditCard, ChevronDown, ChevronUp, Lock
} from "lucide-react";

export default function SecurePay() {
  const { user } = useAuth();
  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // User Specific Details
  const upiId = "maddyxpay@ybl";
  const payeeName = "MATHESHWARAN R";
  const currency = "INR";
  
  // Base UPI Link
  const baseUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;
  
  // Specific App Links
  const gpayLink = `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;
  const phonepeLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;
  const paytmLink = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "84px", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#080a0f" }}>
        <div style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "40px 20px"
        }}>
          <div style={{
            background: "var(--card)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "16px",
            padding: "40px 30px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Top Glow */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "150px", height: "150px", background: "rgba(255,215,0,0.1)",
              filter: "blur(50px)", zIndex: 0
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", background: "rgba(34,197,94,0.1)", padding: "12px", borderRadius: "50%", marginBottom: "16px" }}>
                <ShieldCheck size={32} color="#22c55e" />
              </div>
              <h1 style={{ fontFamily: "var(--font-h)", fontSize: "28px", marginBottom: "8px", color: "#fff" }}>Secure Checkout</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "30px" }}>
                Scan the QR code or click a button below to complete your payment securely.
              </p>

              {/* QR Code Section */}
              <div style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "12px",
                display: "inline-block",
                marginBottom: "20px"
              }}>
                <img 
                  src="/payqr.png" 
                  alt="Payment QR Code" 
                  style={{ width: "220px", height: "220px", objectFit: "contain", display: "block" }} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/220x220/EEE/31343C?text=Scan+to+Pay";
                  }}
                />
              </div>

              <div style={{
                background: "rgba(255,255,255,0.05)",
                padding: "12px 20px",
                borderRadius: "8px",
                marginBottom: "24px",
                border: "1px dashed rgba(255,255,255,0.2)"
              }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Payee Name</span>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>{payeeName}</div>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>UPI ID</span>
                {/* Clickable Copy UPI ID */}
                <button
                  onClick={handleCopyUpi}
                  title="Click to copy UPI ID"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", marginTop: "8px", padding: "10px 14px",
                    background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,215,0,0.07)",
                    border: copied ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,215,0,0.25)",
                    borderRadius: "8px", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: "700", color: copied ? "#22c55e" : "var(--gold)", letterSpacing: "0.5px" }}>
                    {upiId}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: copied ? "#22c55e" : "rgba(255,255,255,0.45)", flexShrink: 0, marginLeft: "10px" }}>
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>

              {/* Payment Buttons */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap" }}>Pay Via</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Google Pay */}
                  <a href={gpayLink} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "#fff", color: "#3c4043",
                    padding: "13px 20px", borderRadius: "12px",
                    fontWeight: 700, textDecoration: "none", fontSize: "15px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                    position: "relative", overflow: "hidden"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(66,133,244,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.25)"; }}>
                    {/* Google Pay Logo */}
                    <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="18" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#4285F4">G</text>
                      <text x="11" y="18" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#EA4335">P</text>
                      <text x="21" y="18" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#4285F4">a</text>
                      <text x="29" y="18" fontFamily="Arial" fontWeight="700" fontSize="16" fill="#34A853">y</text>
                    </svg>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "#888", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#3c4043", lineHeight: 1.4 }}>Google Pay</div>
                    </div>
                    <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3c4043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </a>

                  {/* PhonePe */}
                  <a href={phonepeLink} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "linear-gradient(135deg, #5f259f, #7c3aed)",
                    color: "#fff", padding: "13px 20px", borderRadius: "12px",
                    fontWeight: 700, textDecoration: "none", fontSize: "15px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 12px rgba(95,37,159,0.35)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(95,37,159,0.55)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(95,37,159,0.35)"; }}>
                    {/* PhonePe Logo Icon */}
                    <div style={{ width: "38px", height: "38px", background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#5f259f"/>
                        <path d="M14 12h7.5a6.5 6.5 0 0 1 0 13H18v7l-4-4V12z" fill="#fff"/>
                        <circle cx="21.5" cy="18.5" r="2.5" fill="#5f259f"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>PhonePe</div>
                    </div>
                    <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </a>

                  {/* Paytm */}
                  <a href={paytmLink} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "linear-gradient(135deg, #002970, #00b9f1)",
                    color: "#fff", padding: "13px 20px", borderRadius: "12px",
                    fontWeight: 700, textDecoration: "none", fontSize: "15px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 12px rgba(0,185,241,0.25)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,185,241,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,185,241,0.25)"; }}>
                    {/* Paytm Logo */}
                    <div style={{ width: "38px", height: "38px", background: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: "3px" }}>
                      <svg viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="34">
                        <text x="0" y="16" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#002970">Pay</text>
                        <text x="28" y="16" fontFamily="Arial" fontWeight="900" fontSize="16" fill="#00b9f1">tm</text>
                      </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>Paytm</div>
                    </div>
                    <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </a>

                  {/* Any UPI App */}
                  <a href={baseUpiUrl} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                    color: "#fff", padding: "13px 20px", borderRadius: "12px",
                    fontWeight: 700, textDecoration: "none", fontSize: "15px",
                    border: "1px solid rgba(255,215,0,0.25)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,215,0,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)"; }}>
                    {/* UPI Logo */}
                    <div style={{ width: "38px", height: "38px", background: "rgba(255,215,0,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,215,0,0.2)" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="6" width="18" height="13" rx="2" stroke="#FFD700" strokeWidth="1.5"/>
                        <path d="M3 10h18" stroke="#FFD700" strokeWidth="1.5"/>
                        <path d="M7 15h4" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="17" cy="15" r="1.5" fill="#FFD700"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500, lineHeight: 1 }}>Open any</div>
                      <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4, color: "var(--gold)" }}>Other UPI App</div>
                    </div>
                    <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </a>
                </div>
              </div>

              {/* Bank Transfer Toggle */}
              <div style={{ marginBottom: "24px" }}>
                <button 
                  onClick={() => setShowBank(!showBank)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,215,0,0.1)", color: "#fff", cursor: "pointer",
                    fontSize: "14px", fontWeight: "600", transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CreditCard size={18} color="var(--gold)" />
                    Bank Transfer Details
                  </div>
                  {showBank ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showBank && (
                  <div style={{
                    marginTop: "12px", padding: "20px", borderRadius: "10px",
                    background: "rgba(10,12,20,0.6)", border: "1px solid rgba(255,215,0,0.15)",
                    textAlign: "left", animation: "slideDown 0.3s ease-out"
                  }}>
                    {user ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Bank Name</div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>FEDERAL BANK</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Account Type</div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>SAVINGS ACCOUNT</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Account Holder</div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--gold)" }}>MATHESHWARAN R</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Account Number</div>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", letterSpacing: "1px" }}>23550100026910</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>IFSC Code</div>
                          <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--gold)" }}>FDRL0002355</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Branch</div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>Alagusenai</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "10px 0" }}>
                        <Lock size={24} color="rgba(255,255,255,0.3)" style={{ marginBottom: "12px" }} />
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
                          Login required to view bank transfer details for security.
                        </p>
                        <Link to="/login" style={{
                          display: "inline-block", padding: "8px 24px", borderRadius: "6px",
                          background: "var(--gold)", color: "#000", fontWeight: "700",
                          textDecoration: "none", fontSize: "13px"
                        }}>
                          Login Now
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Verification Note */}
              <div style={{
                padding: "20px",
                background: "rgba(249, 115, 22, 0.1)",
                borderLeft: "4px solid #f97316",
                borderRadius: "4px 8px 8px 4px",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <AlertTriangle size={20} color="#f97316" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={{ margin: "0 0 6px 0", color: "#f97316", fontSize: "15px" }}>Verification Required</h4>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}>
                      Please verify that the name matches <strong>{payeeName}</strong> before confirming the payment.
                    </p>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: "1.5" }}>
                      After payment, take a screenshot and share it with us to complete your order.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#fff", fontWeight: "600" }}>
                      <CheckCircle size={14} color="#22c55e" />
                      <span>Share screenshot for verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
