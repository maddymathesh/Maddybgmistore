import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { fetchAllTransactions } from '../../services/transactionService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    pendingPayments: 0,
    activeGuarantees: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllTransactions();
      
      let sales = 0;
      let profit = 0;
      let pending = 0;
      let guarantees = 0;

      data.forEach(tx => {
        sales += Number(tx.sold_price) || 0;
        profit += Number(tx.profit) || 0;
        if (tx.payment_status === 'Pending') pending++;
        
        // Simple logic for active guarantees on accounts
        if (tx.transaction_type === 'Account' && tx.account_transactions?.[0]) {
          const acc = tx.account_transactions[0];
          if (acc.guarantee_void_date) {
            const voidDate = new Date(acc.guarantee_void_date);
            if (voidDate > new Date()) guarantees++;
          }
        }
      });

      setStats({
        totalSales: sales,
        totalProfit: profit,
        pendingPayments: pending,
        activeGuarantees: guarantees
      });
    } catch (error) {
      console.error("Error loading stats:", error);
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
      title: 'Active Guarantees',
      value: stats.activeGuarantees.toString(),
      icon: ShieldAlert,
      color: 'from-purple-600 to-purple-400',
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-white/10 transition-colors"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgLight}`}>
                    <Icon size={24} className={stat.text} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} /> +2.4%
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white/50 text-sm font-medium mb-1">{stat.title}</h3>
                  <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Placeholder for Charts / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Analytics</h3>
          <div className="flex items-center justify-center h-[300px] text-white/30 border-2 border-dashed border-white/5 rounded-xl">
            Chart Integration Pending
          </div>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
             {/* Mock Activity */}
             {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                    {i}
                  </div>
                  <div>
                    <p className="text-sm text-white">New Sale recorded</p>
                    <p className="text-xs text-white/40">2 hours ago</p>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
