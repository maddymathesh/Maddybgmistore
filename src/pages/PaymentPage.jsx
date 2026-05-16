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
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabase";
import {
  ShieldCheck, CheckCircle, Copy,
  AlertTriangle, CreditCard, ChevronDown, ChevronUp, Lock, XCircle
} from "lucide-react";

export default function PaymentPage() {
  const { user } = useAuth();
  const { paymentId } = useParams();

  const [isValidLink, setIsValidLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

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

  useEffect(() => {
    const checkLink = async () => {
      if (!paymentId) {
        setIsValidLink(false);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('payment_links')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (data && data.status === "active") {
          // Check for expiration
          const isExpired = data.expires_at && new Date(data.expires_at) < new Date();
          if (isExpired) {
            setIsValidLink(false);
          } else {
            setPaymentData(data);
            setIsValidLink(true);
          }
        } else {
          setIsValidLink(false);
        }
      } catch (err) {
        console.error("Error fetching payment link:", err);
        setIsValidLink(false);
      } finally {
        setLoading(false);
      }
    };
    checkLink();
  }, [paymentId]);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === "9025") {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  const handleBankUnlock = (e) => {
    e.preventDefault();
    if (bankPin === "1516") {
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

  // Secure dynamic loading via client-side obfuscation
  const encryptedUpi = paymentData?.encryptedUpi || "VFFWUUBIQlRAcEtXVQ==";
  const encryptedName = paymentData?.encryptedName || "dHFmfXxjemJ4YnN7GWI=";

  const decrypt = (base64, key) => {
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
  };

  // User Specific Details (Dynamically Decrypted)
  const upiId = isUnlocked ? decrypt(encryptedUpi, pin) : "";
  const payeeName = isUnlocked ? decrypt(encryptedName, pin) : "";
  const currency = "INR";

  // Base UPI Link
  const baseUpiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;

  // Specific App Links
  const gpayLink = `gpay://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;
  const phonepeLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;
  const paytmLink = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=${currency}`;

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
            {/* Top Glow */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "150px", height: "150px", background: "rgba(255,215,0,0.1)",
              filter: "blur(50px)", zIndex: 0
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              {!isUnlocked ? (
                // --- PIN ENTRY SCREEN ---
                <div style={{ padding: "20px 0" }}>
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
                // --- PAYMENT DETAILS SCREEN ---
                <>
                  <div style={{ display: "inline-flex", background: "rgba(34,197,94,0.1)", padding: "12px", borderRadius: "50%", marginBottom: "16px" }}>
                    <ShieldCheck size={32} color="#22c55e" />
                  </div>
                  <h1 style={{ fontFamily: "var(--font-h)", fontSize: "28px", marginBottom: "8px", color: "#fff" }}>Secure Checkout</h1>
                  
                  {paymentData?.amount && (
                    <div style={{ marginBottom: "20px" }}>
                      <div style={{ fontSize: "12px", color: "var(--gold)", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "800", marginBottom: "4px" }}>Amount to Pay</div>
                      <div style={{ fontSize: "36px", fontWeight: "900", color: "#fff" }}>₹{Number(paymentData.amount).toLocaleString("en-IN")}</div>
                      {paymentData.note && (
                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
                          Ref: {paymentData.note}
                        </div>
                      )}
                    </div>
                  )}

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
                        <img src="/gpay-logo.svg" alt="Google Pay" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "4px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "#888", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: "#3c4043", lineHeight: 1.4 }}>Google Pay</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3c4043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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
                        <img src="/phonepe-logo.svg" alt="PhonePe" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>PhonePe</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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
                        <img src="/paytm-logo.svg" alt="Paytm" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "4px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1 }}>Pay with</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4 }}>Paytm</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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
                        <img src="/upi-logo.svg" alt="UPI" style={{ width: "38px", height: "38px", objectFit: "contain", background: "#fff", borderRadius: "8px", padding: "4px" }} />
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500, lineHeight: 1 }}>Open any</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.4, color: "var(--gold)" }}>Other UPI App</div>
                        </div>
                        <svg style={{ marginLeft: "auto" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,215,0,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
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