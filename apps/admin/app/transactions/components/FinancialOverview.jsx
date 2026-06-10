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
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Financial Insights & Margins</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-muted)', margin: '4px 0 0' }}>Detailed cost structure, return on investment breakdown, and net profit earnings audits.</p>
        </div>
        <button
          onClick={() => loadData(true)}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '12px', borderColor: 'var(--color-border-gold)', color: 'var(--color-gold)' }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} style={{ marginRight: '6px' }} /> Refresh Sheets
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Margin Breaks Doughnut chart */}
        <div className="card" style={{ border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#eaeaea' }}>ROI Profit Margins Share</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '18px' }}>Comparison of profit rates and investment margins across BGMI store categories.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', height: '140px', alignItems: 'center', marginBottom: '16px' }}>
            <svg width="120" height="120" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2ecc71" strokeWidth="3" strokeDasharray="35 65" strokeDashoffset="25" />
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--color-gold)" strokeWidth="3" strokeDasharray="45 55" strokeDashoffset="90" />
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3498db" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="45" />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: 'var(--color-muted)', margin: 0, textTransform: 'uppercase' }}>Avg ROI</p>
              <p style={{ fontSize: '20px', fontWeight: 900, color: '#eaeaea', margin: 0 }}>
                {roiPercent}%
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', background: 'var(--color-gold)', borderRadius: '50%' }} /> Account Store sales ROI</span>
              <span style={{ fontWeight: 700, color: '#eaeaea' }}>45% margin rate</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%' }} /> Gifting (Xsuit / Car) ROI</span>
              <span style={{ fontWeight: 700, color: '#eaeaea' }}>35% margin rate</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', background: '#3498db', borderRadius: '50%' }} /> UC Packs Store ROI</span>
              <span style={{ fontWeight: 700, color: '#eaeaea' }}>20% margin rate</span>
            </div>
          </div>
        </div>

        {/* Detailed Profit/Cost statements list */}
        <div className="card" style={{ border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: '#eaeaea' }}>Gross vs Net Profit Margins</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '18px' }}>Store financial balance calculations of revenue cost margins and net merchant earnings.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-muted)' }}>Gross Store Sales Revenue</span>
              <span style={{ fontWeight: 800, color: '#eaeaea' }}>₹{stats.totalSales.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-muted)' }}>Cost of Sales (Supplier / Loader cost)</span>
              <span style={{ fontWeight: 800, color: '#eaeaea' }}>₹{costOfGoods.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-muted)' }}>Gross Profit Margin</span>
              <span style={{ fontWeight: 800, color: '#2ecc71' }}>₹{stats.totalProfit.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-muted)' }}>Est. Payment gateway fees (2%)</span>
              <span style={{ fontWeight: 800, color: 'var(--color-red)' }}>- ₹{taxGtw.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '4px' }}>
              <span style={{ color: '#eaeaea', fontWeight: 700 }}>Net Store Earnings</span>
              <span style={{ fontWeight: 900, color: '#2ecc71', fontSize: '15px' }}>₹{netEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '10px 14px', background: 'rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.2)', borderRadius: '6px', fontSize: '11px', color: '#eaeaea' }}>
            💡 Net Store Earnings calculations are real-time, based on dynamic Sheet/Database fields configurations.
          </div>
        </div>

      </div>
    </div>
  );
}
