import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import AdminLayout from "../../components/AdminLayout";
import { toast } from 'sonner';
import { Star, Trash2, CheckCircle, Clock, Search } from "lucide-react";

const EMPTY = { name: "", stars: 5, text: "", tracking_id: "", status: "approved" };

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    setFetching(true);
    try {
      const data = await api.get('reviews');
      setReviews(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.text) { toast.error("Name and review text required"); return; }
    setLoading(true);
    try {
      await api.create("reviews", { 
        ...form, 
        stars: Number(form.stars),
        uid: "ADMIN_MANUAL",
        created_at: new Date().toISOString()
      });
      
      toast.success("Review added!");
      setShowModal(false);
      setForm(EMPTY);
      fetchReviews();
    } catch(e) { 
      toast.error(e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete('reviews', id);
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    try {
      await api.update('reviews', id, { status: newStatus });
      toast.success(`Review ${newStatus}`);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const filtered = reviews.filter(r => 
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.text?.toLowerCase().includes(search.toLowerCase()) ||
    r.tracking_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Reviews">
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <input 
          className="input" 
          placeholder="🔍 Search reviews, names, order IDs..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          style={{ maxWidth: "400px" }} 
        />
        <button onClick={() => setShowModal(true)} className="btn btn-gold" style={{ marginLeft: "auto" }}>+ Add Review</button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Rating</th>
              <th>Order ID</th>
              <th>Image</th>
              <th>Status</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>Loading reviews...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>No reviews found.</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--gold)", fontSize: "12px" }}>
                      {(r.name || "?")[0].toUpperCase()}
                    </div>
                    <strong style={{ fontSize: "13px" }}>{r.name}</strong>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "2px", color: "var(--gold)" }}>
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < r.stars ? "var(--gold)" : "transparent"} />)}
                  </div>
                </td>
                <td><span style={{ fontSize: "12px", color: "var(--muted)" }}>{r.tracking_id || "—"}</span></td>
                <td>
                  {r.image_url ? (
                    <a href={r.image_url} target="_blank" rel="noreferrer">
                      <img src={r.image_url} alt="Proof" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--border-gold)" }} />
                    </a>
                  ) : "—"}
                </td>
                <td>
                  <span className={`status ${r.status === 'approved' ? 'status-available' : 'status-pending'}`} style={{ fontSize: "10px" }}>
                    {r.status === 'approved' ? '● Approved' : '● Pending'}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: "12px", color: "var(--muted)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.text}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => toggleStatus(r.id, r.status)} 
                      className="btn btn-sm" 
                      style={{ background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--border-gold)" }}
                    >
                      {r.status === 'approved' ? "Reject" : "Approve"}
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-red" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
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
            <h2 style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>Add Review</h2>
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={ls}>Buyer Name *</label>
                <input className="input" placeholder="e.g. Arun Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={ls}>Stars (1-5)</label>
                  <select className="input" value={form.stars} onChange={e => setForm({ ...form, stars: e.target.value })}>
                    {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label style={ls}>Order ID</label>
                  <input className="input" placeholder="e.g. MBS-101" value={form.tracking_id} onChange={e => setForm({ ...form, tracking_id: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={ls}>Review Text *</label>
                <textarea className="input" rows={4} placeholder="What did the buyer say..." value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
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

const ls = { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" };

