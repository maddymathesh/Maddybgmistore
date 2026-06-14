"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, BarChart3, TrendingUp, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { fetchAllTransactions, fetchDashboardStats } from '../../services/transactionService';
import { toast } from 'sonner';

export default function FinancialOverview() {
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
      if (forceRefresh) toast.success('Financial sheets refreshed');
    } catch (e) {
      toast.error('Failed to load financials');
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {[1, 2].map(i => (
          <div key={i} style={{ height: '300px', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border-gold)', opacity: 0.5 }} className="animate-pulse" />
        ))}
      </div>
    );
  }

  const roiPercent = stats.totalSales ? Math.round((stats.totalProfit / (stats.totalSales - stats.totalProfit || 1)) * 100) : 0;
  const costOfGoods = stats.totalSales - stats.totalProfit;
  const taxGtw = Math.round(stats.totalSales * 0.02);
  const netEarnings = stats.totalProfit - taxGtw;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-h">Financial Insights & Margins</h2>
          <p className="text-xs text-muted mt-1">Detailed cost structure, return on investment breakdown, and net profit earnings audits.</p>
        </div>
        <button
          onClick={() => loadData(true)}
          className="btn btn-outline flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-gold/30 hover:border-gold text-gold transition-all duration-200"
          disabled={isLoading}
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          Refresh Sheets
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Margin Breaks Doughnut chart */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md flex flex-col justify-between hover:border-gold/20 transition-all duration-300">
          <div>
            <h3 className="text-base font-bold text-white mb-2 font-h">ROI Profit Margins Share</h3>
            <p className="text-xs text-muted mb-6">Comparison of profit rates and investment margins across BGMI store categories.</p>
          </div>

          <div className="flex justify-center items-center relative h-36 mb-6">
            <svg width="128" height="128" viewBox="0 0 42 42" className="transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.15)]">
              {/* Account margin: 45% */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-gold)" strokeWidth="3.2" strokeDasharray="45 55" strokeDashoffset="0" />
              {/* Gifting margin: 35% */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3.2" strokeDasharray="35 65" strokeDashoffset="-45" />
              {/* UC packs margin: 20% */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="20 80" strokeDashoffset="-80" />
            </svg>
            <div className="absolute text-center flex flex-col items-center justify-center">
              <span className="text-[10px] tracking-wider text-muted uppercase font-semibold">Avg ROI</span>
              <span className="text-2xl font-black text-white mt-0.5 tracking-tight">{roiPercent}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-muted">
                <span className="w-2.5 h-2.5 bg-gold rounded-full shadow-[0_0_6px_var(--color-gold)]" /> Account Store sales ROI
              </span>
              <span className="font-bold text-white font-mono bg-gold/10 px-2 py-0.5 rounded-md text-[11px] border border-gold/15">45% margin rate</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-muted">
                <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full shadow-[0_0_6px_#10b981]" /> Gifting (Xsuit / Car) ROI
              </span>
              <span className="font-bold text-white font-mono bg-[#10b981]/10 px-2 py-0.5 rounded-md text-[11px] border border-[#10b981]/15">35% margin rate</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2 text-muted">
                <span className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full shadow-[0_0_6px_#3b82f6]" /> UC Packs Store ROI
              </span>
              <span className="font-bold text-white font-mono bg-[#3b82f6]/10 px-2 py-0.5 rounded-md text-[11px] border border-[#3b82f6]/15">20% margin rate</span>
            </div>
          </div>
        </div>

        {/* Detailed Profit/Cost statements list */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md flex flex-col justify-between hover:border-gold/20 transition-all duration-300">
          <div>
            <h3 className="text-base font-bold text-white mb-2 font-h">Gross vs Net Profit Margins</h3>
            <p className="text-xs text-muted mb-6">Store financial balance calculations of revenue cost margins and net merchant earnings.</p>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-sm">
              <span className="text-muted text-xs uppercase tracking-wider">Gross Store Sales</span>
              <span className="font-bold text-white font-mono">₹{stats.totalSales.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-sm">
              <span className="text-muted text-xs uppercase tracking-wider">Cost of Sales (Supplier/Loader)</span>
              <span className="font-bold text-muted font-mono">₹{costOfGoods.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-sm">
              <span className="text-muted text-xs uppercase tracking-wider">Gross Profit Margin</span>
              <span className="font-extrabold text-[#10b981] font-mono">₹{stats.totalProfit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-sm">
              <span className="text-muted text-xs uppercase tracking-wider">Gateway transaction fee (2%)</span>
              <span className="font-bold text-red-500 font-mono">- ₹{taxGtw.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-base">
              <span className="text-white font-bold font-h text-sm uppercase tracking-wider">Net Store Earnings</span>
              <span className="font-black text-[#10b981] font-mono text-lg filter drop-shadow-[0_0_6px_rgba(16,185,129,0.2)]">₹{netEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-6 p-3.5 bg-[#10b981]/5 border border-[#10b981]/10 rounded-lg text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
            <span className="text-xs">💡</span>
            <span>Net Store Earnings calculations are real-time, based on dynamic Sheet/Database fields configurations.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
