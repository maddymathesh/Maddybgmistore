import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, ShieldAlert, ArrowUpRight, RefreshCw, Activity } from 'lucide-react';
import { fetchAllTransactions, fetchDashboardStats } from '../../services/transactionService';
import toast from 'react-hot-toast';

export default function Dashboard() {
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
      const data = await fetchDashboardStats(forceRefresh);
      if (data) {
        setStats({
          totalSales: data.totalRevenue || 0,
          totalProfit: data.totalProfit || 0,
          pendingPayments: data.pendingPayments || 0,
          totalTransactions: data.totalTransactions || 0
        });
        if (forceRefresh) toast.success('Dashboard analytics refreshed');
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Sales Revenue',
      value: `₹${stats.totalSales.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-400',
      bgLight: 'bg-blue-500/10',
      text: 'text-blue-500'
    },
    {
      title: 'Net Profit Margin',
      value: `₹${stats.totalProfit.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'from-emerald-600 to-emerald-400',
      bgLight: 'bg-emerald-500/10',
      text: 'text-emerald-500'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments.toString(),
      icon: Clock,
      color: 'from-amber-600 to-amber-400',
      bgLight: 'bg-amber-500/10',
      text: 'text-amber-500'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: Activity,
      color: 'from-purple-600 to-purple-400',
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="admin-stat-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '120px', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border-gold)', opacity: 0.5 }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-16px' }}>
        <button
          onClick={() => loadStats(true)}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '12px' }}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> 
          Refresh Analytics
        </button>
      </div>

      {/* Stats Grid */}
      <div className="admin-stat-grid">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="admin-stat-card"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', border: '1px solid var(--border-gold)', color: 'var(--gold)' }}>
                  <Icon size={20} />
                </div>
              </div>
              
              <div>
                <div className="label">{stat.title}</div>
                <div className="value">{stat.value}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Placeholder for Charts / Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ minHeight: '400px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Revenue Analytics</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: 'var(--muted)', border: '2px dashed var(--border)', borderRadius: 'var(--radius)' }}>
            Chart Integration Pending
          </div>
        </div>
        <div className="card" style={{ minHeight: '400px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {/* Mock Activity */}
             {[1,2,3,4,5].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                    {i}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>New Sale recorded</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)' }}>2 hours ago</p>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
