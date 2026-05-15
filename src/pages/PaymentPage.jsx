import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { verifyPaymentJWT } from "../utils/jwt";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, CheckCircle, Copy, MessageCircle, Send,
  AlertTriangle, CreditCard, ChevronDown, ChevronUp, Lock, XCircle,
  Loader2, BadgeIndianRupee, QrCode
} from "lucide-react";

const BANK_PIN = "1516";
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "919025391516";
const TELEGRAM = import.meta.env.VITE_TELEGRAM_USERNAME || "MBSxMADDY17";

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

export default function PaymentPage() {
  const { token } = useParams(); // this is the linkId

  const [linkDoc, setLinkDoc] = useState(null);
  const [isValidLink, setIsValidLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const [bankUnlocked, setBankUnlocked] = useState(false);
  const [bankPin, setBankPin] = useState("");
  const [bankError, setBankError] = useState("");
  const [invalidReason, setInvalidReason] = useState("invalid");
  const [unlocking, setUnlocking] = useState(false);

  const [jwtPayload, setJwtPayload] = useState(null);

  const expiresAt = useMemo(() => parseDate(linkDoc?.expiresAt), [linkDoc]);

  useEffect(() => {
    let cancelled = false;

    const checkLink = async () => {
      if (!token) {
        setIsValidLink(false);
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "payment_links", token));
        if (!docSnap.exists()) {
          setIsValidLink(false);
          setInvalidReason("invalid");
          setLoading(false);
          return;
        }

        const data = docSnap.data();

        if (data.status === "revoked") {
          setIsValidLink(false);
          setInvalidReason("revoked");
          setLoading(false);
          return;
        }

        const exp = parseDate(data.expiresAt);
        if (!exp || exp.getTime() <= Date.now()) {
          setIsValidLink(false);
          setInvalidReason("expired");
          setLoading(false);
          return;
        }

        if (!cancelled) {
          setLinkDoc(data);
          setSecondsLeft(getSecondsLeft(exp));
          setIsValidLink(true);
        }
      } catch (err) {
        console.error("Error verifying link:", err);
        if (!cancelled) setIsValidLink(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkLink();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (!isValidLink || !expiresAt) return;

    const timer = window.setInterval(() => {
      const next = getSecondsLeft(expiresAt);
      setSecondsLeft(next);
      if (next <= 0) {
        setIsValidLink(false);
        setInvalidReason("expired");
        toast.error("Payment link expired");
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [expiresAt, isValidLink]);

  const totalSeconds = Number(linkDoc?.expiresInMinutes || 10) * 60;
  const isCritical = secondsLeft <= 60;
  const progress = Math.max(0, Math.min(1, secondsLeft / Math.max(totalSeconds || 600, 1)));

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(pin)) {
      setError("Enter the 4–6 digit PIN from admin.");
      return;
    }
    setUnlocking(true);
    setError("");

    setTimeout(async () => {
      try {
        const jwtString = linkDoc.token;
        const result = await verifyPaymentJWT(jwtString, pin);

        if (result.valid) {
          setJwtPayload(result.payload);
          setIsUnlocked(true);
          toast.success("Payment details unlocked");
        } else {
          setError(result.error === 'expired' ? "Payment link expired" : "Incorrect PIN. Please try again.");
          setPin("");
        }
      } catch (err) {
        setError("Unable to verify PIN.");
      } finally {
        setUnlocking(false);
      }
    }, 800); // Artificial delay for animation
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

  const amount = Number(jwtPayload?.amount || linkDoc?.amount || 0);
  const orderId = jwtPayload?.orderId || linkDoc?.orderId || "";
  const customerName = jwtPayload?.customerName || linkDoc?.customerName || "";
  const upiId = jwtPayload?.upiId || "";
  const payeeName = jwtPayload?.payeeName || "";
  const currency = "INR";

  const paymentParams = isUnlocked
    ? `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&cu=${currency}&tn=${encodeURIComponent(orderId)}`
    : "";
  const baseUpiUrl = paymentParams ? `upi://pay?${paymentParams}` : "";
  const gpayLink = paymentParams ? `gpay://upi/pay?${paymentParams}` : "#";
  const phonepeLink = paymentParams ? `phonepe://pay?${paymentParams}` : "#";
  const paytmLink = paymentParams ? `paytmmp://pay?${paymentParams}` : "#";

  const qrImageUrl = baseUpiUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&color=000&bgcolor=fff&data=${encodeURIComponent(baseUpiUrl)}`
    : "";

  const screenshotText = encodeURIComponent(
    `Hi, I completed payment for Order ${orderId} (₹${amount.toLocaleString("en-IN")}). Customer: ${customerName}. Please verify my screenshot.`
  );
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${screenshotText}`;
  const telegramHref = `https://t.me/${TELEGRAM}?text=${screenshotText}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <div className="text-amber-500/80 font-mono tracking-widest text-sm uppercase">Securing Connection...</div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <>
        <Navbar />
        <div className="pt-24 min-h-screen bg-[#080a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.05)_0%,rgba(8,10,15,1)_60%)] pointer-events-none" />

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 bg-white/[0.02] border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">
              {invalidReason === "revoked" ? "Link Revoked" : "Link Expired"}
            </h1>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              {invalidReason === "revoked"
                ? "This secure payment session was terminated by the administrator."
                : "This secure payment session has timed out. Security protocols require a fresh link."}
            </p>
            <Link to="/connectwithus" className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all border border-white/5">
              Contact Support
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-[#080a0f] flex flex-col p-4 relative overflow-hidden">

        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] opacity-30 mix-blend-screen" />
        </div>

        <div className="flex-1 max-w-lg w-full mx-auto relative z-10 flex flex-col justify-center my-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0c0e14]/80 backdrop-blur-3xl border border-amber-500/20 rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5),_0_0_40px_rgba(245,158,11,0.05)]">

            {/* Timer Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isCritical ? 'bg-red-500/10 text-red-500 box-shadow-pulse-red' : 'bg-amber-500/10 text-amber-500 box-shadow-pulse-amber'}`}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/40">Secure Session</div>
                  <div className={`font-mono font-bold text-lg ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                    {formatTimer(secondsLeft)} Left
                  </div>
                </div>
              </div>

              <svg width="40" height="40" viewBox="0 0 50 50" className="-rotate-90">
                <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="25" cy="25" r="20" fill="none" stroke={isCritical ? "#ef4444" : "var(--gold)"} strokeWidth="3" strokeLinecap="round" strokeDasharray={126} strokeDashoffset={126 * (1 - progress)} className="transition-all duration-1000 ease-linear" />
              </svg>
            </div>

            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div key="lock" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Access Payment</h1>
                    <p className="text-white/50 text-sm">Session encrypted. Enter the access PIN provided by the administrator to reveal details.</p>
                  </div>

                  <form onSubmit={handleUnlock} className="flex flex-col items-center">
                    <div className="relative group mb-6">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-500 transition-colors" />
                      <input type="password" maxLength={6} required value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-center text-2xl font-mono tracking-[0.5em] text-amber-400 focus:border-amber-500/50 focus:bg-amber-500/5 outline-none transition-all placeholder:text-white/20" placeholder="••••••" />
                    </div>

                    {error && <div className="text-red-400 text-sm font-bold mb-4">{error}</div>}

                    <button type="submit" disabled={unlocking} className="w-full relative overflow-hidden group rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 p-[1px]">
                      <div className="flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-black px-8 py-4 transition-all group-hover:bg-transparent">
                        {unlocking ? <Loader2 className="animate-spin text-amber-500 group-hover:text-black" /> : <Lock size={18} className="text-amber-500 group-hover:text-black" />}
                        <span className="font-bold text-amber-500 group-hover:text-black">{unlocking ? 'Authenticating...' : 'Unlock Secure Gateway'}</span>
                      </div>
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="gateway" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>

                  {/* Order Details Mini Card */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Order ID</div>
                      <div className="text-sm font-mono text-white truncate">{orderId}</div>
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-right">
                      <div className="text-[10px] text-emerald-500/60 uppercase tracking-widest font-bold mb-1">Amount to pay</div>
                      <div className="text-xl font-black text-emerald-400 leading-none flex items-center justify-end gap-1">
                        <BadgeIndianRupee size={16} />{amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center mb-6 relative overflow-hidden shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
                    <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-5" />
                    <img src={qrImageUrl} alt="UPI QR" className="w-48 h-48 object-contain rounded-xl shadow-sm relative z-10" />
                    <div className="mt-4 flex items-center gap-2 text-black/40 font-bold text-xs uppercase tracking-widest z-10">
                      <QrCode size={14} /> Scan with any UPI app
                    </div>
                  </div>

                  {/* UPI Copy Section */}
                  <div className="bg-white/5 border border-white/10 border-dashed rounded-xl p-4 flex flex-col mb-6">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-white/50 mb-1">Payee: <span className="text-white">{payeeName}</span></div>
                    <button onClick={handleCopyUpi} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${copied ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-black/50 border-white/10 hover:border-amber-500/30'}`}>
                      <div className={`font-mono text-sm tracking-wide ${copied ? 'text-emerald-400' : 'text-amber-400'} truncate mr-3`}>{upiId}</div>
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded bg-white/10 ${copied ? 'text-emerald-400' : 'text-white/60'}`}>
                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                      </div>
                    </button>
                  </div>

                  {/* Quick UPI Apps */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-px bg-white/10 flex-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Or Tap to Pay</span>
                      <div className="h-px bg-white/10 flex-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { name: "GPay", href: gpayLink, img: "/gpay-logo.svg", bg: "bg-white", text: "text-black" },
                        { name: "PhonePe", href: phonepeLink, img: "/phonepe-logo.svg", bg: "bg-[#5f259f]", text: "text-white" },
                        { name: "Paytm", href: paytmLink, img: "/paytm-logo.svg", bg: "bg-[#002970]", text: "text-white" },
                        { name: "Other UPI", href: baseUpiUrl, img: "/upi-logo.svg", bg: "bg-white/10 border border-white/20", text: "text-white" }
                      ].map(app => (
                        <a key={app.name} href={app.href} className={`flex items-center gap-3 p-3 rounded-xl ${app.bg} ${app.text} transition-transform hover:-translate-y-1 shadow-lg`}>
                          <div className="bg-white p-1 rounded-md shadow-sm"><img src={app.img} alt={app.name} className="w-6 h-6 object-contain" /></div>
                          <span className="font-bold text-sm">{app.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Manual Bank Dropdown */}
                  <div className="mb-6">
                    <button onClick={() => setShowBank(!showBank)} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-2"><CreditCard size={18} className="text-amber-500" /> Bank Transfer Details</div>
                      {showBank ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <AnimatePresence>
                      {showBank && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-2 bg-[#0a0c10] border border-amber-500/20 rounded-xl p-5">
                            {!bankUnlocked ? (
                              <form onSubmit={handleBankUnlock} className="flex flex-col items-center py-4">
                                <Lock size={20} className="text-white/20 mb-3" />
                                <p className="text-xs text-center text-white/50 mb-4">Enter secondary bank PIN to reveal details</p>
                                <input type="password" maxLength={4} required value={bankPin} onChange={e => setBankPin(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center font-mono tracking-widest text-white outline-none mb-3" placeholder="••••" />
                                {bankError && <p className="text-xs text-red-500 font-bold mb-3">{bankError}</p>}
                                <button type="submit" className="px-6 py-2 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-400">Unlock Bank</button>
                              </form>
                            ) : (
                              <div className="grid gap-3 text-sm">
                                {[
                                  { label: "Bank", value: "FEDERAL BANK" },
                                  { label: "Account Type", value: "SAVINGS" },
                                  { label: "Name", value: "MATHESHWARAN R", highlight: true },
                                  { label: "A/C Number", value: "23550100026910", mono: true },
                                  { label: "IFSC", value: "FDRL0002355", highlight: true, mono: true }
                                ].map(row => (
                                  <div key={row.label} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                    <span className="text-white/40 text-xs font-bold uppercase">{row.label}</span>
                                    <span className={`${row.highlight ? 'text-amber-400' : 'text-white'} ${row.mono ? 'font-mono' : 'font-bold'}`}>{row.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Verification Banner */}
                  <div className="bg-orange-500/10 border-l-4 border-orange-500 rounded-r-xl p-4 mb-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="text-orange-500 font-bold text-sm mb-1">Verify Output & Share Proof</h4>
                        <p className="text-white/70 text-xs leading-relaxed mb-3">Ensure payee name shows <strong className="text-white">{payeeName}</strong>. Once paid, share screenshot proof instantly to process your order.</p>
                        <div className="grid grid-cols-2 gap-2">
                          <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#25D366] text-black font-bold text-xs"><MessageCircle size={14} /> WhatsApp</a>
                          <a href={telegramHref} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#0088cc] text-white font-bold text-xs"><Send size={14} /> Telegram</a>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
