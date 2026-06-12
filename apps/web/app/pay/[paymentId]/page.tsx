/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";



import Link from "next/link";
import { toast } from "sonner";
import {
  ShieldCheck, CheckCircle, Copy, AlertTriangle, CreditCard,
  ChevronDown, ChevronUp, Lock, XCircle, Send, MessageCircle, Clock,
  ExternalLink, ArrowLeft, RefreshCw, Key, ShieldAlert, Download, Camera
} from "lucide-react";
import { getPaymentLink, verifyPaymentPin, submitPaymentProof } from "../../actions";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  const [loading, setLoading] = useState(true);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [adminSettings, setAdminSettings] = useState<any>(null);

  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);
  const [downloadingQr, setDownloadingQr] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // PIN Protected Gateways
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [shake, setShake] = useState(false);

  // Fetch Payment Link Details on Mount
  const loadPaymentLink = async () => {
    if (!paymentId) {
      setIsValidLink(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getPaymentLink(paymentId);
      if (res.link) {
        setPaymentData(res.link);
        setAdminSettings(res.adminSettings);
        setFailedAttempts(res.link.failedAttempts || 0);
      }

      if (res.success && res.link) {
        setIsValidLink(true);
        if (!res.requiresPin) {
          setIsUnlocked(true);
        }
      } else {
        setIsValidLink(false);
        setReason(res.reason || "not_found");
        if (res.reason === "paid") {
          setIsUnlocked(true);
        }
      }
    } catch (err) {
      console.error("Error loading payment link:", err);
      setIsValidLink(false);
      setReason("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentLink();
  }, [paymentId]);

  // Countdown timer for expiresAt
  useEffect(() => {
    if (!paymentData?.expiresAt) return;
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(paymentData.expiresAt).getTime();
      const distance = expiry - now;
      
      if (distance < 0) {
        setTimeLeft("");
        setIsValidLink(false);
        setReason("expired");
        return false;
      }
      
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);
      return true;
    };

    calculateTimeLeft();
    const timer = setInterval(() => {
      const active = calculateTimeLeft();
      if (!active) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData]);

  // Keyboard support for PIN entry
  useEffect(() => {
    if (isUnlocked || !isValidLink || loading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleKeyPress("back");
      } else if (e.key === "Enter") {
        handleKeyPress("submit");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, isUnlocked, isValidLink, loading]);

  const handleKeyPress = (val: string) => {
    if (val === "back") {
      setPin(prev => prev.slice(0, -1));
      setError("");
    } else if (val === "clear") {
      setPin("");
      setError("");
    } else if (val === "submit") {
      if (pin.length === 6) {
        submitPin(pin);
      } else {
        triggerShake("Enter all 6 digits");
      }
    } else {
      if (pin.length < 6) {
        const newPin = pin + val;
        setPin(newPin);
        setError("");
        // Auto-submit on reaching 6 digits
        if (newPin.length === 6) {
          submitPin(newPin);
        }
      }
    }
  };

  const submitPin = async (inputPin: string) => {
    setError("");
    try {
      const res = await verifyPaymentPin(paymentId, inputPin);
      if (res.success) {
        setIsUnlocked(true);
        setError("");
      } else {
        if (res.locked) {
          setIsValidLink(false);
          setReason("locked_out");
        } else {
          setPin("");
          setFailedAttempts(res.failedAttempts || (failedAttempts + 1));
          triggerShake(`Incorrect PIN. ${5 - (res.failedAttempts || 0)} attempts remaining.`);
        }
      }
    } catch (err) {
      console.error("PIN validation error:", err);
      triggerShake("Server error validation. Please try again.");
    }
  };

  const triggerShake = (msg: string) => {
    setError(msg);
    setShake(true);
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setTimeout(() => setShake(false), 500);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString()).then(() => {
      setAmountCopied(true);
      setTimeout(() => setAmountCopied(false), 2000);
    });
  };

  const handleDownloadQr = async () => {
    setDownloadingQr(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MBS-QR-${paymentData?.transactionId || "PAY"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CORS fetch failed, opening QR code image directly in new tab for manual download:", error);
      window.open(qrCodeUrl, "_blank");
    } finally {
      setDownloadingQr(false);
    }
  };

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkvyv4ooq";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "mbs_reviews";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProof(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setScreenshotUrl(data.secure_url);
        const submitRes = await submitPaymentProof(paymentId, data.secure_url);
        if (submitRes.success) {
          setProofUploaded(true);
          setIsValidLink(false);
          setReason("paid");
          toast.success("Payment proof uploaded successfully!");
        } else {
          setError(submitRes.error || "Failed to link proof to payment session");
        }
      } else {
        setError("Failed to upload screenshot to cloud storage");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading proof screenshot");
    } finally {
      setUploadingProof(false);
    }
  };

  const upiId = paymentData?.upiId || adminSettings?.payeeUpiId || "";
  const payeeName = paymentData?.payeeName || adminSettings?.payeeName || "Maddy BGMI Store";
  const amount = paymentData?.amount || 0;
  const note = paymentData?.note || `MBS Order ${paymentId?.slice(0,8)}`;

  const trParam = paymentData?.transactionId ? `&tr=${paymentData.transactionId}` : "";
  const baseUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}${trParam}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const gpayLink = `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}${trParam}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const phonepeLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}${trParam}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const paytmLink = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}${trParam}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(baseUpiUrl)}`;

  const whatsappMsg = encodeURIComponent(`Hello Maddy, I have completed the payment of ₹${amount} for Order ID: ${paymentData?.transactionId || paymentId}. Here is the payment screenshot.`);
  const whatsappUrl = `https://wa.me/+919025391516?text=${whatsappMsg}`;
  const telegramUrl = `https://t.me/MBSxMADDY17`;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loader" style={{ width: "48px", height: "48px", border: "4px solid rgba(255, 215, 0, 0.1)", borderTopColor: "var(--color-gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ fontSize: "14px", color: "var(--color-muted)", marginTop: "20px", fontFamily: "var(--font-h)", letterSpacing: "2.5px", fontWeight: 700 }}>
            ENCRYPTING TRANSACTION GATEWAY...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Handle Inactive/Revoked/Expired/Locked out links
  if (!isValidLink) {
    if (reason === "paid") {
      const confirmMsg = screenshotUrl 
        ? `Hello Maddy, I have completed the payment of ₹${amount} for Order ID: ${paymentData?.transactionId || paymentId}. Here is my uploaded proof screenshot: ${screenshotUrl}`
        : `Hello Maddy, I have completed the payment of ₹${amount} for Order ID: ${paymentData?.transactionId || paymentId}. Please confirm my order.`;
      const confirmWhatsappUrl = `https://wa.me/+919025391516?text=${encodeURIComponent(confirmMsg)}`;
      const confirmTelegramUrl = `https://t.me/MBSxMADDY17`;

      return (
        <>
          <div className="payment-page-container">
            <div className="payment-card-wrap" style={{ maxWidth: "480px" }}>
              <div className="glass-card" style={{ textAlign: "center", padding: "40px 30px", border: "1px solid rgba(16, 185, 129, 0.2)", background: "rgba(17, 21, 32, 0.75)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(16, 185, 129, 0.05)" }}>
                <div style={{ display: "inline-flex", background: "rgba(16, 185, 129, 0.08)", padding: "20px", borderRadius: "50%", marginBottom: "20px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <CheckCircle size={44} style={{ color: "var(--color-gold)" }} />
                </div>
                <h1 style={{ fontFamily: "var(--font-h)", fontSize: "22px", color: "#fff", fontWeight: 900, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Payment Successful
                </h1>
                <p style={{ color: "var(--color-muted)", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "25px", maxWidth: "360px", margin: "0 auto 25px" }}>
                  Your payment proof has been successfully logged. Our administration coordinators are verifying your transaction.
                </p>

                {/* Transaction details box */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", textAlign: "left", marginBottom: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)", fontWeight: 700, textTransform: "uppercase" }}>Transaction ID</span>
                    <span style={{ fontSize: "12px", color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>#{paymentData?.transactionId}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)", fontWeight: 700, textTransform: "uppercase" }}>Customer Name</span>
                    <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>{paymentData?.customerName}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)", fontWeight: 700, textTransform: "uppercase" }}>Amount Paid</span>
                    <span style={{ fontSize: "13px", color: "var(--color-gold)", fontWeight: 800, fontFamily: "monospace" }}>₹{Number(amount).toLocaleString("en-IN")}</span>
                  </div>
                  {paymentData?.note && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "11px", color: "var(--color-muted)", fontWeight: 700, textTransform: "uppercase" }}>Reference / Note</span>
                      <span style={{ fontSize: "11.5px", color: "#fff", lineHeight: 1.4 }}>{paymentData.note}</span>
                    </div>
                  )}
                </div>

                {screenshotUrl && (
                  <div style={{ marginBottom: "25px" }}>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--color-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", textAlign: "left" }}>Uploaded Proof</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px", borderRadius: "12px" }}>
                      <img src={screenshotUrl} alt="Uploaded Proof" style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} />
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: "11px", color: "#fff", fontWeight: 700, margin: 0 }}>screenshot_proof.png</p>
                        <a href={screenshotUrl} target="_blank" rel="noreferrer" style={{ fontSize: "10px", color: "var(--color-gold)", textDecoration: "underline", display: "inline-block", marginTop: "2px" }}>Open image in new tab</a>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <a href={confirmWhatsappUrl} target="_blank" rel="noreferrer" className="btn btn-green" style={{ justifyContent: "center", gap: "8px" }}>
                    <MessageCircle size={16} /> Submit on WhatsApp
                  </a>
                  <a href={confirmTelegramUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: "center", gap: "8px", borderColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
                    <Send size={16} /> Submit on Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
          <style>{`
            .payment-page-container {
              padding: 120px 20px 80px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: radial-gradient(circle at top right, rgba(16,185,129,0.02), transparent 400px), 
                          radial-gradient(circle at bottom left, rgba(255,215,0,0.02), transparent 400px),
                          var(--color-bg);
            }
          `}</style>
        </>
      );
    }

    let errorTitle = "Link Inactive";
    let errorDesc = "This payment link does not exist, has expired, or has been revoked.";
    let icon = <XCircle size={48} style={{ color: "var(--color-red)" }} />;

    if (reason === "expired") {
      errorTitle = "Payment Session Expired";
      errorDesc = "This secure payment link has expired due to inactivity. Please request a new checkout link from our coordinators.";
    } else if (reason === "locked_out" || failedAttempts >= 5) {
      errorTitle = "Gateway Locked Out";
      errorDesc = "Maximum PIN attempts exceeded. This transaction gateway has been permanently revoked to prevent unauthorized access. Contact support immediately.";
      icon = <ShieldAlert size={48} style={{ color: "var(--color-red)" }} />;
    } else if (reason === "revoked") {
      errorTitle = "Payment Revoked";
      errorDesc = "This payment link has been cancelled or revoked by the store administrator.";
    }

    return (
      <>
        
        <div className="payment-page-container">
          <div className="payment-card-wrap" style={{ maxWidth: "460px" }}>
            <div className="glass-card" style={{ textAlign: "center", padding: "50px 30px", border: "1px solid rgba(239, 68, 68, 0.2)", background: "rgba(17, 21, 32, 0.7)", borderRadius: "24px" }}>
              <div style={{ display: "inline-flex", background: "rgba(239, 68, 68, 0.08)", padding: "20px", borderRadius: "50%", marginBottom: "25px" }}>
                {icon}
              </div>
              <h1 style={{ fontFamily: "var(--font-h)", fontSize: "24px", color: "#fff", fontWeight: 800, marginBottom: "12px", textTransform: "uppercase" }}>{errorTitle}</h1>
              <p style={{ color: "var(--color-muted)", fontSize: "14.5px", lineHeight: 1.6, marginBottom: "35px" }}>
                {errorDesc}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-green" style={{ justifyContent: "center" }}>
                  <MessageCircle size={16} /> Contact Support
                </a>
                <Link href="/" className="btn btn-outline" style={{ justifyContent: "center" }}>
                  <ArrowLeft size={16} /> Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <style>{`
          .payment-page-container {
            padding: 120px 20px 80px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top right, rgba(255,215,0,0.04), transparent 400px), 
                        radial-gradient(circle at bottom left, rgba(255,107,53,0.04), transparent 400px),
                        var(--color-bg);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      
      <div className="payment-page-container">
        <div className="payment-card-wrap">
          <div className={`glass-card main-payment-card ${shake ? "shake-anim" : ""}`}>
            
            {!isUnlocked ? (
              // PIN Protected Terminal Keypad Screen
              <div style={{ padding: "10px 0", textAlign: "center" }}>
                <div style={{ display: "inline-flex", background: "rgba(255, 215, 0, 0.06)", border: "1px solid rgba(255, 215, 0, 0.2)", padding: "20px", borderRadius: "50%", marginBottom: "20px" }}>
                  <Lock size={40} style={{ color: "var(--color-gold)" }} />
                </div>
                <h1 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Secured Gateway</h1>
                <p style={{ color: "var(--color-muted)", fontSize: "14px", maxWidth: "340px", margin: "0 auto 24px", lineHeight: 1.5 }}>
                  Enter the 6-digit access PIN provided by the store admin to view payment details.
                </p>

                {/* 6 Dots Indicator */}
                <div className="dots-container" style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "24px" }}>
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <div 
                      key={index} 
                      className={`dot-indicator ${pin.length > index ? "filled" : ""}`}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: "2px solid rgba(255, 215, 0, 0.4)",
                        background: pin.length > index ? "var(--color-gold)" : "transparent",
                        boxShadow: pin.length > index ? "0 0 10px var(--color-gold)" : "none",
                        transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <div style={{ color: "var(--color-red)", fontSize: "13px", fontWeight: 700, marginBottom: "24px", padding: "8px 16px", background: "rgba(239, 68, 68, 0.08)", borderRadius: "8px", display: "inline-flex", gap: "8px", alignItems: "center" }}>
                    <AlertTriangle size={14} /> {error}
                  </div>
                )}

                {/* Numeric Touch Keypad Grid */}
                <div className="keypad-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", maxWidth: "320px", margin: "0 auto 30px" }}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(num => (
                    <button 
                      key={num} 
                      onClick={() => handleKeyPress(num)}
                      className="keypad-btn"
                    >
                      {num}
                    </button>
                  ))}
                  <button onClick={() => handleKeyPress("clear")} className="keypad-btn action" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                    CLEAR
                  </button>
                  <button onClick={() => handleKeyPress("0")} className="keypad-btn">
                    0
                  </button>
                  <button onClick={() => handleKeyPress("back")} className="keypad-btn action" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                    DELETE
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "12px", borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "20px" }}>
                  <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>
                    🔒 Brute-Force Protection Active: <strong>{5 - failedAttempts}</strong> attempts remaining before lockout.
                  </span>
                </div>
              </div>
            ) : (
              // Unlocked Active Payment Screen
              <>
                {/* Header with Timer */}
                <div className="payment-header">
                  <div className="secure-badge">
                    <ShieldCheck size={18} />
                    <span>SECURE TRANSACTION</span>
                  </div>
                  {timeLeft && (
                    <div className="timer-badge">
                      <Clock size={14} />
                      <span>{timeLeft}</span>
                    </div>
                  )}
                </div>

                {/* Amount Section */}
                <div className="amount-section" style={{ textAlign: "center" }}>
                  <span className="amount-label">TOTAL AMOUNT PAYABLE</span>
                  <div className="amount-value" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }} onClick={handleCopyAmount} title="Copy Amount">
                    <span className="currency">₹</span>
                    {Number(amount).toLocaleString("en-IN")}
                    <span style={{ fontSize: "10px", color: amountCopied ? "var(--color-gold)" : "var(--color-muted)", display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.03)", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)", marginLeft: "8px", fontWeight: 700 }}>
                      {amountCopied ? <CheckCircle size={11} style={{ color: "var(--color-gold)" }} /> : <Copy size={11} />}
                      {amountCopied ? "COPIED" : "COPY"}
                    </span>
                  </div>
                  <div className="order-id-badge">TRANSACTION ID: {paymentData?.transactionId || paymentId}</div>
                  {paymentData?.note && (
                    <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "12px" }}>
                      Note: <span style={{ color: "#fff", fontWeight: 500 }}>{paymentData.note}</span>
                    </p>
                  )}
                </div>

                <div className="payment-grid">
                  {/* Left: QR Code */}
                  <div className="qr-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className="qr-frame" style={{ marginBottom: "12px" }}>
                      <img src={qrCodeUrl} alt="Scan to Pay" />
                      <div className="qr-overlay">
                        <img src="/logo.png" alt="" style={{ width: "30px", opacity: 0.5 }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                      </div>
                    </div>
                    <p className="qr-hint" style={{ marginBottom: "12px" }}>Scan with any UPI App</p>
                    <button 
                      onClick={handleDownloadQr} 
                      className="btn btn-outline" 
                      style={{ 
                        padding: "6px 14px", 
                        fontSize: "11px", 
                        borderRadius: "8px", 
                        gap: "6px",
                        background: "rgba(255,215,0,0.03)",
                        borderColor: "rgba(255,215,0,0.15)",
                        color: "var(--color-gold)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontWeight: 700
                      }}
                      disabled={downloadingQr}
                    >
                      {downloadingQr ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={12} />}
                      {downloadingQr ? "Downloading..." : "Download QR"}
                    </button>
                  </div>

                  {/* Right: Payment Info */}
                  <div className="payee-info">
                    {paymentData?.customerName && (
                      <div className="info-row">
                        <span className="label">Customer Name</span>
                        <span className="value" style={{ color: "#fff", fontWeight: 700 }}>{paymentData.customerName}</span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="label">Payee Name</span>
                      <span className="value">{payeeName}</span>
                    </div>
                    
                    <div className="upi-box" onClick={handleCopyUpi}>
                      <div className="upi-id-wrap">
                        <span className="label">UPI ID</span>
                        <span className="upi-id">{upiId}</span>
                      </div>
                      <div className={`copy-btn-mini ${copied ? "copied" : ""}`}>
                        {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Grid */}
                <div className="action-divider">
                  <span>OR PAY VIA APPS</span>
                </div>

                <div className="upi-apps-grid">
                  <a href={gpayLink} className="upi-app-btn gpay">
                    <img src="https://maddybgmistore.in/gpay-logo.svg" alt="GPay" onError={(e) => { (e.target as HTMLImageElement).src = "https://www.google.com/favicon.ico"; }} /> 
                    <span>G-Pay</span>
                  </a>
                  <a href={phonepeLink} className="upi-app-btn phonepe">
                    <img src="https://maddybgmistore.in/phonepe-logo.svg" alt="PhonePe" onError={(e) => { (e.target as HTMLImageElement).src = "https://phonepe.com/favicon.ico"; }} /> 
                    <span>PhonePe</span>
                  </a>
                  <a href={paytmLink} className="upi-app-btn paytm">
                    <img src="https://maddybgmistore.in/paytm-logo.svg" alt="Paytm" onError={(e) => { (e.target as HTMLImageElement).src = "https://paytm.com/favicon.ico"; }} /> 
                    <span>Paytm</span>
                  </a>
                  <a href={baseUpiUrl} className="upi-app-btn generic">
                    <ExternalLink size={20} /> 
                    <span>Other UPI</span>
                  </a>
                </div>

                {/* Bank Section */}
                {((paymentData?.bankDetails?.bankName || adminSettings?.bankName) || 
                  (paymentData?.bankDetails?.accountNumber || adminSettings?.accountNumber)) && (
                  <div className="bank-section-wrap">
                    <button className={`bank-toggle ${showBank ? "active" : ""}`} onClick={() => setShowBank(!showBank)}>
                      <div className="toggle-label">
                        <CreditCard size={18} />
                        <span>Bank Transfer Details</span>
                      </div>
                      {showBank ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {showBank && (
                      <div className="bank-details-panel">
                        <div className="details-list">
                          {[
                            ["Bank Name", paymentData?.bankDetails?.bankName || adminSettings?.bankName || "FEDERAL BANK"],
                            ["Account Holder", paymentData?.bankDetails?.accountHolder || adminSettings?.accountHolder || "MATHESHWARAN R"],
                            ["Account Number", paymentData?.bankDetails?.accountNumber || adminSettings?.accountNumber || "23550100026910"],
                            ["IFSC Code", paymentData?.bankDetails?.ifscCode || adminSettings?.ifscCode || "FDRL0002355"],
                            ["Branch", paymentData?.bankDetails?.branch || adminSettings?.branch || "Alagusenai"]
                          ].map(([label, val]) => (
                            <div key={label} className="detail-item">
                              <span className="d-label">{label}</span>
                              <span className="d-value">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Proof Sharing / Uploader */}
                <div className="proof-footer" style={{ borderTop: "1px dashed rgba(255,255,255,0.08)", marginTop: "25px", paddingTop: "20px" }}>
                  <div className="proof-hint" style={{ marginBottom: "15px" }}>
                    <ShieldCheck size={14} style={{ color: "var(--color-gold)" }} />
                    <span style={{ fontSize: "11px", letterSpacing: "0.5px", fontWeight: 700 }}>SUBMIT TRANSACTION SCREENSHOT PROOF</span>
                  </div>

                  <div className="upload-container" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", marginTop: "4px" }}>
                      <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-outline"
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          gap: "8px", 
                          padding: "10px", 
                          borderRadius: "10px",
                          borderColor: "rgba(37, 211, 102, 0.25)",
                          background: "rgba(37, 211, 102, 0.04)",
                          color: "#25D366",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase"
                        }}
                      >
                        <MessageCircle size={14} /> Submit on WhatsApp
                      </a>
                      <a 
                        href={telegramUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-outline"
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          gap: "8px", 
                          padding: "10px", 
                          borderRadius: "10px",
                          borderColor: "rgba(34, 158, 217, 0.25)",
                          background: "rgba(34, 158, 217, 0.04)",
                          color: "var(--color-tg)",
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase"
                        }}
                      >
                        <Send size={14} /> Submit on Telegram
                      </a>
                    </div>
                    
                    <p style={{ color: "var(--color-muted)", fontSize: "10.5px", textAlign: "center", lineHeight: 1.4 }}>
                      Click 'Submit on WhatsApp' or 'Submit on Telegram' to send your payment screenshot directly to our support coordinator.
                    </p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        <style>{`
          .payment-page-container {
            padding: 120px 20px 80px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top right, rgba(255,215,0,0.04), transparent 400px), 
                        radial-gradient(circle at bottom left, rgba(255,107,53,0.04), transparent 400px),
                        var(--color-bg);
          }
          .payment-card-wrap {
            width: 100%;
            max-width: 580px;
            perspective: 1000px;
          }
          .glass-card {
            background: rgba(17, 21, 32, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--color-border-gold);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          }
          .main-payment-card {
            position: relative;
            overflow: hidden;
          }
          
          /* Keypad Buttons */
          .keypad-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #fff;
            font-size: 20px;
            font-weight: 700;
            font-family: var(--font-h);
            border-radius: 12px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
          }
          .keypad-btn:active {
            transform: scale(0.95);
            background: rgba(255, 215, 0, 0.15);
            border-color: var(--color-gold);
          }
          .keypad-btn.action {
            background: rgba(255, 255, 255, 0.01);
            color: var(--color-muted);
            font-weight: 600;
          }
          .keypad-btn.action:active {
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
          }

          /* Header */
          .payment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 35px;
          }
          .secure-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            color: var(--color-green);
            padding: 8px 14px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            border: 1px solid rgba(34, 197, 94, 0.2);
          }
          .timer-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            background: rgba(239, 68, 68, 0.1);
            color: var(--color-red);
            padding: 8px 14px;
            border-radius: 100px;
            font-size: 13px;
            font-weight: 900;
            font-family: monospace;
            border: 1px solid rgba(239, 68, 68, 0.2);
          }

          /* Amount */
          .amount-section {
            margin-bottom: 40px;
          }
          .amount-label {
            font-size: 11px;
            color: var(--color-muted);
            letter-spacing: 3px;
            font-weight: 700;
          }
          .amount-value {
            font-size: 56px;
            font-weight: 900;
            color: #fff;
            line-height: 1;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            font-family: var(--font-h);
          }
          .amount-value .currency {
            color: var(--color-gold);
            font-size: 32px;
            opacity: 0.8;
          }
          .order-id-badge {
            display: inline-block;
            background: rgba(255,255,255,0.05);
            padding: 6px 15px;
            border-radius: 100px;
            font-size: 11px;
            color: var(--color-muted);
            font-family: var(--font-h);
            letter-spacing: 1px;
          }

          /* Payment Grid */
          .payment-grid {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 30px;
            margin-bottom: 40px;
            align-items: center;
            text-align: left;
          }
          .qr-frame {
            background: #fff;
            padding: 12px;
            border-radius: 18px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
          .qr-frame img { width: 100%; display: block; border-radius: 8px; }
          .qr-overlay {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 5px;
            border-radius: 5px;
          }
          .qr-hint {
            font-size: 11px;
            color: var(--color-muted);
            margin-top: 12px;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .info-row { margin-bottom: 20px; }
          .info-row .label { display: block; font-size: 10px; color: var(--color-muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
          .info-row .value { display: block; font-size: 18px; font-weight: 800; color: #fff; }

          .upi-box {
            background: var(--color-gold-dim);
            border: 1px solid var(--color-border-gold);
            border-radius: 14px;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .upi-box:hover { background: rgba(255,215,0,0.15); border-color: var(--color-gold); }
          .upi-id-wrap .label { display: block; font-size: 9px; color: var(--color-gold); font-weight: 800; text-transform: uppercase; margin-bottom: 2px; }
          .upi-id-wrap .upi-id { display: block; font-size: 15px; font-weight: 700; color: #fff; font-family: monospace; }
          .copy-btn-mini { color: var(--color-gold); }
          .copy-btn-mini.copied { color: var(--color-green); }

          /* App Grid */
          .action-divider {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .action-divider::before, .action-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
          .action-divider span { font-size: 10px; color: var(--color-muted); font-weight: 800; letter-spacing: 2px; }

          .upi-apps-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 40px;
          }
          .upi-app-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--color-border);
            border-radius: 12px;
            padding: 12px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            text-decoration: none;
            color: #fff;
          }
          .upi-app-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); }
          .upi-app-btn img { width: 24px; height: 24px; border-radius: 4px; }
          .upi-app-btn span { font-size: 11px; font-weight: 700; }
          .upi-app-btn.generic { color: var(--color-gold); border-color: var(--color-border-gold); }

          /* Bank Section */
          .bank-section-wrap { margin-bottom: 40px; }
          .bank-toggle {
            width: 100%;
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--color-border);
            padding: 16px 20px;
            border-radius: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            transition: all 0.2s;
            cursor: pointer;
            outline: none;
          }
          .bank-toggle.active { border-color: var(--color-border-gold); background: var(--color-gold-dim); }
          .toggle-label { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 14px; }
          
          .bank-details-panel {
            margin-top: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 14px;
            padding: 20px;
            border: 1px dashed var(--color-border-gold);
            animation: slideDown 0.3s ease-out;
          }
          .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .detail-item:last-child { border: none; }
          .detail-item .d-label { font-size: 12px; color: var(--color-muted); }
          .detail-item .d-value { font-size: 13px; font-weight: 700; color: #fff; }

          /* Footer Proof */
          .proof-footer { border-top: 1px solid var(--color-border); padding-top: 35px; }
          .proof-hint { display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--color-green); font-size: 11px; font-weight: 800; margin-bottom: 20px; letter-spacing: 0.5px; }
          .proof-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .proof-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 16px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 14px;
            text-decoration: none;
            color: #fff;
            transition: transform 0.2s;
          }
          .proof-btn:hover { transform: translateY(-3px); }
          .proof-btn.wa { background: #25D366; box-shadow: 0 10px 20px rgba(37, 211, 102, 0.2); }
          .proof-btn.tg { background: var(--color-tg); box-shadow: 0 10px 20px rgba(34, 158, 217, 0.2); }

          /* Keypad Shake & slideDown Animations */
          .shake-anim {
            animation: shake 0.5s ease-in-out;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

          /* Responsive */
          @media (max-width: 500px) {
            .glass-card { padding: 30px 20px; }
            .payment-grid { grid-template-columns: 1fr; gap: 20px; }
            .qr-container { display: flex; flex-direction: column; align-items: center; }
            .qr-frame { width: 180px; }
            .amount-value { font-size: 44px; }
            .upi-apps-grid { grid-template-columns: 1fr 1fr; }
            .payee-info { text-align: center; }
            .upi-box { justify-content: center; gap: 15px; }
          }
        `}</style>
      </div>
      
      
    </>
  );
}
