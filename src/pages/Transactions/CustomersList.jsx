import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, ArrowUpRight, Calendar, Receipt, DollarSign, ExternalLink } from 'lucide-react';
import { fetchAllTransactions } from '../../services/transactionService';
import toast from 'react-hot-toast';

export default function CustomersList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions();
      setData(txs || []);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  // Group transactions by buyer phone to compute unique customer profiles
  const customers = useMemo(() => {
    const map = {};
    data.forEach(tx => {
      const phone = tx.buyer_phone ? tx.buyer_phone : 'Unknown';
      if (!map[phone]) {
        map[phone] = {
          phone,
          totalSpent: 0,
          ordersCount: 0,
          lastPurchaseDate: tx.transaction_date,
          transactions: []
        };
      }
      map[phone].totalSpent += Number(tx.sold_price || 0);
      map[phone].ordersCount += 1;
      map[phone].transactions.push(tx);
      
      // Update last purchase date if newer
      if (new Date(tx.transaction_date) > new Date(map[phone].lastPurchaseDate)) {
        map[phone].lastPurchaseDate = tx.transaction_date;
      }
    });

    // Convert map to array and sort by total spent
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [data]);

const filteredCustomers = useMemo(() => {
  return customers.filter((c) =>
    (c.phone || "")
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
}, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by Customer Phone..."
          />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: 'auto' }}>
          Total Unique Customers: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{customers.length}</span>
        </div>
      </div>

      {/* Customers Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '12px' }} />
          <p>Processing customer records...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <User size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          No customers found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredCustomers.map((customer, idx) => (
            <motion.div
              key={customer.phone}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="card customer-card"
              onClick={() => setSelectedCustomer(customer)}
              style={{
                cursor: 'pointer',
                border: '1px solid var(--border-gold)',
                background: 'linear-gradient(135deg, var(--bg2), rgba(255,215,0,0.02))',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(255, 215, 0, 0.05)' }}
            >
              {/* Gold accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--gold), var(--orange))' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                      {customer.phone}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      Last purchase: {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="status status-available" style={{ fontSize: '10px' }}>
                  #{idx + 1} Spender
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px', padding: '12px 16px', background: 'var(--bg)', borderRadius: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>Total Spent</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#34d399' }}>
                    ₹{customer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>Total Orders</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)' }}>
                    {customer.ordersCount} deals
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', fontSize: '12px', color: 'var(--gold)', fontWeight: 600, alignItems: 'center', gap: '4px' }}>
                View Deal History <ArrowUpRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="modal-overlay" onClick={() => setSelectedCustomer(null)} style={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                height: '100vh',
                background: 'var(--bg)',
                borderLeft: '1px solid var(--border-gold)',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}
            >
              {/* Close and Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-h)' }}>
                      {selectedCustomer.phone}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      VIP Customer Profile
                    </p>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedCustomer(null)} style={{ position: 'static' }}>×</button>
              </div>

              {/* Quick stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div className="card" style={{ border: '1px solid var(--border-gold)', background: 'var(--bg2)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Revenue Contribution</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#34d399' }}>
                    ₹{selectedCustomer.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="card" style={{ border: '1px solid var(--border)', background: 'var(--bg2)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Total Transactions</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gold)' }}>
                    {selectedCustomer.ordersCount} Purchases
                  </span>
                </div>
              </div>

              {/* Transactions Timeline */}
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={16} style={{ color: 'var(--gold)' }} /> Purchase History
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {selectedCustomer.transactions.map((tx, idx) => (
                  <div
                    key={tx.transaction_id}
                    style={{
                      padding: '16px',
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
                        {tx.transaction_id}
                      </span>
                      <span className={`status ${tx.transaction_type === 'Account' ? 'status-available' : tx.transaction_type === 'XSuit' ? 'status-pending' : tx.transaction_type === 'Supercar' ? 'status-sold' : 'status-available'}`} style={{ fontSize: '10px' }}>
                        {tx.transaction_type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)' }}>
                        <Calendar size={13} /> {new Date(tx.transaction_date).toLocaleDateString()}
                      </div>
                      <div style={{ fontWeight: 800, color: '#fff' }}>
                        ₹{Number(tx.sold_price || 0).toLocaleString()}
                      </div>
                    </div>

                    {/* Details details */}
                    <div style={{ display: 'flex', gap: '16px', borderTop: '1px dashed var(--border)', paddingTop: '10px', fontSize: '11px', color: 'var(--muted)' }}>
                      <div>Mode: <span style={{ color: 'var(--text)' }}>{tx.mode_of_deal}</span></div>
                      <div>Payment: <span style={{ color: 'var(--text)' }}>{tx.payment_status}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
