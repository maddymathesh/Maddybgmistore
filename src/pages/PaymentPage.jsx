import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getFunctions, httpsCallable } from "firebase/functions";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShieldCheck, CheckCircle, Copy,
  AlertTriangle, CreditCard, ChevronDown, ChevronUp, Lock, XCircle
} from "lucide-react";

const FALLBACK_ENCRYPTED_UPI = "VFFWUUBIQlRAcEtXVQ==";
const FALLBACK_ENCRYPTED_NAME = "dHFmfXxjemJ4YnN7GWI=";
const PAYMENT_PIN = "9025";
const BANK_PIN = "1516";

function parseDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value === "number") return new Date(value);
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
}

function getSecondsLeft(expiresAt) {
  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 1000));
}

function formatTimer(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function decrypt(base64, key) {
  try {
    const text = atob(base64);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch {
    return "";
  }
}

function CountdownBadge({ secondsLeft, totalSeconds }) {
  const isCritical = secondsLeft <= 60;
  const progress = Math.max(0, Math.min(1, secondsLeft / Math.max(totalSeconds || 600, 1)));
  const strokeDasharray = 126;
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 12px",
      borderRadius: "999px",
      background: isCritical ? "rgba(239,68,68,0.1)" : "rgba(255,215,0,0.08)",
      border: isCritical ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,215,0,0.2)",
      marginBottom: "20px",
    }}>
      <svg width="34" height="34" viewBox="0 0 50 50" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={isCritical ? "#ef4444" : "var(--gold)"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.7s ease, stroke 0.2s ease",
            filter: isCritical ? "drop-shadow(0 0 6px rgba(239,68,68,0.8))" : "drop-shadow(0 0 6px rgba(255,215,0,0.65))",
          }}
        />
      </svg>
      <div style={{ textAlign: "left", lineHeight: 1.1 }}>
        <div style={{ color: isCritical ? "#ef4444" : "var(--gold)", fontFamily: "monospace", fontWeight: 900, fontSize: "17px" }}>
          {formatTimer(secondsLeft)}
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>
          Link timer
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const { token } = useParams();

  const [isValidLink, setIsValidLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const [bankUnlocked, setBankUnlocked] = useState(false);
  const [bankPin, setBankPin] = useState("");
  const [bankError, setBankError] = useState("");

  const expiresAt = useMemo(() => parseDate(paymentData?.expiresAt), [paymentData]);

  useEffect(() => {
    let cancelled = false;

    const checkLink = async () => {
      if (!token) {
        setIsValidLink(false);
        setLoading(false);
        return;
      }

      try {
        const functions = getFunctions();
        const verifyPaymentLink = httpsCallable(functions, "verifyPaymentLink");
        const result = await verifyPaymentLink({ token });
        const payload = result.data;

        if (!cancelled && payload?.valid) {
          setPaymentData(payload.link);
          setSecondsLeft(getSecondsLeft(parseDate(payload.link?.expiresAt)));
          setIsValidLink(true);
        } else if (!cancelled) {
          setIsValidLink(false);
        }
      } catch (err) {
        console.error("Error verifying payment link:", err);
        if (!cancelled) setIsValidLink(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkLink();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!isValidLink || !expiresAt) return undefined;

    const timer = window.setInterval(() => {
      const next = getSecondsLeft(expiresAt);
      setSecondsLeft(next);
      if (next <= 0) {
        setIsValidLink(false);
        toast.error("Payment link expired");
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt, isValidLink]);

  const encryptedUpi = paymentData?.encryptedUpi || FALLBACK_ENCRYPTED_UPI;
  const encryptedName = paymentData?.encryptedName || FALLBACK_ENCRYPTED_NAME;
  const linkPin = paymentData?.pin || PAYMENT_PIN;
  const totalSeconds = Number(paymentData?.expiresInMinutes || 10) * 60;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === linkPin) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleBankUnlock = (e) => {
    e.preventDefault();
    if (bankPin === BANK_PIN) {
      setBankUnlocked(true);
      setBankError("");
    } else {
      setBankError("Incorrect PIN.");
      setBankPin("");
    }
  };

  const upiId = isUnlocked ? (import.meta.env.VITE_PAYMENT_UPI_ID || decrypt(encryptedUpi, pin)) : "";
  const payeeName = isUnlocked ? (import.meta.env.VITE_PAYMENT_PAYEE_NAME || decrypt(encryptedName, pin)) : "";
  const amount = Number(paymentData?.amount || 0);
  const orderId = paymentData?.orderId || token || "";
  const currency = "INR";

  const paymentParams = `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=${currency}&tn=${encodeURIComponent(orderId)}`;
  const baseUpiUrl = `upi://pay?${paymentParams}`;
  const gpayLink = `gpay://upi/pay?${paymentParams}`;
  const phonepeLink = `phonepe://pay?${paymentParams}`;
  const paytmLink = `paytmmp://pay?${paymentParams}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: "84px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080a0f", color: "#fff" }}>
          Loading secure payment gateway...
        </div>
        <Footer />
      </>
    );
  }

  if (!isValidLink) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: "84px", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#080a0f" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <div style={{ background: "var(--card)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "16px", padding: "40px 30px", maxWidth: "500px", width: "100%", textAlign: "center" }}>
              <div style={{ display: "inline-flex", background: "rgba(239,68,68,0.1)", padding: "16px", borderRadius: "50%", marginBottom: "20px" }}>
                <XCircle size={36} color="#ef4444" />
              </div>
              <h1 style={{ fontFamily: "var(--font-h)", fontSize: "24px", marginBottom: "8px", color: "#fff" }}>Link Invalid or Expired</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "24px" }}>
                This payment link is no longer active. Please contact support for a new link.
              </p>
              <Link to="/connectwithus" className="btn btn-gold" style={{ display: "inline-block", padding: "12px 24px" }}>Contact Support</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "150px", height: "150px", background: "rgba(255,215,0,0.1)",
              filter: "blur(50px)", zIndex: 0
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <CountdownBadge secondsLeft={secondsLeft} totalSeconds={totalSeconds} />

              {secondsLeft <= 60 && (
                <div style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.22)",
                  color: "#fca5a5",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "18px"
                }}>
                  This link expires in less than 1 minute.
                </div>
              )}

              {!isUnlocked ? (
                <div style={{ padding: "8px 0 20px" }}>
                  <div style={{ display: "inline-flex", background: "rgba(255,215,0,0.1)", padding: "16px", borderRadius: "50%", marginBottom: "20px" }}>
                    <Lock size={36} color="var(--gold)" />
                  </div>
                  <h1 style={{ fontFamily: "var(--font-h)", fontSize: "24px", marginBottom: "8px", color: "#fff" }}>Secured Payment page</h1>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "24px" }}>
                    Please enter the PIN provided by admin to access the payment details.
                  </p>

                  <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter PIN"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        padding: "14px 20px",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "20px",
                        textAlign: "center",
                        letterSpacing: "4px",
                        width: "200px",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      autoFocus
                    />
                    {error && <div style={{ color: "#ef4444", fontSize: "13px", fontWeight: "600" }}>{error}</div>}

                    <button
                      type="submit"
                      style={{
                        background: "var(--gold)",
                        color: "#000",
                        fontWeight: "700",
                        padding: "14px 32px",
                        borderRadius: "10px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "15px",
                        marginTop: "8px",
                        width: "200px",
                        boxShadow: "0 4px 14px rgba(255,215,0,0.3)",
                        transition: "transform 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      Unlock
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div style={{ display: "inline-flex", background: "rgba(34,197,94,0.1)", padding: "12px", borderRadius: "50%", marginBottom: "16px" }}>
                    <ShieldCheck size={32} color="#22c55e" />
                  </div>
                  <h1 style={{ fontFamily: "var(--font-h)", fontSize: "28px", marginBottom: "8px", color: "#fff" }}>Secure Checkout</h1>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginBottom: "18px" }}>
                    Scan the QR code or click a button below to complete your payment securely.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9px", padding: "10px" }}>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>Order ID</div>
                      <div style={{ color: "var(--gold)", fontSize: "13px", fontWeight: 900, overflowWrap: "anywhere" }}>{orderId}</div>
                    </div>
                    <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: "9px", padding: "10px" }}>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>Amount</div>
                      <div style={{ color: "#22c55e", fontSize: "18px", fontWeight: 900 }}>₹{amount.toLocaleString("en-IN")}</div>
                    </div>
                  </div>

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
                      <span style={{ fontSize: "16px", fontWeight: "700", color: copied ? "#22c55e" : "var(--gold)", letterSpacing: "0.5px", overflowWrap: "anywhere" }}>
                        {upiId}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: copied ? "#22c55e" : "rgba(255,255,255,0.45)", flexShrink: 0, marginLeft: "10px" }}>
                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", whiteSpace: "nowrap" }}>Pay Via</span>
                      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                        <img src="/gpay-logo.svg" alt="Google Pay" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "4px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "#888", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: "#3c4043", lineHeight: 1.4 }}>Google Pay</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3c4043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </a>

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
                        <img src="/phonepe-logo.svg" alt="PhonePe" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>PhonePe</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </a>

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
                        <img src="/paytm-logo.svg" alt="Paytm" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "4px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>Paytm</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </a>

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
                        <img src="/upi-logo.svg" alt="UPI" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "4px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500, lineHeight: 1 }}>Open any</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4, color: "var(--gold)" }}>Other UPI App</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </a>
                    </div>
                  </div>

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
                        {!bankUnlocked ? (
                          <form onSubmit={handleBankUnlock} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "10px 0" }}>
                            <Lock size={24} color="rgba(255,255,255,0.3)" style={{ marginBottom: "4px" }} />
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "8px", textAlign: "center" }}>
                              Enter the secondary PIN to unlock bank details.
                            </p>
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="Bank PIN"
                              value={bankPin}
                              onChange={(e) => setBankPin(e.target.value)}
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,215,0,0.3)",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "16px",
                                textAlign: "center",
                                letterSpacing: "4px",
                                width: "160px",
                                outline: "none"
                              }}
                              autoFocus
                            />
                            {bankError && <div style={{ color: "#ef4444", fontSize: "12px", fontWeight: "600" }}>{bankError}</div>}
                            <button type="submit" className="btn btn-gold" style={{ padding: "8px 24px", fontSize: "13px" }}>
                              Unlock Bank Details
                            </button>
                          </form>
                        ) : (
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
                        )}
                      </div>
                    )}
                  </div>

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
                </>
              )}
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
