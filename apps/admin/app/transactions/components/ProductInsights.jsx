"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Gift, Car, Coins, RefreshCw } from 'lucide-react';
import { fetchAllTransactions, fetchDashboardStats } from '../../services/transactionService';
import { toast } from 'sonner';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-[220px] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const products = [
    { type: 'Account', label: 'Accounts Store', color: 'var(--color-gold)', icon: ShieldCheck, desc: 'Premium BGMI account sales and listings.' },
    { type: 'XSuit', label: 'X-Suits Gifting', color: '#f1c40f', icon: Gift, desc: 'Levelable character suits gifted via in-game mechanics.' },
    { type: 'Supercar', label: 'Supercar Gifting', color: 'var(--color-red)', icon: Car, desc: 'Limited edition vehicle keys gifted directly to buyers.' },
    { type: 'UC', label: 'UC Store Packets', color: '#3498db', icon: Coins, desc: 'Unknown Cash bundles delivered to customer IDs.' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black font-[var(--font-h)] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 uppercase m-0">Product Sales Performance</h2>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">Real-time breakdown of volume, revenue and profitability across stores.</p>
        </div>
        <button
          onClick={() => loadData(true)}
          className="btn btn-outline border-white/10 hover:border-yellow-500/30 text-[var(--color-gold)] px-6 py-2.5 text-xs h-11 hover:bg-[var(--color-gold-dim)] transition-all duration-300 relative z-10 w-full sm:w-auto justify-center"
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> Refresh Insights
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((prod, i) => {
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
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group transition-all duration-300 border border-white/5 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-all duration-300" style={{ color: prod.color }}>
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white m-0 tracking-wide">{prod.label}</h4>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--color-muted)] mb-6 leading-relaxed">
                  {prod.desc}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/5">
                    <p className="text-[9px] text-[var(--color-muted)] m-0 uppercase tracking-widest font-bold mb-1">Total Orders</p>
                    <p className="text-sm font-black text-white m-0 font-mono tracking-tight">{count} deals</p>
                  </div>
                  <div className="bg-white/[0.02] rounded-lg p-2.5 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                    <p className="text-[9px] text-[var(--color-muted)] m-0 uppercase tracking-widest font-bold mb-1">Net Profits</p>
                    <p className="text-sm font-black text-emerald-400 m-0 font-mono tracking-tight">₹{profit.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[var(--color-muted)] bg-white/5 px-3 py-2 rounded-lg font-mono">
                  <span>Total Revenue:</span>
                  <span className="font-bold text-white">₹{revenue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-300" style={{ background: prod.color }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
