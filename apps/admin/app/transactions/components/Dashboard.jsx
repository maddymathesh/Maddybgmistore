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

  // Bezier curve interpolation helper
  const getBezierPath = (points) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const revPoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.rev) }));
  const profitPoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.profit) }));
  
  const revPath = getBezierPath(revPoints);
  const profitPath = getBezierPath(profitPoints);
  
  const revAreaPath = revPoints.length > 0 
    ? `${revPath} L ${getX(chartData.length - 1)} 160 L 35 160 Z` 
    : "";
  const profitAreaPath = profitPoints.length > 0 
    ? `${profitPath} L ${getX(chartData.length - 1)} 160 L 35 160 Z` 
    : "";

  return (
    <div className="grid gap-6">
      
      {/* Top Banner Control */}
      <div className="flex justify-between items-center flex-wrap gap-4 glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
          </div>
          <div>
            <h2 className="text-2xl font-black font-[var(--font-h)] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 tracking-wider m-0 uppercase">Dashboard Panel</h2>
            <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">Real-time statistics, gross revenue models, and transaction feeds.</p>
          </div>
        </div>

        <button
          onClick={() => loadStats(true)}
          className="btn btn-outline border-white/10 hover:border-yellow-500/30 text-[var(--color-gold)] px-6 py-2.5 text-xs h-11 hover:bg-[var(--color-gold-dim)] transition-all duration-300 relative z-10"
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> 
          Refresh Metrics
        </button>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          const isRevenue = i === 0;
          const isProfit = i === 1;
          const glowClass = isRevenue 
            ? "hover:border-yellow-500/20 hover:shadow-[0_0_30px_rgba(255,215,0,0.05)]" 
            : isProfit 
            ? "hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.05)]" 
            : "hover:border-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]";
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 border border-white/5 hover:-translate-y-0.5 ${glowClass}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 group-hover:scale-110 transition-all duration-300 ${isRevenue ? 'text-yellow-500 bg-yellow-500/5' : isProfit ? 'text-emerald-400 bg-emerald-500/5' : 'text-gray-400'}`}>
                  <Icon size={22} />
                </div>
              </div>
              
              <div>
                <div className="text-[10px] text-[var(--color-muted)] font-bold mb-1.5 uppercase tracking-widest font-mono">{stat.title}</div>
                <div className="text-2xl font-black font-[var(--font-h)] text-white tracking-tight">{stat.value}</div>
              </div>
              
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-300 ${isRevenue ? 'bg-yellow-500' : isProfit ? 'bg-emerald-500' : 'bg-white'}`} />
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Glowing SVG Area Line Chart */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/[0.01] rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-sm font-bold mb-6 text-white flex items-center gap-2 font-[var(--font-h)] tracking-widest uppercase">
            <TrendingUp size={16} className="text-yellow-500" /> Revenue & Net Profit Trend
          </h3>
          <div className="relative w-full h-[240px] py-2 flex-1">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="profitArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-green)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-green)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <line key={i} x1="35" y1={160 - pct * 130} x2="470" y2={160 - pct * 130} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              ))}

              {/* Area fills */}
              {revAreaPath && <path d={revAreaPath} fill="url(#goldArea)" />}
              {profitAreaPath && <path d={profitAreaPath} fill="url(#profitArea)" />}

              {/* Lines */}
              {revPath && <path d={revPath} fill="none" stroke="var(--color-gold)" strokeWidth="2.5" />}
              {profitPath && <path d={profitPath} fill="none" stroke="var(--color-green)" strokeWidth="2" strokeDasharray="4 3" />}

              {/* Data dots */}
              {chartData.map((d, i) => (
                <g key={i} className="group/dot">
                  <circle cx={getX(i)} cy={getY(d.rev)} r="4" fill="#080a0f" stroke="var(--color-gold)" strokeWidth="2" className="transition-all duration-350 cursor-pointer group-hover/dot:r-5" />
                  <circle cx={getX(i)} cy={getY(d.profit)} r="3" fill="#080a0f" stroke="var(--color-green)" strokeWidth="1.5" />
                </g>
              ))}

              {/* X axis labels */}
              {chartData.map((d, i) => (
                <text key={i} x={getX(i)} y="184" fill="var(--color-muted)" fontSize="8.5" textAnchor="middle" className="font-semibold tracking-wide font-mono opacity-80">
                  {d.label}
                </text>
              ))}
              
              {/* Y scale labels */}
              <text x="30" y={getY(maxVal)} fill="var(--color-muted)" fontSize="8" textAnchor="end" className="font-bold font-mono opacity-70">
                ₹{Math.round(maxVal / 1000)}K
              </text>
              <text x="30" y={getY(0)} fill="var(--color-muted)" fontSize="8" textAnchor="end" className="font-bold font-mono opacity-70">
                ₹0
              </text>
            </svg>
          </div>
          <div className="flex gap-6 justify-center mt-5 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-white font-bold tracking-wider uppercase font-mono">
              <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_8px_#ffd700]" /> Gross Revenue
            </div>
            <div className="flex items-center gap-2 text-xs text-white font-bold tracking-wider uppercase font-mono">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" /> Net Profit
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-sm font-bold mb-6 text-white flex items-center gap-2 font-[var(--font-h)] tracking-widest uppercase">
            <Activity size={16} className="text-emerald-400" /> Live Feed (Recent Transactions)
          </h3>
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {data.slice(0, 6).map((tx, idx) => {
              const isPaid = tx.payment_status === 'Paid';
              const isAccount = tx.transaction_type === 'Account';
              const isXSuit = tx.transaction_type === 'XSuit';
              const isSupercar = tx.transaction_type === 'Supercar';
              
              let typeLabel = 'UC';
              let badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
              if (isAccount) {
                typeLabel = 'ACC';
                badgeColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
              } else if (isXSuit) {
                typeLabel = 'XSU';
                badgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
              } else if (isSupercar) {
                typeLabel = 'CAR';
                badgeColor = 'text-red-400 bg-red-500/10 border-red-500/20';
              }

              return (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.02] transition-all duration-200 border border-white/5 hover:border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black tracking-wider border ${badgeColor}`}>
                      {typeLabel}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white m-0">
                        {tx.transaction_type} Sale <span className="text-[var(--color-muted)] font-mono text-[10px] ml-1">#{tx.transaction_id.toUpperCase()}</span>
                      </p>
                      <p className="text-[11px] text-[var(--color-muted)] m-0 mt-1 flex items-center gap-2 font-mono">
                        {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} 
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span> 
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${isPaid ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.1)]' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/25 shadow-[0_0_8px_rgba(234,179,8,0.1)]'}`}>
                          {tx.payment_status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white tracking-wide font-mono">
                    ₹{Number(tx.sold_price || 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
            {data.length === 0 && (
              <div className="py-12 text-center text-xs text-[var(--color-muted)] bg-white/5 rounded-2xl border border-white/5 font-mono">
                No transactions recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
