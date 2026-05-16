import { useEffect, useState } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, orderBy, query, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const EMPTY = { title:"", price:"", loginType:"", tier:"Budget", details:"", available:true, videoUrl:"" };

export default function ManageStock() {
  const [stocks, setStocks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "stocks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setStocks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = (s) => { setForm({ ...s }); setEditId(s.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.title || !form.price) { toast.error("Title and price are required"); return; }
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "stocks", editId), { ...form, price: Number(form.price) });
        toast.success("Account updated!");
      } else {
        await addDoc(collection(db, "stocks"), { ...form, price: Number(form.price), createdAt: serverTimestamp() });
        toast.success("Account added!");
      }
      closeModal();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this account listing?")) return;
    try {
      await deleteDoc(doc(db, "stocks", id));
      toast.success("Deleted!");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggleAvailable = async (id, current) => {
    try {
      await updateDoc(doc(db, "stocks", id), { available: !current });
      toast.success(current ? "Marked as Sold" : "Marked as Available");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const filtered = stocks.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.tier?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Stock">
      {/* HEADER ACTIONS */}
      <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap", alignItems:"center" }}>
        <input className="input" placeholder="🔍 Search accounts..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:"300px" }} />
        <button onClick={openAdd} className="btn btn-gold" style={{ marginLeft:"auto" }}>+ Add Account</button>
      </div>

      {/* SUMMARY */}
      <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"13px", color:"var(--muted)" }}>Total: <strong style={{ color:"var(--text)" }}>{stocks.length}</strong></span>
        <span style={{ fontSize:"13px", color:"var(--green)" }}>Available: <strong>{stocks.filter(s=>s.available).length}</strong></span>
        <span style={{ fontSize:"13px", color:"var(--red)" }}>Sold: <strong>{stocks.filter(s=>!s.available).length}</strong></span>
      </div>

      {/* TABLE */}
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Price</th>
              <th>Tier</th>
              <th>Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:"40px", color:"var(--muted)" }}>
                {stocks.length === 0 ? "No accounts yet. Click '+ Add Account' to get started." : "No matches found."}
              </td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ fontWeight:600, fontSize:"13px", maxWidth:"280px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.title}</div>
                </td>
                <td><strong style={{ color:"var(--gold)", fontFamily:"var(--font-h)", fontSize:"16px" }}>₹{Number(s.price).toLocaleString("en-IN")}</strong></td>
                <td><span style={{ fontSize:"12px", padding:"3px 10px", borderRadius:"100px", background:"var(--gold-dim)", color:"var(--gold)", border:"1px solid var(--gold-border)" }}>{s.tier}</span></td>
                <td><span style={{ fontSize:"12px", color:"var(--muted)" }}>{s.loginType || "—"}</span></td>
                <td>
                  <span className={`status ${s.available ? "status-available" : "status-sold"}`}>
                    {s.available ? "● Available" : "● Sold"}
                  </span>
                </td>
                <td>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={() => toggleAvailable(s.id, s.available)} className="btn btn-sm" style={{ background:"var(--bg2)", color:"var(--text)", border:"1px solid var(--border-gold)" }}>
                      {s.available ? "Mark Sold" : "Mark Available"}
                    </button>
                    <button onClick={() => openEdit(s)} className="btn btn-sm btn-outline">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="btn btn-sm btn-red">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth:"600px", maxHeight:"90vh", overflowY:"auto" }}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 style={{ fontFamily:"var(--font-h)", fontSize:"24px", fontWeight:700, marginBottom:"24px" }}>
              {editId ? "Edit Account" : "Add New Account"}
            </h2>

            <div style={{ display:"grid", gap:"16px" }}>
              <div>
                <label style={labelStyle}>Account Title *</label>
                <input className="input" placeholder="e.g. Conqueror Account | Galadria Xsuit LvL 5..." value={form.title} onChange={e => setForm({...form, title:e.target.value})} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input className="input" type="number" placeholder="59999" value={form.price} onChange={e => setForm({...form, price:e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Tier</label>
                  <select className="input" value={form.tier} onChange={e => setForm({...form, tier:e.target.value})}>
                    <option>Budget</option>
                    <option>Mid Range</option>
                    <option>Premium</option>
                    <option>Ultra Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Login Type</label>
                <input className="input" placeholder="e.g. Facebook, Twitter/X, Google" value={form.loginType} onChange={e => setForm({...form, loginType:e.target.value})} />
              </div>

              <div>
                <label style={labelStyle}>Video URL (YouTube/Drive)</label>
                <input className="input" placeholder="https://youtube.com/..." value={form.videoUrl || ""} onChange={e => setForm({...form, videoUrl:e.target.value})} />
              </div>

              <div>
                <label style={labelStyle}>Full Account Details</label>
                <textarea className="input" rows={8} placeholder="🌟 Account Level — 70&#10;👑 X-Suit Level — 5&#10;🔫 Gun Labs [13]&#10;..." value={form.details} onChange={e => setForm({...form, details:e.target.value})} />
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <label style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", fontSize:"14px" }}>
                  <input type="checkbox" checked={form.available} onChange={e => setForm({...form, available:e.target.checked})} style={{ width:"18px", height:"18px", accentColor:"var(--green)" }} />
                  Mark as Available (visible on Buy page)
                </label>
              </div>

              <div style={{ display:"flex", gap:"12px", justifyContent:"flex-end", paddingTop:"8px" }}>
                <button onClick={closeModal} className="btn btn-outline">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="btn btn-gold">
                  {loading ? "Saving..." : editId ? "Update Account" : "Add Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const labelStyle = { display:"block", fontSize:"12px", fontWeight:600, color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" };
