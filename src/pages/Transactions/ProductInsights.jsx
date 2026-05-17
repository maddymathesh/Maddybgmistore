import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Gift, Car, Coins, RefreshCw } from 'lucide-react';
import { fetchAllTransactions, fetchDashboardStats } from '../../services/transactionService';
import toast from 'react-hot-toast';

export default function ProductInsights() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalProfit: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions(forceRefresh);
      const statsData = await fetchDashboardStats(forceRefresh);
      if (txs) setData(txs);
      if (statsData) {
        setStats({
          totalSales: statsData.totalRevenue || 0,
          totalProfit: statsData.totalProfit || 0
        });
      }
      if (forceRefresh) toast.success('Product insights refreshed');
    } catch (e) {
      toast.error('Failed to load insights data');
    } finally {
      setIsLoading(false);
    }
  };

  const typeBreakdown = useMemo(() => {
    const counts = { Account: 0, XSuit: 0, Supercar: 0, UC: 0 };
    const sales = { Account: 0, XSuit: 0, Supercar: 0, UC: 0 };
    const profits = { Account: 0, XSuit: 0, Supercar: 0, UC: 0 };

    data.forEach(tx => {
      const type = tx.transaction_type || 'Account';
      if (type in counts) {
        counts[type] += 1;
        sales[type] += Number(tx.sold_price || 0);
        profits[type] += Number(tx.profit || 0);
      }
    });

    return { counts, sales, profits };
  }, [data]);

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '220px', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-gold)', opacity: 0.5 }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  const products = [
    { type: 'Account', label: 'Accounts Store', color: 'var(--gold)', icon: ShieldCheck, desc: 'Premium BGMI account sales and listings.' },
    { type: 'XSuit', label: 'X-Suits Gifting', color: '#f1c40f', icon: Gift, desc: 'Levelable character suits gifted via in-game mechanics.' },
    { type: 'Supercar', label: 'Supercar Gifting', color: 'var(--red)', icon: Car, desc: 'Limited edition vehicle keys gifted directly to buyers.' },
    { type: 'UC', label: 'UC Store Packets', color: '#3498db', icon: Coins, desc: 'Unknown Cash bundles delivered to customer IDs.' }
  ];

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Product Sales Performance</h2>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>Real-time breakdown of volume, revenue and profitability across stores.</p>
        </div>
        <button
          onClick={() => loadData(true)}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '12px', borderColor: 'var(--border-gold)', color: 'var(--gold)' }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> Refresh Insights
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {products.map(prod => {
          const count = typeBreakdown.counts[prod.type] || 0;
          const revenue = typeBreakdown.sales[prod.type] || 0;
          const profit = typeBreakdown.profits[prod.type] || 0;
          const totalRev = stats.totalSales || 1;
          const percentage = Math.round((revenue / totalRev) * 100);
          const IconComp = prod.icon;

          return (
            <motion.div
              key={prod.type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
              style={{ border: '1px solid var(--border)', background: 'var(--card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: prod.color, border: '1px solid var(--border)' }}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text)' }}>{prod.label}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Share of Revenue: {percentage}%</span>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '18px', lineHeight: '1.4' }}>
                  {prod.desc}
                </p>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Orders</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>{count} deals</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Net Profits</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#2ecc71', margin: 0 }}>₹{profit.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div style={{ height: '6px', background: 'var(--bg2)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: prod.color, borderRadius: '3px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
                  <span>Total Revenue:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>₹{revenue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
