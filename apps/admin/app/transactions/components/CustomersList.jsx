"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, ArrowUpRight, Calendar, Receipt, DollarSign, ExternalLink } from 'lucide-react';
import { fetchAllTransactions } from '../../services/transactionService';
import { toast } from 'sonner';

export default function CustomersList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions();
      setData(txs || []);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  // Group transactions by buyer phone to compute unique customer profiles
  const customers = useMemo(() => {
    const map = {};
    data.forEach(tx => {
      const phone = tx.buyer_phone ? tx.buyer_phone : 'Unknown';
      if (!map[phone]) {
        map[phone] = {
          phone,
          totalSpent: 0,
          ordersCount: 0,
          lastPurchaseDate: tx.transaction_date,
          transactions: []
        };
      }
      map[phone].totalSpent += Number(tx.sold_price || 0);
      map[phone].ordersCount += 1;
      map[phone].transactions.push(tx);
      
      // Update last purchase date if newer
      if (new Date(tx.transaction_date) > new Date(map[phone].lastPurchaseDate)) {
        map[phone].lastPurchaseDate = tx.transaction_date;
      }
    });

    // Convert map to array and sort by total spent
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [data]);

const filteredCustomers = useMemo(() => {
  return customers.filter((c) =>
    (c.phone || "")
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
}, [customers, searchQuery]);

  const copyToClipboard = (text, message = 'Copied to clipboard') => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:border-gold/40 focus:ring-0 transition-all duration-200"
            placeholder="Search by Customer Phone..."
          />
        </div>
        <div className="text-xs text-muted font-medium">
          Total Unique Customers: <span className="text-gold font-bold font-mono bg-gold/10 px-2 py-0.5 rounded-md border border-gold/15">{customers.length}</span>
        </div>
      </div>

      {/* Customers Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-muted">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full mb-3" />
          <p className="text-xs font-semibold tracking-wide uppercase">Processing customer records...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-white/5 bg-white/[0.01] text-center text-muted">
          <User size={40} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">No customers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, idx) => (
            <motion.div
              key={customer.phone}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => setSelectedCustomer(customer)}
              className="group relative glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm cursor-pointer overflow-hidden transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.02]"
              whileHover={{ y: -4, boxShadow: '0 12px 30px -10px rgba(255, 215, 0, 0.08)' }}
            >
              {/* Dynamic top highlight indicator depending on spender rank */}
              <div className={`absolute top-0 left-0 right-0 height-[3px] h-[3px] bg-gradient-to-r ${idx === 0 ? 'from-gold to-yellow-500' : idx === 1 ? 'from-slate-300 to-slate-400' : idx === 2 ? 'from-amber-600 to-amber-700' : 'from-white/10 to-white/5'}`} />
              
              <div className="flex justify-between items-start mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/25 shadow-[0_0_8px_rgba(255,215,0,0.15)] group-hover:scale-105 transition-transform duration-200">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(customer.phone, 'Customer phone number copied!');
                      }}
                      className="text-sm font-bold text-white font-mono hover:text-gold transition-colors duration-150 flex items-center gap-1.5"
                    >
                      {customer.phone}
                    </h3>
                    <p className="text-[11px] text-muted mt-0.5">
                      Last Purchase: {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase bg-gold/10 text-gold border border-gold/15 px-2 py-0.5 rounded">
                  Spender #{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                <div>
                  <span className="text-[10px] text-muted block uppercase tracking-wider">Total Spent</span>
                  <span className="text-base font-extrabold text-[#10b981] font-mono mt-0.5 block">
                    ₹{customer.totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block uppercase tracking-wider">Total Orders</span>
                  <span className="text-base font-extrabold text-gold font-mono mt-0.5 block">
                    {customer.ordersCount} deals
                  </span>
                </div>
              </div>

              <div className="flex justify-end items-center gap-1 mt-4 text-[11px] font-semibold text-gold opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                View History <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="modal-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end" onClick={() => setSelectedCustomer(null)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg h-screen bg-neutral-950 border-l border-white/5 p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h2 
                        onClick={() => copyToClipboard(selectedCustomer.phone, 'Customer phone number copied!')}
                        className="text-xl font-black text-white hover:text-gold transition-colors duration-150 cursor-pointer font-mono"
                      >
                        {selectedCustomer.phone}
                      </h2>
                      <p className="text-xs text-muted">VIP Customer Profile</p>
                    </div>
                  </div>
                  <button 
                    className="text-2xl text-muted hover:text-white transition-colors duration-150 font-light"
                    onClick={() => setSelectedCustomer(null)}
                  >
                    ×
                  </button>
                </div>

                {/* Quick stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                    <span className="text-[10px] text-muted block uppercase tracking-wider mb-1">Total Contribution</span>
                    <span className="text-xl font-extrabold text-[#10b981] font-mono">
                      ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                    <span className="text-[10px] text-muted block uppercase tracking-wider mb-1">Total Purchases</span>
                    <span className="text-xl font-extrabold text-gold font-mono">
                      {selectedCustomer.ordersCount} Deals
                    </span>
                  </div>
                </div>

                {/* Transactions Timeline */}
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-h uppercase tracking-wider">
                  <Receipt size={14} className="text-gold" /> Purchase History
                </h3>

                <div className="space-y-4">
                  {selectedCustomer.transactions.map((tx) => (
                    <div
                      key={tx.transaction_id}
                      className="p-4 rounded-lg bg-white/[0.01] border border-white/5 hover:border-gold/10 transition-colors duration-200 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-gold font-bold">
                          {tx.transaction_id}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${tx.transaction_type === 'Account' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : tx.transaction_type === 'XSuit' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : tx.transaction_type === 'Supercar' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                          {tx.transaction_type}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 text-muted">
                          <Calendar size={12} /> {new Date(tx.transaction_date).toLocaleDateString()}
                        </div>
                        <div className="font-extrabold text-white font-mono">
                          ₹{Number(tx.sold_price || 0).toLocaleString()}
                        </div>
                      </div>

                      {/* Details details */}
                      <div className="flex gap-4 border-t border-white/5 pt-2.5 text-[10px] text-muted">
                        <div>Mode: <span className="text-white font-medium">{tx.mode_of_deal}</span></div>
                        <div>Payment: <span className="text-white font-medium">{tx.payment_status}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 text-center text-[11px] text-muted border-t border-white/5 pt-4">
                VIP Profile generated from store registry sheet database files.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
