"use client";

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
import { toast } from 'sonner';

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
          <div key={i} style={{ height: '120px', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border-gold)', opacity: 0.5 }} className="animate-pulse" />
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
    <div className="grid gap-6">
      
      {/* Top Banner Control */}
      <div className="flex justify-between items-center flex-wrap gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-[var(--font-h)] text-white m-0">Dashboard Overview</h2>
          <p className="text-[13px] text-[var(--color-muted)] mt-1.5 font-medium">Real-time summary of sales revenue, net profit margin and transaction tracking logs.</p>
        </div>

        <button
          onClick={() => loadStats(true)}
          className="btn btn-outline border-[var(--color-border-gold)] text-[var(--color-gold)] px-5 py-2.5 text-[13px] h-10 hover:bg-[var(--color-gold-dim)]"
          disabled={isLoading}
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> 
          Refresh Metrics
        </button>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-[var(--color-border-gold)] transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--color-bg2)] border border-[var(--color-border-gold)] text-[var(--color-gold)] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_var(--color-gold-dim)]">
                  <Icon size={20} />
                </div>
              </div>
              
              <div>
                <div className="text-[13px] text-[var(--color-muted)] font-medium mb-1 uppercase tracking-wide">{stat.title}</div>
                <div className="text-2xl font-black font-[var(--font-h)] text-white tracking-tight">{stat.value}</div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-xl group-hover:opacity-[0.08] transition-opacity duration-300"></div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Glowing SVG Area Line Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="text-[15px] font-bold mb-6 text-white flex items-center gap-2 font-[var(--font-h)] tracking-wide">
            <TrendingUp size={18} className="text-[var(--color-gold)]" /> Revenue & Net Profit Trend
          </h3>
          <div className="relative w-full h-[240px] py-2 flex-1">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="profitArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-green)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-green)" stopOpacity="0.0" />
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
              <polyline points={revPathPoints} fill="none" stroke="var(--color-gold)" strokeWidth="2.5" />
              <polyline points={profitPathPoints} fill="none" stroke="var(--color-green)" strokeWidth="2" strokeDasharray="3 3" />

              {/* Data dots */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.rev)} r="4.5" fill="var(--color-bg)" stroke="var(--color-gold)" strokeWidth="2" className="transition-all hover:r-6 cursor-pointer" />
                  <circle cx={getX(i)} cy={getY(d.profit)} r="3.5" fill="var(--color-bg)" stroke="var(--color-green)" strokeWidth="1.5" />
                </g>
              ))}

              {/* X axis labels */}
              {chartData.map((d, i) => (
                <text key={i} x={getX(i)} y="184" fill="var(--color-muted)" fontSize="9" textAnchor="middle" className="font-semibold tracking-wide">
                  {d.label}
                </text>
              ))}
              
              {/* Y scale labels */}
              <text x="30" y={getY(maxVal)} fill="var(--color-muted)" fontSize="8.5" textAnchor="end" className="font-medium">
                ₹{Math.round(maxVal / 1000)}k
              </text>
              <text x="30" y={getY(0)} fill="var(--color-muted)" fontSize="8.5" textAnchor="end" className="font-medium">
                ₹0
              </text>
            </svg>
          </div>
          <div className="flex gap-6 justify-center mt-5 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-[11.5px] text-white font-medium">
              <span className="w-2.5 h-2.5 bg-[var(--color-gold)] rounded-full shadow-[0_0_8px_var(--color-gold)]" /> Gross Revenue
            </div>
            <div className="flex items-center gap-2 text-[11.5px] text-white font-medium">
              <span className="w-2.5 h-2.5 bg-[var(--color-green)] rounded-full shadow-[0_0_8px_var(--color-green)]" /> Net Profit
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <h3 className="text-[15px] font-bold mb-6 text-white flex items-center gap-2 font-[var(--font-h)] tracking-wide">
            <Activity size={18} className="text-[var(--color-gold)]" /> Live Feed (Recent Transactions)
          </h3>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 scrollbar-thin">
            {data.slice(0, 6).map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg2)] border border-[var(--color-border-gold)] flex items-center justify-center text-[10.5px] font-black text-[var(--color-gold)] tracking-wider">
                    {tx.transaction_type === 'Account' ? 'ACC' : tx.transaction_type === 'XSuit' ? 'XSU' : tx.transaction_type === 'Supercar' ? 'CAR' : 'UC'}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-white m-0">
                      {tx.transaction_type} Sale <span className="text-[var(--color-muted)] font-normal text-xs ml-1">#{tx.transaction_id.slice(-6)}</span>
                    </p>
                    <p className="text-[11.5px] text-[var(--color-muted)] m-0 mt-0.5 flex items-center gap-2">
                      {new Date(tx.transaction_date).toLocaleDateString()} 
                      <span className="w-1 h-1 rounded-full bg-white/20"></span> 
                      <span className={tx.payment_status === 'Paid' ? 'text-[var(--color-green)]' : 'text-[var(--color-gold)]'}>{tx.payment_status}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-white tracking-wide">
                  ₹{Number(tx.sold_price || 0).toLocaleString()}
                </span>
              </div>
            ))}
            {data.length === 0 && (
              <div className="py-10 text-center text-[var(--color-muted)] text-[13px] bg-white/5 rounded-xl border border-white/5">
                No transactions recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
