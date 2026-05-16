import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabase";
import {
  ShieldCheck, CheckCircle, Copy,
  AlertTriangle, CreditCard, ChevronDown, ChevronUp, Lock, XCircle, Send, MessageCircle, Clock, ExternalLink
} from "lucide-react";

export default function PaymentPage() {
  const { paymentId } = useParams();

  const [isValidLink, setIsValidLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [adminSettings, setAdminSettings] = useState(null);

  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);

  // PIN Protection State for Page
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // PIN Protection State for Bank Details
  const [bankUnlocked, setBankUnlocked] = useState(false);
  const [bankPin, setBankPin] = useState("");
  const [bankError, setBankError] = useState("");

  // Timer State
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!paymentId) {
        setIsValidLink(false);
        setLoading(false);
        return;
      }
      try {
        const [linkRes, settingsRes] = await Promise.all([
          supabase.from('payment_links').select('*').eq('id', paymentId).single(),
          supabase.from('admin_payment_settings').select('*').eq('id', 1).single()
        ]);

        if (settingsRes.data) {
          setAdminSettings(settingsRes.data);
          if (!settingsRes.data.payment_pin) setBankUnlocked(true);
        }

        const data = linkRes.data;
        if (data && data.status === "active") {
          const isExpired = data.expires_at && new Date(data.expires_at) < new Date();
          if (isExpired) {
            setIsValidLink(false);
          } else {
            setPaymentData(data);
            setIsValidLink(true);
            if (!data.pin) setIsUnlocked(true);
          }
        } else {
          setIsValidLink(false);
        }
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setIsValidLink(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paymentId]);

  useEffect(() => {
    if (!paymentData?.expires_at) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(paymentData.expires_at).getTime();
      const distance = expiry - now;
      if (distance < 0) {
        clearInterval(timer);
        setIsValidLink(false);
        return;
      }
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentData]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!paymentData?.pin || pin === paymentData.pin) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleBankUnlock = (e) => {
    e.preventDefault();
    const globalPin = adminSettings?.payment_pin;
    if (!globalPin || bankPin === globalPin) {
      setBankUnlocked(true);
      setBankError("");
    } else {
      setBankError("Incorrect PIN.");
      setBankPin("");
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const upiId = paymentData?.payee_upi || adminSettings?.payee_upi_id || "";
  const payeeName = paymentData?.payee_name || adminSettings?.payee_name || "Maddy BGMI Store";
  const amount = paymentData?.amount || 0;
  const note = paymentData?.note || "Payment for Order";

  const baseUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const gpayLink = `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const phonepeLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const paytmLink = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(baseUpiUrl)}`;

  const whatsappMsg = encodeURIComponent(`Hello Maddy, I have completed the payment of ₹${amount} for Order ID: ${paymentId}. Here is the screenshot.`);
  const whatsappUrl = `https://wa.me/+919025391516?text=${whatsappMsg}`;
  const telegramUrl = `https://t.me/MBSxMADDY17`;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="loader" />
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "15px", fontFamily: "var(--font-h)", letterSpacing: "2px" }}>ENCRYPTING GATEWAY...</p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <>
        <Navbar />
        <div className="payment-page-container">
          <div className="payment-card-wrap" style={{ maxWidth: "450px" }}>
            <div className="glass-card" style={{ textAlign: "center", padding: "50px 30px", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div style={{ display: "inline-flex", background: "rgba(239,68,68,0.1)", padding: "20px", borderRadius: "50%", marginBottom: "25px" }}>
                <XCircle size={48} color="var(--red)" />
              </div>
              <h1 className="stitle" style={{ fontSize: "24px", color: "#fff" }}>Link Inactive</h1>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "30px" }}>
                This payment link has expired or been revoked. Please request a new link from our staff.
              </p>
              <Link to="/connectwithus" className="btn btn-gold" style={{ width: "100%" }}>Contact Support</Link>
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
      <div className="payment-page-container">
        <div className="payment-card-wrap">
          <div className="glass-card main-payment-card">
            {!isUnlocked ? (
              <div style={{ padding: "10px 0" }}>
                <div style={{ display: "inline-flex", background: "var(--gold-dim)", padding: "20px", borderRadius: "50%", marginBottom: "25px" }}>
                  <Lock size={40} color="var(--gold)" />
                </div>
                <h1 className="stitle" style={{ fontSize: "28px" }}>Secured Gateway</h1>
                <p className="ssub" style={{ margin: "0 auto 30px" }}>Enter the 6-digit access PIN provided to proceed.</p>
                
                <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                  <input 
                    type="password" 
                    maxLength={6} 
                    placeholder="••••••" 
                    value={pin} 
                    onChange={(e) => setPin(e.target.value)}
                    className="pin-input"
                    autoFocus 
                  />
                  {error && <div className="error-msg">{error}</div>}
                  <button type="submit" className="btn btn-gold" style={{ width: "100%", maxWidth: "250px", height: "55px" }}>Unlock Payment</button>
                </form>
              </div>
            ) : (
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
                <div className="amount-section">
                  <span className="amount-label">TOTAL AMOUNT PAYABLE</span>
                  <div className="amount-value">
                    <span className="currency">₹</span>
                    {Number(amount).toLocaleString("en-IN")}
                  </div>
                  <div className="order-id-badge">ORDER ID: {paymentId}</div>
                </div>

                <div className="payment-grid">
                  {/* Left: QR Code */}
                  <div className="qr-container">
                    <div className="qr-frame">
                      <img src={qrCodeUrl} alt="Scan to Pay" />
                      <div className="qr-overlay">
                        <img src="/logo.png" alt="" style={{ width: "30px", opacity: 0.5 }} onError={(e) => e.target.style.display='none'} />
                      </div>
                    </div>
                    <p className="qr-hint">Scan with any UPI App</p>
                  </div>

                  {/* Right: Payment Info */}
                  <div className="payee-info">
                    <div className="info-row">
                      <span className="label">Payee Name</span>
                      <span className="value">{payeeName}</span>
                    </div>
                    
                    <div className="upi-box" onClick={handleCopyUpi}>
                      <div className="upi-id-wrap">
                        <span className="label">UPI ID</span>
                        <span className="upi-id">{upiId}</span>
                      </div>
                      <div className={`copy-btn-mini ${copied ? 'copied' : ''}`}>
                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
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
                    <img src="/gpay-logo.svg" alt="" /> <span>G-Pay</span>
                  </a>
                  <a href={phonepeLink} className="upi-app-btn phonepe">
                    <img src="/phonepe-logo.svg" alt="" /> <span>PhonePe</span>
                  </a>
                  <a href={paytmLink} className="upi-app-btn paytm">
                    <img src="/paytm-logo.svg" alt="" /> <span>Paytm</span>
                  </a>
                  <a href={baseUpiUrl} className="upi-app-btn generic">
                    <ExternalLink size={18} /> <span>Other UPI</span>
                  </a>
                </div>

                {/* Bank Section */}
                <div className="bank-section-wrap">
                  <button className={`bank-toggle ${showBank ? 'active' : ''}`} onClick={() => setShowBank(!showBank)}>
                    <div className="toggle-label">
                      <CreditCard size={18} />
                      <span>Bank Transfer Details</span>
                    </div>
                    {showBank ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {showBank && (
                    <div className="bank-details-panel">
                      {!bankUnlocked ? (
                        <div className="bank-lock-overlay">
                          <Lock size={20} className="lock-icon" />
                          <p>Enter Bank PIN to view</p>
                          <form onSubmit={handleBankUnlock} className="bank-pin-form">
                            <input 
                              type="password" 
                              maxLength={6} 
                              value={bankPin} 
                              onChange={e => setBankPin(e.target.value)} 
                              placeholder="••••"
                            />
                            <button type="submit">Unlock</button>
                          </form>
                          {bankError && <div className="mini-error">{bankError}</div>}
                        </div>
                      ) : (
                        <div className="details-list">
                          {[
                            ["Bank Name", adminSettings?.bank_name || "FEDERAL BANK"],
                            ["Account Holder", adminSettings?.account_holder || "MATHESHWARAN R"],
                            ["Account Number", adminSettings?.account_number || "23550100026910"],
                            ["IFSC Code", adminSettings?.ifsc_code || "FDRL0002355"],
                            ["Branch", adminSettings?.branch || "Alagusenai"]
                          ].map(([label, val]) => (
                            <div key={label} className="detail-item">
                              <span className="d-label">{label}</span>
                              <span className="d-value">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Proof Sharing */}
                <div className="proof-footer">
                  <div className="proof-hint">
                    <CheckCircle size={14} />
                    <span>SHARE PAYMENT PROOF TO CONFIRM ORDER</span>
                  </div>
                  <div className="proof-buttons">
                    <a href={whatsappUrl} className="proof-btn wa">
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    <a href={telegramUrl} className="proof-btn tg">
                      <Send size={18} /> Telegram
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <style>{`
          .payment-page-container {
            padding: 100px 20px 60px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at top right, rgba(255,215,0,0.05), transparent 400px), 
                        radial-gradient(circle at bottom left, rgba(255,107,53,0.05), transparent 400px),
                        var(--bg);
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
            border: 1px solid var(--border-gold);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          }
          .main-payment-card {
            position: relative;
            overflow: hidden;
          }
          .main-payment-card::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,215,0,0.03), transparent);
            transform: rotate(45deg);
            pointer-events: none;
          }

          /* Pin Input */
          .pin-input {
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid var(--border-gold);
            border-radius: 16px;
            width: 100%;
            max-width: 280px;
            height: 70px;
            text-align: center;
            font-size: 32px;
            color: #fff;
            letter-spacing: 12px;
            outline: none;
            transition: all 0.3s;
          }
          .pin-input:focus {
            border-color: var(--gold);
            background: rgba(255, 215, 0, 0.05);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
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
            color: #22c55e;
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
            color: #ef4444;
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
            color: var(--muted);
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
          }
          .amount-value .currency {
            color: var(--gold);
            font-size: 32px;
            opacity: 0.8;
          }
          .order-id-badge {
            display: inline-block;
            background: rgba(255,255,255,0.05);
            padding: 6px 15px;
            border-radius: 100px;
            font-size: 11px;
            color: var(--muted);
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
            color: var(--muted);
            margin-top: 12px;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .info-row { margin-bottom: 20px; }
          .info-row .label { display: block; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
          .info-row .value { display: block; font-size: 18px; font-weight: 800; color: #fff; }

          .upi-box {
            background: var(--gold-dim);
            border: 1px solid var(--border-gold);
            border-radius: 14px;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
          }
          .upi-box:hover { background: rgba(255,215,0,0.15); border-color: var(--gold); }
          .upi-id-wrap .label { display: block; font-size: 9px; color: var(--gold); font-weight: 800; text-transform: uppercase; margin-bottom: 2px; }
          .upi-id-wrap .upi-id { display: block; font-size: 15px; font-weight: 700; color: #fff; font-family: monospace; }
          .copy-btn-mini { color: var(--gold); }
          .copy-btn-mini.copied { color: #22c55e; }

          /* App Grid */
          .action-divider {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }
          .action-divider::before, .action-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
          .action-divider span { font-size: 10px; color: var(--muted); font-weight: 800; letter-spacing: 2px; }

          .upi-apps-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 40px;
          }
          .upi-app-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border);
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
          .upi-app-btn img { width: 24px; height: 24px; }
          .upi-app-btn span { font-size: 11px; font-weight: 700; }
          .upi-app-btn.generic { color: var(--gold); border-color: var(--border-gold); }

          /* Bank Section */
          .bank-section-wrap { margin-bottom: 40px; }
          .bank-toggle {
            width: 100%;
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            padding: 16px 20px;
            border-radius: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            transition: all 0.2s;
          }
          .bank-toggle.active { border-color: var(--gold-border); background: var(--gold-dim); }
          .toggle-label { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 14px; }
          
          .bank-details-panel {
            margin-top: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 14px;
            padding: 20px;
            border: 1px dashed var(--border-gold);
            animation: slideDown 0.3s ease-out;
          }
          .detail-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .detail-item:last-child { border: none; }
          .detail-item .d-label { font-size: 12px; color: var(--muted); }
          .detail-item .d-value { font-size: 13px; font-weight: 700; color: #fff; }

          .bank-lock-overlay { text-align: center; padding: 10px 0; }
          .bank-lock-overlay p { font-size: 12px; color: var(--muted); margin: 10px 0 15px; }
          .bank-pin-form { display: flex; gap: 10px; justify-content: center; }
          .bank-pin-form input {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-gold);
            border-radius: 8px;
            width: 80px;
            padding: 10px;
            text-align: center;
            color: #fff;
            outline: none;
          }
          .bank-pin-form button { background: var(--gold); color: #000; padding: 0 15px; border-radius: 8px; font-weight: 700; font-size: 12px; }

          /* Footer Proof */
          .proof-footer { border-top: 1px solid var(--border); paddingTop: 35px; }
          .proof-hint { display: flex; align-items: center; justify-content: center; gap: 8px; color: #22c55e; font-size: 11px; font-weight: 800; margin-bottom: 20px; letter-spacing: 0.5px; }
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
          .proof-btn.tg { background: #229ED9; box-shadow: 0 10px 20px rgba(34, 158, 217, 0.2); }

          .loader { width: 40px; height: 40px; border: 3px solid var(--gold-dim); border-top-color: var(--gold); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
          @keyframes spin { to { transform: rotate(360deg); } }
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
      <Footer />
    </>
  );
}