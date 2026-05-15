import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Copy, ExternalLink, Link2, Loader2, Plus, RefreshCcw,
  Settings, ShieldCheck, Trash2, Ban, QrCode, Search, Filter, Download
} from "lucide-react";
import { collection, onSnapshot, orderBy, query, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { createPaymentJWT } from "../../utils/jwt";
import { motion, AnimatePresence } from "framer-motion";

const EMPTY_FORM = {
  customerName: "",
  amount: "",
  orderId: "",
  expiresInMinutes: "10",
  pin: "",
};

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value === "number") return new Date(value);
  return new Date(value);
}

function getPaymentUrl(linkId) {
  return `${window.location.origin}/pay/${linkId}`;
}

function getStatus(link, now) {
  if (link.status === "revoked") return "revoked";
  const expiresAt = toDate(link.expiresAt);
  if (link.status !== "active") return link.status || "expired";
  if (!expiresAt || expiresAt.getTime() <= now) return "expired";
  return "active";
}

function copyText(value, message = "Copied") {
  navigator.clipboard.writeText(value);
  toast.success(message);
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function AdminPaymentManager() {
  const [settings, setSettings] = useState({ upiId: "", payeeName: "", defaultTimerMinutes: 10 });
  const [settingsDraft, setSettingsDraft] = useState({ upiId: "", payeeName: "", defaultTimerMinutes: "10" });
  const [savingSettings, setSavingSettings] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "settings", "payment");
        const docSnap = await getDoc(docRef);
        const s = docSnap.exists() ? docSnap.data() : { upiId: "", payeeName: "", defaultTimerMinutes: 10 };
        setSettings(s);
        setSettingsDraft({
          upiId: s.upiId || "",
          payeeName: s.payeeName || "",
          defaultTimerMinutes: String(s.defaultTimerMinutes || 10),
        });
        setForm(prev => ({ ...prev, expiresInMinutes: String(s.defaultTimerMinutes || 10) }));
      } catch (error) {
        console.error("Load payment settings:", error);
        toast.error("Could not load payment settings. Running local default.");
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const linksQuery = query(collection(db, "payment_links"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      linksQuery,
      (snapshot) => {
        setPaymentLinks(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Payment links listener error:", error);
        toast.error("Unable to load payment links");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const stats = useMemo(() => {
    const active = paymentLinks.filter(link => getStatus(link, now) === "active").length;
    const revoked = paymentLinks.filter(link => getStatus(link, now) === "revoked").length;
    const totalRev = paymentLinks.reduce((acc, curr) => getStatus(curr, now) === "active" ? acc + Number(curr.amount || 0) : acc, 0);
    return {
      total: paymentLinks.length,
      active,
      expired: paymentLinks.length - active - revoked,
      revoked,
      revenue: totalRev
    };
  }, [paymentLinks, now]);

  const filteredLinks = paymentLinks.filter(l =>
    l.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const saveSettings = async (event) => {
    event.preventDefault();
    setSavingSettings(true);
    try {
      const data = {
        upiId: settingsDraft.upiId.trim(),
        payeeName: settingsDraft.payeeName.trim(),
        defaultTimerMinutes: Number(settingsDraft.defaultTimerMinutes),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, "settings", "payment"), data, { merge: true });
      setSettings(data);
      toast.success("Payment settings saved with local DB");
    } catch (error) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!settings.upiId && !settingsDraft.upiId) return toast.error("Save your UPI ID in settings first");
    if (!form.customerName.trim()) return toast.error("Customer name is required");
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");
    const expiresInMinutes = Number(form.expiresInMinutes);
    if (!Number.isInteger(expiresInMinutes) || expiresInMinutes < 5 || expiresInMinutes > 60) return toast.error("Timer must be between 5 and 60 minutes");
    if (!/^\d{4,6}$/.test(form.pin)) return toast.error("PIN must be 4 to 6 digits");

    const activeUpi = settingsDraft.upiId.trim() || settings.upiId;
    const activePayee = settingsDraft.payeeName.trim() || settings.payeeName;
    const orderId = form.orderId.trim() || 'MBS-' + Math.floor(1000 + Math.random() * 9000);

    setGenerating(true);
    try {
      const linkId = generateId();
      const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

      const jwtPayload = {
        upiId: activeUpi,
        payeeName: activePayee,
        amount: Number(form.amount),
        orderId,
        customerName: form.customerName.trim(),
        expiresAt: Math.floor(expiresAt / 1000)
      };

      const jwtString = await createPaymentJWT(jwtPayload, form.pin);

      const linkData = {
        token: jwtString,
        customerName: form.customerName.trim(),
        amount: Number(form.amount),
        orderId,
        expiresInMinutes,
        expiresAt,
        status: "active",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "payment_links", linkId), linkData);

      const paymentUrl = getPaymentUrl(linkId);
      setGeneratedLink({ url: paymentUrl, orderId, pin: form.pin });

      setForm({ ...EMPTY_FORM, expiresInMinutes: String(settings.defaultTimerMinutes || settingsDraft.defaultTimerMinutes || 10) });
      toast.success("Secure link generated locally!");
    } catch (error) {
      console.error("Link gen error:", error);
      toast.error(error.message || "Failed to generate link");
    } finally {
      setGenerating(false);
    }
  };

  const revokeLink = async (link) => {
    if (!confirm("Revoke this payment link? Customers will no longer be able to pay.")) return;
    setActionId(link.id);
    try {
      await updateDoc(doc(db, "payment_links", link.id), { status: "revoked" });
      toast.success("Link revoked via DB");
    } catch (error) {
      toast.error(error.message || "Failed to revoke link");
    } finally {
      setActionId(null);
    }
  };

  const deleteLink = async (link) => {
    if (!confirm("Delete this record permanently?")) return;
    setActionId(`del-${link.id}`);
    try {
      await deleteDoc(doc(db, "payment_links", link.id));
      toast.success("Record deleted");
    } catch (error) {
      toast.error("Failed to delete link");
    } finally {
      setActionId(null);
    }
  };

  const exportRecords = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Order ID,Customer,Amount,Status,Expiry\n"
      + paymentLinks.map(e => `${e.orderId},${e.customerName},${e.amount},${getStatus(e, now)},${new Date(toDate(e.expiresAt)).toLocaleString('en-IN')}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payment_records.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="grid gap-8 pb-10">
      {/* Stats Section Modern */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Links", value: stats.total, color: "from-blue-600/20 to-transparent text-blue-400 border-blue-500/20" },
          { label: "Active Links", value: stats.active, color: "from-emerald-600/20 to-transparent text-emerald-400 border-emerald-500/20" },
          { label: "Potential Rev.", value: "₹" + stats.revenue.toLocaleString(), color: "from-amber-600/20 to-transparent text-amber-400 border-amber-500/20" },
          { label: "Expired Links", value: stats.expired, color: "from-red-600/20 to-transparent text-red-400 border-red-500/20" },
          { label: "Revoked Links", value: stats.revoked, color: "from-orange-600/20 to-transparent text-orange-400 border-orange-500/20" },
        ].map((s, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={s.label} className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${s.color} p-5 backdrop-blur-md`}
          >
            <div className="relative z-10">
              <div className="text-2xl lg:text-3xl font-black mb-1">{s.value}</div>
              <div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest opacity-70">{s.label}</div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Main Generator Card */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[24px] border border-amber-500/30 bg-[#0c0e14] p-6 lg:p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="mb-8 flex items-center justify-between relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 border border-amber-500/20 mb-3">
                  <ShieldCheck size={14} /> JWT Secured Links
                </span>
                <h2 className="text-2xl font-black text-white">Generate Payment Link</h2>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="grid gap-6 relative z-10">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="group relative">
                  <input className="peer w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pt-6 text-white text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-amber-500/5"
                    placeholder=" " value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
                  <label className="absolute left-5 top-5 text-xs text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2">
                    Customer Name
                  </label>
                </div>

                <div className="group relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 font-bold">₹</span>
                  <input className="peer w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-5 py-4 pt-6 text-white text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-amber-500/5"
                    type="number" min="1" placeholder=" " value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                  <label className="absolute left-9 top-5 text-xs text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2">
                    Amount
                  </label>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="group relative">
                  <input className="peer w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pt-6 text-white text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-amber-500/5"
                    placeholder=" " value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} />
                  <label className="absolute left-5 top-5 text-xs text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2">
                    Order ID (Optional)
                  </label>
                </div>

                <div className="group relative">
                  <input className="peer w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pt-6 text-white text-sm outline-none transition-all focus:border-amber-500/50 focus:bg-amber-500/5"
                    type="number" min="5" max="60" placeholder=" " value={form.expiresInMinutes} onChange={e => setForm({ ...form, expiresInMinutes: e.target.value })} required />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-white/30 font-bold">MIN</span>
                  <label className="absolute left-5 top-5 text-xs text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2">
                    Timer
                  </label>
                </div>

                <div className="group relative">
                  <input className="peer w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 pt-6 text-white text-sm font-mono tracking-widest outline-none transition-all focus:border-amber-500/50 focus:bg-amber-500/5"
                    maxLength={6} placeholder=" " value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })} required />
                  <label className="absolute left-5 top-5 text-xs text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[10px] peer-focus:top-2 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-2">
                    Access PIN
                  </label>
                </div>
              </div>

              <button type="submit" disabled={generating} className="mt-2 relative overflow-hidden group w-full lg:w-auto self-start rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 p-[1px]">
                <div className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 transition-all group-hover:bg-transparent">
                  {generating ? <Loader2 size={18} className="animate-spin text-amber-500 group-hover:text-black" /> : <Plus size={18} className="text-amber-500 group-hover:text-black" />}
                  <span className="font-bold text-amber-500 group-hover:text-black">Generate Secure Link</span>
                </div>
              </button>
            </form>

            <AnimatePresence>
              {generatedLink && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Link Generated • PIN: {generatedLink.pin}</div>
                      <div className="font-mono text-sm text-white break-all">{generatedLink.url}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => copyText(generatedLink.url, "Link copied!")} className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                        <Copy size={14} /> Copy
                      </button>
                      <a href={generatedLink.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                        Open <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

        </div>

        {/* Settings Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[24px] border border-white/10 bg-[#0c0e14] p-6">
            <div className="mb-6 flex items-center gap-2">
              <Settings size={18} className="text-amber-500" />
              <h3 className="text-lg font-black text-white">Payment Setup</h3>
            </div>
            <form onSubmit={saveSettings} className="grid gap-5">
              <div className="group relative">
                <input className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pt-5 text-white text-sm outline-none transition-all focus:border-amber-500/50"
                  placeholder=" " value={settingsDraft.upiId} onChange={e => setSettingsDraft({ ...settingsDraft, upiId: e.target.value })} />
                <label className="absolute left-4 top-4 text-[11px] text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[9px] peer-focus:top-1.5 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:top-1.5">
                  UPI ID
                </label>
              </div>
              <div className="group relative">
                <input className="peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pt-5 text-white text-sm outline-none transition-all focus:border-amber-500/50"
                  placeholder=" " value={settingsDraft.payeeName} onChange={e => setSettingsDraft({ ...settingsDraft, payeeName: e.target.value })} />
                <label className="absolute left-4 top-4 text-[11px] text-white/40 uppercase tracking-wider font-bold transition-all peer-focus:text-[9px] peer-focus:top-1.5 peer-focus:text-amber-500 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:top-1.5">
                  Payee Name
                </label>
              </div>
              <button type="submit" disabled={savingSettings} className="w-full rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold py-3 text-sm transition-colors flex items-center justify-center gap-2">
                {savingSettings ? <Loader2 size={16} className="animate-spin" /> : "Save Settings"}
              </button>
            </form>
          </motion.section>
        </div>
      </div>

      {/* Database Table */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} delay={0.2} className="rounded-[24px] border border-white/10 bg-[#0c0e14] overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 bg-white/5 px-6 py-5 gap-4">
          <h3 className="flex items-center gap-2 text-lg font-black text-white">
            <Link2 size={18} className="text-amber-500" /> Payment Records Log
          </h3>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input type="text" placeholder="Search customer or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-amber-500/50 outline-none" />
            </div>
            <button onClick={exportRecords} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center text-white/40"><Loader2 className="animate-spin" /></div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-10 text-center text-sm text-white/40">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm whitespace-nowrap">
              <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expiry / Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredLinks.map((link) => {
                  const status = getStatus(link, now);
                  const paymentUrl = getPaymentUrl(link.id);
                  const isBusy = actionId === link.id || actionId === `del-${link.id}`;

                  return (
                    <tr key={link.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-amber-500">{link.orderId}</td>
                      <td className="px-6 py-4 text-white font-medium">{link.customerName}</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">₹{Number(link.amount).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            status === "revoked" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                              "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/50">
                        {new Date(toDate(link.expiresAt)).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button disabled={isBusy} onClick={() => copyText(paymentUrl, "Link copied!")} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors" title="Copy Link">
                            <Copy size={16} />
                          </button>
                          {status === "active" && (
                            <button disabled={isBusy} onClick={() => revokeLink(link)} className="text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 p-2 rounded-lg transition-colors" title="Revoke Link">
                              <Ban size={16} />
                            </button>
                          )}
                          <button disabled={isBusy} onClick={() => deleteLink(link)} className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors" title="Delete record">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </div>
  );
}
