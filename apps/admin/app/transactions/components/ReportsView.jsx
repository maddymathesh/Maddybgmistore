"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, DollarSign, TrendingUp, ShoppingBag, PieChart, ArrowUpRight, Search, Download } from 'lucide-react';
import { fetchAllTransactions } from '../../services/transactionService';
import { exportToExcel } from '../../lib/excelExport';
import { toast } from 'sonner';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-[#10b981]/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
          <div className="flex justify-between items-center text-xs text-muted font-bold uppercase tracking-wider relative z-10">
            <span>Gross Revenue</span>
            <DollarSign size={16} className="text-[#10b981]" />
          </div>
          <h2 className="text-3xl font-black text-[#10b981] mt-4 font-mono relative z-10 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            ₹{metrics.revenue.toLocaleString('en-IN')}
          </h2>
          <div className="text-[10px] text-muted mt-2 relative z-10">
            Total value of all orders combined
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-6 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-gold/[0.05] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
          <div className="flex justify-between items-center text-xs text-muted font-bold uppercase tracking-wider relative z-10">
            <span>Net Profit</span>
            <TrendingUp size={16} className="text-gold" />
          </div>
          <h2 className="text-3xl font-black text-gold mt-4 font-mono relative z-10 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
            ₹{metrics.profit.toLocaleString('en-IN')}
          </h2>
          <div className="text-[10px] text-muted mt-2 relative z-10">
            Net earnings after paying owners
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] relative overflow-hidden group">
          <div className="flex justify-between items-center text-xs text-muted font-bold uppercase tracking-wider relative z-10">
            <span>Profit Margin</span>
            <TrendingUp size={16} className="text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-white mt-4 font-mono relative z-10">
            {metrics.margin.toFixed(1)}%
          </h2>
          <div className="text-[10px] text-muted mt-2 relative z-10">
            Percent of revenue that is net profit
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] relative overflow-hidden group">
          <div className="flex justify-between items-center text-xs text-muted font-bold uppercase tracking-wider relative z-10">
            <span>Avg Order Value</span>
            <ShoppingBag size={16} className="text-muted" />
          </div>
          <h2 className="text-3xl font-black text-white mt-4 font-mono relative z-10">
            ₹{Math.round(metrics.aov).toLocaleString('en-IN')}
          </h2>
          <div className="text-[10px] text-muted mt-2 relative z-10">
            Average amount spent per transaction
          </div>
        </motion.div>
      </div>

      {/* Breakdown by Transaction Type */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 font-h uppercase tracking-wider">
          <PieChart size={16} className="text-gold" /> Transaction Categories Volume & Share
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'BGMI Account Deals', count: metrics.accountCount, color: '#FFD700', bgClass: 'from-yellow-500/20 to-yellow-500/5' },
            { label: 'UC Top-Up Packs', count: metrics.ucCount, color: '#10b981', bgClass: 'from-emerald-500/20 to-emerald-500/5' },
            { label: 'XSuit Skin Gifts', count: metrics.xsuitCount, color: '#a855f7', bgClass: 'from-purple-500/20 to-purple-500/5' },
            { label: 'Supercar Skin Gifts', count: metrics.supercarCount, color: '#3b82f6', bgClass: 'from-blue-500/20 to-blue-500/5' }
          ].map(cat => {
            const pct = metrics.totalCount > 0 ? (cat.count / metrics.totalCount) * 100 : 0;
            return (
              <div key={cat.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-200">
                <span className="text-[10px] text-muted block uppercase tracking-wider font-semibold">{cat.label}</span>
                <div className="flex justify-between items-baseline mt-3">
                  <span className="text-2xl font-black text-white font-mono">{cat.count}</span>
                  <span className="text-[11px] font-bold" style={{ color: cat.color }}>{pct.toFixed(0)}% Share</span>
                </div>
                {/* Horizontal Progress */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat.color, boxShadow: `0 0 8px ${cat.color}80` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Logs with Filters */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-bold text-white font-h uppercase tracking-wider">
            Transaction History Report
          </h3>
          <button onClick={handleExportFiltered} className="btn btn-gold flex items-center gap-2 px-4 py-2 text-xs h-9">
            <Download size={14} /> Export Report (Excel)
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/20 focus:border-gold/40 focus:ring-0 transition-all duration-200"
              placeholder="Search by ID or Buyer Phone..."
            />
          </div>
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            className="input w-full sm:w-40 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white focus:border-gold/40 focus:ring-0 transition-all duration-200"
          >
            <option value="All" className="bg-[#0e1118]">All Types</option>
            <option value="Account" className="bg-[#0e1118]">Account</option>
            <option value="UC" className="bg-[#0e1118]">UC</option>
            <option value="XSuit" className="bg-[#0e1118]">XSuit</option>
            <option value="Supercar" className="bg-[#0e1118]">Supercar</option>
          </select>
        </div>

        {/* Custom summary table */}
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Tx ID</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Type</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Buyer Phone</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Deal Mode</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Sold Price</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Owner Price</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Profit</th>
                <th className="p-4 text-[10px] font-bold text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTxs.length === 0 ? (
                <tr><td colSpan={8} className="p-12 text-center text-muted text-sm border-dashed border-white/5">No report records match filters.</td></tr>
              ) : filteredTxs.map((tx, idx) => (
                <tr key={tx.transaction_id} className={`hover:bg-white/[0.02] transition-colors duration-150 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}`}>
                  <td className="p-4 font-mono font-bold text-gold text-[11px]">{tx.transaction_id}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${tx.transaction_type === 'Account' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : tx.transaction_type === 'XSuit' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : tx.transaction_type === 'Supercar' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="p-4 text-[11px] font-medium text-white">{tx.buyer_phone || '—'}</td>
                  <td className="p-4 text-[11px] text-muted">{tx.mode_of_deal || '—'}</td>
                  <td className="p-4 font-bold text-white font-mono text-[11px]">₹{Number(tx.sold_price || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-[11px] text-muted font-mono">₹{Number(tx.owner_price || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4 font-extrabold text-[#10b981] font-mono text-[11px] filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">₹{Number(tx.profit || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${(tx.payment_status === 'Fully Paid' || tx.payment_status === 'Paid') ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
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
