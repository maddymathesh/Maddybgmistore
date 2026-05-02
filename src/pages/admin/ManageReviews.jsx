import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const EMPTY = { name:"", initials:"", date:"", text:"", year: new Date().getFullYear() };

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.text) { toast.error("Name and review text required"); return; }
    setLoading(true);
    try {
      const initials = form.initials || form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
      await addDoc(collection(db, "reviews"), { ...form, initials, year: Number(form.year), createdAt: serverTimestamp() });
      toast.success("Review added!");
      setShowModal(false);
      setForm(EMPTY);
    } catch(e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    await deleteDoc(doc(db, "reviews", id));
    toast.success("Review deleted");
  };

  return (
    <AdminLayout title="Manage Reviews">
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"20px" }}>
        <button onClick={() => setShowModal(true)} className="btn btn-gold">+ Add Review</button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Year</th>
              <th>Date</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign:"center", padding:"40px", color:"var(--muted)" }}>No custom reviews yet.</td></tr>
            ) : reviews.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,var(--gold),var(--orange))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-h)", fontWeight:700, color:"#000", fontSize:"13px", flexShrink:0 }}>{r.initials}</div>
                    <strong style={{ fontSize:"13px" }}>{r.name}</strong>
                  </div>
                </td>
                <td><span style={{ fontSize:"13px", color:"var(--muted)" }}>{r.year}</span></td>
                <td><span style={{ fontSize:"13px", color:"var(--muted)" }}>{r.date}</span></td>
                <td><span style={{ fontSize:"12px", color:"var(--muted)", display:"block", maxWidth:"300px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.text}</span></td>
                <td>
                  <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-red">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2 style={{ fontFamily:"var(--font-h)", fontSize:"24px", fontWeight:700, marginBottom:"24px" }}>Add Review</h2>
            <div style={{ display:"grid", gap:"14px" }}>
              <div>
                <label style={ls}>Buyer Name *</label>
                <input className="input" placeholder="e.g. Arun Kumar" value={form.name} onChange={e => setForm({...form,name:e.target.value})} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <label style={ls}>Initials (auto)</label>
                  <input className="input" placeholder="AK" maxLength={2} value={form.initials} onChange={e => setForm({...form,initials:e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <label style={ls}>Year</label>
                  <input className="input" type="number" value={form.year} onChange={e => setForm({...form,year:e.target.value})} />
                </div>
              </div>
              <div>
                <label style={ls}>Date Label</label>
                <input className="input" placeholder="e.g. April 2026" value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
              </div>
              <div>
                <label style={ls}>Review Text *</label>
                <textarea className="input" rows={4} placeholder="What did the buyer say..." value={form.text} onChange={e => setForm({...form,text:e.target.value})} />
              </div>
              <div style={{ display:"flex", gap:"12px", justifyContent:"flex-end" }}>
                <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button onClick={handleAdd} disabled={loading} className="btn btn-gold">
                  {loading ? "Adding..." : "Add Review"}
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
