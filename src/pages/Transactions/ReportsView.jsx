import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, DollarSign, TrendingUp, ShoppingBag, PieChart, ArrowUpRight, Search, Download } from 'lucide-react';
import { fetchAllTransactions } from '../../services/transactionService';
import { exportToExcel } from '../../lib/excelExport';
import toast from 'react-hot-toast';

export default function ReportsView() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions();
      setData(txs || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate aggregate financial metrics
  const metrics = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    let profit = 0;
    let accountCount = 0;
    let ucCount = 0;
    let xsuitCount = 0;
    let supercarCount = 0;

    data.forEach(tx => {
      revenue += Number(tx.sold_price || 0);
      cost += Number(tx.owner_price || 0);
      profit += Number(tx.profit || 0);

      if (tx.transaction_type === 'Account') accountCount++;
      else if (tx.transaction_type === 'UC') ucCount++;
      else if (tx.transaction_type === 'XSuit') xsuitCount++;
      else if (tx.transaction_type === 'Supercar') supercarCount++;
    });

    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const aov = data.length > 0 ? revenue / data.length : 0;

    return {
      revenue,
      cost,
      profit,
      margin,
      aov,
      accountCount,
      ucCount,
      xsuitCount,
      supercarCount,
      totalCount: data.length
    };
  }, [data]);

  // Filtered transactions for the report table
  const filteredTxs = useMemo(() => {
    return data.filter(tx => {
      const matchesSearch = tx.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.buyer_phone && tx.buyer_phone.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === 'All' || tx.transaction_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [data, searchQuery, typeFilter]);

  const handleExportFiltered = () => {
    exportToExcel(filteredTxs, `Filtered_Reports_Export`);
    toast.success('Excel Report exported!');
  };

  return (
    <div className="space-y-6">
      {/* 4 Financial Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ border: '1px solid var(--border-gold)', background: 'linear-gradient(135deg, var(--bg2), rgba(52, 211, 153, 0.02))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            <span>Gross Revenue</span>
            <DollarSign size={16} style={{ color: '#34d399' }} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#34d399', marginTop: '12px' }}>
            ₹{metrics.revenue.toLocaleString()}
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            Total value of all orders combined
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card" style={{ border: '1px solid var(--border-gold)', background: 'linear-gradient(135deg, var(--bg2), rgba(251, 146, 60, 0.02))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            <span>Net Profit</span>
            <TrendingUp size={16} style={{ color: 'var(--gold)' }} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--gold)', marginTop: '12px' }}>
            ₹{metrics.profit.toLocaleString()}
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            Net earnings after paying owners
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ border: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            <span>Profit Margin</span>
            <TrendingUp size={16} style={{ color: 'var(--orange)' }} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '12px' }}>
            {metrics.margin.toFixed(1)}%
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            Percent of revenue that is net profit
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ border: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            <span>Average Order Value</span>
            <ShoppingBag size={16} style={{ color: 'var(--muted)' }} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '12px' }}>
            ₹{Math.round(metrics.aov).toLocaleString()}
          </h2>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '8px' }}>
            Average amount spent per transaction
          </div>
        </motion.div>
      </div>

      {/* Breakdown by Transaction Type */}
      <div className="card" style={{ border: '1px solid var(--border-gold)', background: 'var(--bg2)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={16} style={{ color: 'var(--gold)' }} /> Transaction Categories Volume & Share
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            { label: 'BGMI Account Deals', count: metrics.accountCount, color: 'var(--gold)' },
            { label: 'UC Top-Up Packs', count: metrics.ucCount, color: '#34d399' },
            { label: 'XSuit Skin Gifts', count: metrics.xsuitCount, color: 'var(--orange)' },
            { label: 'Supercar Skin Gifts', count: metrics.supercarCount, color: '#60a5fa' }
          ].map(cat => {
            const pct = metrics.totalCount > 0 ? (cat.count / metrics.totalCount) * 100 : 0;
            return (
              <div key={cat.label} style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>{cat.label}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{cat.count}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: cat.color }}>{pct.toFixed(0)}% Share</span>
                </div>
                {/* Horizontal Progress */}
                <div style={{ width: '100%', height: '4px', background: 'var(--bg2)', borderRadius: '2px', overflow: 'hidden', marginTop: '12px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: '2px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Logs with Filters */}
      <div className="card" style={{ border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
            Transaction History Report
          </h3>
          <button onClick={handleExportFiltered} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 16px' }}>
            <Download size={14} /> Export Report (Excel)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', height: '38px' }}
              placeholder="Search by ID or Buyer Phone..."
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input" style={{ width: '160px', height: '38px' }}>
            <option value="All">All Types</option>
            <option value="Account">Account</option>
            <option value="UC">UC</option>
            <option value="XSuit">XSuit</option>
            <option value="Supercar">Supercar</option>
          </select>
        </div>

        {/* Custom summary table */}
        <div className="table-wrap" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Type</th>
                <th>Buyer Phone</th>
                <th>Deal Mode</th>
                <th>Sold Price</th>
                <th>Owner Price</th>
                <th>Profit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>No report records match filters.</td></tr>
              ) : filteredTxs.map(tx => (
                <tr key={tx.transaction_id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--gold)', fontSize: '12px' }}>{tx.transaction_id}</td>
                  <td><span className="status status-available" style={{ fontSize: '10px' }}>{tx.transaction_type}</span></td>
                  <td style={{ fontSize: '12px' }}>{tx.buyer_phone || '—'}</td>
                  <td style={{ fontSize: '12px' }}>{tx.mode_of_deal || '—'}</td>
                  <td style={{ fontWeight: 600, fontSize: '12px' }}>₹{Number(tx.sold_price || 0).toLocaleString()}</td>
                  <td style={{ fontSize: '12px', color: 'var(--muted)' }}>₹{Number(tx.owner_price || 0).toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: '#34d399', fontSize: '12px' }}>₹{Number(tx.profit || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status ${tx.payment_status === 'Fully Paid' || tx.payment_status === 'Paid' ? 'status-available' : 'status-pending'}`} style={{ fontSize: '9px' }}>
                      {tx.payment_status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
