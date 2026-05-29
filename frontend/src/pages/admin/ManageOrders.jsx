import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, updateDoc, doc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import AdminLayout from "../../components/AdminLayout";
import { toast } from 'sonner';

const EMPTY = { buyerName:"", buyerContact:"", accountTitle:"", amount:"", status:"pending", notes:"" };

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
  const openEdit = (o) => { setForm({ ...o }); setEditId(o.id); setShowModal(true); };
  const close = () => { setShowModal(false); setEditId(null); setForm(EMPTY); };

  const handleSave = async () => {
    if (!form.buyerName) { toast.error("Buyer name is required"); return; }
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "orders", editId), form);
        toast.success("Order updated!");
      } else {
        await addDoc(collection(db, "orders"), { ...form, createdAt: serverTimestamp() });
        toast.success("Order added!");
      }
      close();
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order?")) return;
    await deleteDoc(doc(db, "orders", id));
    toast.success("Deleted");
  };

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    toast.success(`Status → ${status}`);
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout title="Orders">
      <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:"8px" }}>
          {["all","pending","completed","cancelled"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn btn-sm"
              style={{ background: filter === f ? "var(--gold)" : "var(--bg2)", color: filter === f ? "#000" : "var(--muted)", border:"1px solid var(--border-gold)", textTransform:"capitalize" }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={openAdd} className="btn btn-gold btn-sm" style={{ marginLeft:"auto" }}>+ Add Order</button>
      </div>

      <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"13px", color:"var(--muted)" }}>Total: <strong style={{ color:"var(--text)" }}>{orders.length}</strong></span>
        <span style={{ fontSize:"13px", color:"var(--gold)" }}>Pending: <strong>{orders.filter(o=>o.status==="pending").length}</strong></span>
        <span style={{ fontSize:"13px", color:"var(--green)" }}>Completed: <strong>{orders.filter(o=>o.status==="completed").length}</strong></span>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Contact</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:"40px", color:"var(--muted)" }}>No orders found.</td></tr>
            ) : filtered.map(o => (
              <tr key={o.id}>
                <td><strong style={{ fontSize:"13px" }}>{o.buyerName}</strong></td>
                <td><span style={{ fontSize:"12px", color:"var(--muted)" }}>{o.buyerContact || "—"}</span></td>
                <td><span style={{ fontSize:"12px", maxWidth:"200px", display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.accountTitle || "—"}</span></td>
                <td><strong style={{ color:"var(--gold)", fontFamily:"var(--font-h)" }}>{o.amount ? `₹${Number(o.amount).toLocaleString("en-IN")}` : "—"}</strong></td>
                <td>
                  <select className="input" value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                    style={{ padding:"4px 10px", fontSize:"12px", width:"auto", background:"var(--bg)" }}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={() => openEdit(o)} className="btn btn-sm btn-outline">Edit</button>
                    <button onClick={() => handleDelete(o.id)} className="btn btn-sm btn-red">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && close()}>
          <div className="modal">
            <button className="modal-close" onClick={close}>×</button>
            <h2 style={{ fontFamily:"var(--font-h)", fontSize:"24px", fontWeight:700, marginBottom:"24px" }}>
              {editId ? "Edit Order" : "Add Order"}
            </h2>
            <div style={{ display:"grid", gap:"14px" }}>
              {[["Buyer Name *","text","buyerName","e.g. Arun Kumar"],["Contact (WhatsApp/Phone)","text","buyerContact","+91..."],["Account Title","text","accountTitle","e.g. Premium Account"],["Amount (₹)","number","amount","e.g. 15000"]].map(([label,type,key,ph]) => (
                <div key={key}>
                  <label style={ls}>{label}</label>
                  <input className="input" type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
                </div>
              ))}
              <div>
                <label style={ls}>Status</label>
                <select className="input" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label style={ls}>Notes</label>
                <textarea className="input" rows={3} placeholder="Any notes..." value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} />
              </div>
              <div style={{ display:"flex", gap:"12px", justifyContent:"flex-end" }}>
                <button onClick={close} className="btn btn-outline">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="btn btn-gold">
                  {loading ? "Saving..." : editId ? "Update" : "Add Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const ls = { display:"block", fontSize:"12px", fontWeight:600, color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" };
