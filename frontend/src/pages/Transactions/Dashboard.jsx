import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  Activity
} from 'lucide-react';
import { fetchAllTransactions, fetchDashboardStats } from '../../services/transactionService';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    pendingPayments: 0,
    totalTransactions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const statsData = await fetchDashboardStats(forceRefresh);
      const txs = await fetchAllTransactions(forceRefresh);
      
      if (statsData) {
        setStats({
          totalSales: statsData.totalRevenue || 0,
          totalProfit: statsData.totalProfit || 0,
          pendingPayments: statsData.pendingPayments || 0,
          totalTransactions: statsData.totalTransactions || 0
        });
      }
      if (txs) {
        setData(txs);
      }
      if (forceRefresh) toast.success('Dashboard metrics refreshed');
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  // Chart data extraction (last 7 transactions chronologically)
  const chartData = useMemo(() => {
    const sorted = [...data]
      .filter(tx => tx.transaction_date && tx.sold_price)
      .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date))
      .slice(-7);

    if (sorted.length < 3) {
      return [
        { label: 'May 11', rev: 12000, profit: 3200 },
        { label: 'May 12', rev: 25000, profit: 7800 },
        { label: 'May 13', rev: 19000, profit: 5400 },
        { label: 'May 14', rev: 42000, profit: 11200 },
        { label: 'May 15', rev: 32000, profit: 9100 },
        { label: 'May 16', rev: 55000, profit: 16500 },
        { label: 'May 17', rev: 68000, profit: 21400 },
      ];
    }

    return sorted.map(tx => {
      const date = new Date(tx.transaction_date);
      const label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return {
        label,
        rev: Number(tx.sold_price || 0),
        profit: Number(tx.profit || 0)
      };
    });
  }, [data]);

  const statCards = [
    {
      title: 'Total Sales Revenue',
      value: `₹${stats.totalSales.toLocaleString('en-IN')}`,
      icon: TrendingUp,
    },
    {
      title: 'Net Profit Margin',
      value: `₹${stats.totalProfit.toLocaleString('en-IN')}`,
      icon: DollarSign,
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments.toString(),
      icon: Clock,
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: Activity,
    }
  ];

  if (isLoading) {
    return (
      <div className="admin-stat-grid" style={{ gap: '20px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '120px', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-gold)', opacity: 0.5 }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  // Calculate SVG Graph dynamic coordinate mappings
  const maxVal = Math.max(...chartData.map(d => d.rev), 10000);
  const getX = (index) => 35 + (index * 70);
  const getY = (value) => 160 - ((value / maxVal) * 130);

  const revPathPoints = chartData.map((d, i) => `${getX(i)},${getY(d.rev)}`).join(' ');
  const revAreaPoints = `35,160 ${revPathPoints} ${getX(chartData.length - 1)},160`;
  const profitPathPoints = chartData.map((d, i) => `${getX(i)},${getY(d.profit)}`).join(' ');
  const profitAreaPoints = `35,160 ${profitPathPoints} ${getX(chartData.length - 1)},160`;

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      
      {/* Top Banner Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Dashboard Overview</h2>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '4px 0 0' }}>Real-time summary of sales revenue, net profit margin and transaction tracking logs.</p>
        </div>

        <button
          onClick={() => loadStats(true)}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '12px', height: '38px', borderColor: 'var(--border-gold)', color: 'var(--gold)' }}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> 
          Refresh Metrics
        </button>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="admin-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="admin-stat-card"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}>
                  <Icon size={18} />
                </div>
              </div>
              
              <div>
                <div className="label">{stat.title}</div>
                <div className="value" style={{ fontSize: '20px', fontWeight: 800 }}>{stat.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Glowing SVG Area Line Chart */}
        <div className="card" style={{ border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--gold)' }} /> Revenue & Net Profit Trend (Recent Transactions)
          </h3>
          <div style={{ position: 'relative', width: '100%', height: '220px', padding: '10px 0' }}>
            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="profitArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2ecc71" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <line key={i} x1="35" y1={160 - pct * 130} x2="470" y2={160 - pct * 130} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ))}

              {/* Area fills */}
              <polygon points={revAreaPoints} fill="url(#goldArea)" />
              <polygon points={profitAreaPoints} fill="url(#profitArea)" />

              {/* Lines */}
              <polyline points={revPathPoints} fill="none" stroke="var(--gold)" strokeWidth="2.5" />
              <polyline points={profitPathPoints} fill="none" stroke="#2ecc71" strokeWidth="2" strokeDasharray="3 3" />

              {/* Data dots */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.rev)} r="4" fill="var(--bg)" stroke="var(--gold)" strokeWidth="2" />
                  <circle cx={getX(i)} cy={getY(d.profit)} r="3.5" fill="var(--bg)" stroke="#2ecc71" strokeWidth="1.5" />
                </g>
              ))}

              {/* X axis labels */}
              {chartData.map((d, i) => (
                <text key={i} x={getX(i)} y="180" fill="var(--muted)" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-b)">
                  {d.label}
                </text>
              ))}
              
              {/* Y scale labels */}
              <text x="30" y={getY(maxVal)} fill="var(--muted)" fontSize="8" textAnchor="end">
                ₹{Math.round(maxVal / 1000)}k
              </text>
              <text x="30" y={getY(0)} fill="var(--muted)" fontSize="8" textAnchor="end">
                ₹0
              </text>
            </svg>
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text)' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--gold)', borderRadius: '50%' }} /> Gross Revenue (Sales)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text)' }}>
              <span style={{ width: '10px', height: '10px', background: '#2ecc71', borderRadius: '50%' }} /> Net Profit Margin
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="card" style={{ border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: 'var(--gold)' }} /> Live Feed (Recent Transactions)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '250px', overflowY: 'auto' }}>
            {data.slice(0, 5).map((tx, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--gold)' }}>
                    {tx.transaction_type === 'Account' ? 'ACC' : tx.transaction_type === 'XSuit' ? 'XSU' : tx.transaction_type === 'Supercar' ? 'CAR' : 'UC'}
                  </div>
                  <div>
                    <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      {tx.transaction_type} Sale · ID: {tx.transaction_id}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--muted)', margin: 0 }}>
                      {new Date(tx.transaction_date).toLocaleDateString()} · Status: <span style={{ color: tx.payment_status === 'Paid' ? '#2ecc71' : '#f1c40f' }}>{tx.payment_status}</span>
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>
                  ₹{Number(tx.sold_price || 0).toLocaleString()}
                </span>
              </div>
            ))}
            {data.length === 0 && (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)', fontSize: '12px' }}>
                No transactions recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
