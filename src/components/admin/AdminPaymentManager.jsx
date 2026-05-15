import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Copy, ExternalLink, Link2, Loader2, Plus, RefreshCcw, ShieldCheck } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../firebase";

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

function getPaymentUrl(token) {
  return `${window.location.origin}/pay/${token}`;
}

function getStatus(link, now) {
  const expiresAt = toDate(link.expiresAt);
  if (link.status !== "active") return link.status || "expired";
  if (!expiresAt || expiresAt.getTime() <= now) return "expired";
  return "active";
}

function copyText(value, message = "Copied") {
  navigator.clipboard.writeText(value);
  toast.success(message);
}

export default function AdminPaymentManager() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const linksQuery = query(collection(db, "payment_links"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      linksQuery,
      (snapshot) => {
        setPaymentLinks(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
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
    const active = paymentLinks.filter((link) => getStatus(link, now) === "active").length;
    return {
      total: paymentLinks.length,
      active,
      expired: paymentLinks.length - active,
    };
  }, [paymentLinks, now]);

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!form.customerName.trim()) return toast.error("Customer name is required");
    if (!form.orderId.trim()) return toast.error("Order ID is required");
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");
    const expiresInMinutes = Number(form.expiresInMinutes);
    if (!Number.isInteger(expiresInMinutes) || expiresInMinutes < 1 || expiresInMinutes > 30) {
      return toast.error("Timer must be between 1 and 30 minutes");
    }
    if (!/^\d{4,6}$/.test(form.pin)) return toast.error("PIN must be 4 to 6 digits");

    setGenerating(true);
    try {
      const functions = getFunctions();
      const createPaymentLink = httpsCallable(functions, "createPaymentLink");
      const result = await createPaymentLink({
        customerName: form.customerName.trim(),
        amount: Number(form.amount),
        orderId: form.orderId.trim(),
        expiresInMinutes,
        pin: form.pin,
        origin: window.location.origin,
      });

      const paymentUrl = result.data?.url || result.data?.paymentUrl;
      if (!paymentUrl) throw new Error("Payment link was created but no URL was returned.");

      setGeneratedUrl(paymentUrl);
      setForm(EMPTY_FORM);
      toast.success("Temporary payment link generated");
    } catch (error) {
      console.error("Create payment link error:", error);
      toast.error(error.message || "Failed to generate payment link");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-[14px] border border-[var(--border-gold)] bg-[var(--card)] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full bg-[rgba(255,215,0,0.08)] blur-3xl" />
        <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Temporary Links</p>
            <h2 className="mt-1 text-xl font-black text-white">Payment Manager</h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(255,215,0,0.25)] bg-[rgba(255,215,0,0.08)] px-3 py-1 text-xs font-bold text-[var(--gold)]">
            <ShieldCheck size={14} /> 1-30 minute links
          </span>
        </div>

        <form onSubmit={handleGenerate} className="relative grid gap-5">
          <div className="rounded-xl border border-[rgba(255,215,0,0.14)] bg-[rgba(255,215,0,0.03)] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-[var(--gold)]">Amount Section</h3>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Custom payment link</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_160px_180px]">
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Customer Name</span>
                <input
                  className="input"
                  placeholder="e.g. Ravi Kumar"
                  value={form.customerName}
                  onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Amount</span>
                <input
                  className="input"
                  type="number"
                  min="1"
                  placeholder="4999"
                  value={form.amount}
                  onChange={(event) => setForm({ ...form, amount: event.target.value })}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Order ID</span>
                <input
                  className="input"
                  placeholder="MBS-1024"
                  value={form.orderId}
                  onChange={(event) => setForm({ ...form, orderId: event.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[180px_180px_auto] lg:items-end">
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Timer</span>
              <div className="relative">
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="10"
                  value={form.expiresInMinutes}
                  onChange={(event) => setForm({ ...form, expiresInMinutes: event.target.value })}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--muted)]">min</span>
              </div>
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Link PIN</span>
              <input
                className="input"
                inputMode="numeric"
                maxLength={6}
                placeholder="9025"
                value={form.pin}
                onChange={(event) => setForm({ ...form, pin: event.target.value.replace(/\D/g, "") })}
              />
            </label>
            <button type="submit" disabled={generating} className="btn btn-gold justify-center">
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Generate Link
            </button>
          </div>
        </form>

        {generatedUrl && (
          <div className="relative mt-5 grid gap-3 rounded-lg border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.05)] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div className="min-w-0">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">Latest Link</div>
              <div className="truncate font-mono text-sm text-white">{generatedUrl}</div>
            </div>
            <button type="button" onClick={() => copyText(generatedUrl, "Payment link copied")} className="btn btn-outline justify-center">
              <Copy size={15} /> Copy Link
            </button>
            <a href={generatedUrl} target="_blank" rel="noreferrer" className="btn btn-outline justify-center">
              <ExternalLink size={15} /> Open Payment Page
            </a>
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total", stats.total, "text-[var(--gold)]"],
          ["Active", stats.active, "text-[var(--green)]"],
          ["Expired", stats.expired, "text-[#ef4444]"],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
            <div className={`text-3xl font-black ${color}`}>{value}</div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-[rgba(255,215,0,0.02)] px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-black text-white">
            <Link2 size={16} className="text-[var(--gold)]" /> Payment Links
          </h3>
          <span className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <RefreshCcw size={13} /> Live
          </span>
        </div>

        {loading ? (
          <div className="grid gap-3 p-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-14 animate-pulse rounded-lg bg-white/[0.04]" />
            ))}
          </div>
        ) : paymentLinks.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--muted)]">No temporary payment links yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead className="bg-[rgba(255,215,0,0.04)] text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th>Customer Name</th>
                  <th>Amount</th>
                  <th>Timer</th>
                  <th>PIN</th>
                  <th>Status</th>
                  <th>Expiry Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentLinks.map((link) => {
                  const expiresAt = toDate(link.expiresAt);
                  const status = getStatus(link, now);
                  const paymentUrl = getPaymentUrl(link.token || link.id);

                  return (
                    <tr key={link.id} className="border-t border-[var(--border)] text-slate-200">
                      <td className="px-5 py-4 font-mono text-xs text-[var(--gold)]">{link.orderId || "N/A"}</td>
                      <td>{link.customerName || "Customer"}</td>
                      <td className="font-black text-[var(--green)]">₹{Number(link.amount || 0).toLocaleString("en-IN")}</td>
                      <td className="text-xs text-[var(--muted)]">{link.expiresInMinutes || 10} min</td>
                      <td className="font-mono text-xs text-slate-300">{link.pin || "----"}</td>
                      <td>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${status === "active" ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}>
                          {status}
                        </span>
                      </td>
                      <td className="text-xs text-[var(--muted)]">
                        {expiresAt ? expiresAt.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "N/A"}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" onClick={() => copyText(paymentUrl, "Payment link copied")} className="rounded-md border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.08)] px-3 py-2 text-xs font-bold text-[var(--gold)] transition hover:bg-[rgba(255,215,0,0.12)]">
                            Copy
                          </button>
                          <a href={paymentUrl} target="_blank" rel="noreferrer" className="rounded-md border border-blue-300/20 bg-blue-300/10 px-3 py-2 text-xs font-bold text-blue-200 transition hover:bg-blue-300/15">
                            Open
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
