"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Search, Calendar, Phone, Receipt, Shield, RefreshCw } from 'lucide-react';
import { fetchAllTransactions } from '../../services/transactionService';
import { toast } from 'sonner';

export default function GuaranteesList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'void'

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const txs = await fetchAllTransactions();
      setData(txs || []);
    } catch (error) {
      toast.error('Failed to load guarantees');
    } finally {
      setIsLoading(false);
    }
  };

  // Process transactions to find guarantee records (specifically for Accounts)
  const processedGuarantees = useMemo(() => {
    const guaranteesList = [];
    
    data.forEach(tx => {
      if (tx.transaction_type === 'Account' && tx.account_transactions?.[0]) {
        const acc = tx.account_transactions[0];
        
        // Guarantee plan detail
        const plan = acc.guarantee_plan || 'No Guarantee';
        const isNoGuarantee = plan.toLowerCase() === 'no guarantee' || plan.toLowerCase() === 'not applicable' || plan.toLowerCase() === 'n/a';
        
        // Void details
        const primaryVoid = acc.primary_guarantee_void_date;
        const secondaryVoid = acc.secondary_guarantee_void_date;
        
        // Expiration determination (use primary as reference or secondary)
        let voidDateStr = primaryVoid || secondaryVoid;
        let isVoid = isNoGuarantee;
        let daysLeft = 0;
        
        if (voidDateStr && !isNoGuarantee) {
          const voidDate = new Date(voidDateStr);
          const today = new Date();
          const diffTime = voidDate - today;
          daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (daysLeft <= 0) {
            isVoid = true;
          }
        } else {
          isVoid = true;
        }

        guaranteesList.push({
          transaction_id: tx.transaction_id,
          transaction_date: tx.transaction_date,
          buyer_phone: tx.buyer_phone,
          plan,
          primaryVoidDate: primaryVoid,
          secondaryVoidDate: secondaryVoid,
          primaryLogin: acc.primary_login_provider,
          secondaryLogin: acc.secondary_login_provider,
          daysLeft,
          isVoid,
          rawTx: tx
        });
      }
    });

    return guaranteesList;
  }, [data]);

  // Separate active and void
  const activeGuarantees = useMemo(() => {
    return processedGuarantees.filter(g => !g.isVoid);
  }, [processedGuarantees]);

  const voidGuarantees = useMemo(() => {
    return processedGuarantees.filter(g => g.isVoid);
  }, [processedGuarantees]);

  // Filter current active/void based on search query
  const displayedGuarantees = useMemo(() => {
    const currentList = activeTab === 'active' ? activeGuarantees : voidGuarantees;
    return currentList.filter(g => 
      g.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.buyer_phone && g.buyer_phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, activeGuarantees, voidGuarantees, searchQuery]);

  const copyPhoneNumber = (phone) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    toast.success('Phone number copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Search and Tabs */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active/Void tabs */}
          <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${activeTab === 'active' ? 'bg-white/5 text-white shadow-sm border border-white/10' : 'text-muted hover:text-white'}`}
            >
              <ShieldCheck size={13} className={activeTab === 'active' ? 'text-[#10b981]' : 'text-muted'} />
              Active Guarantees ({activeGuarantees.length})
            </button>
            <button
              onClick={() => setActiveTab('void')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${activeTab === 'void' ? 'bg-white/5 text-white shadow-sm border border-white/10' : 'text-muted hover:text-white'}`}
            >
              <ShieldAlert size={13} className={activeTab === 'void' ? 'text-red-500' : 'text-muted'} />
              Void / Expired ({voidGuarantees.length})
            </button>
          </div>
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/20 focus:border-gold/40 focus:ring-0 transition-all duration-200"
            placeholder="Search Tx, Phone, or Plan..."
          />
        </div>
      </div>

      {/* Guarantees List Display */}
      {isLoading ? (
        <div className="text-center py-16 text-muted">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full mb-3" />
          <p className="text-xs font-semibold tracking-wide uppercase">Analyzing active guarantees...</p>
        </div>
      ) : displayedGuarantees.length === 0 ? (
        <div className="glass-panel p-16 rounded-xl border border-white/5 bg-white/[0.01] text-center text-muted">
          <Shield size={40} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">No guarantees found under this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGuarantees.map((guarantee, idx) => (
            <motion.div
              key={guarantee.transaction_id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="glass-panel p-5 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:border-gold/20"
            >
              {/* Vertical side banner accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${guarantee.isVoid ? 'bg-white/10' : 'bg-gradient-to-b from-[#10b981] to-[#047857]'}`} />

              <div className="flex justify-between items-start pl-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gold font-bold">
                      {guarantee.transaction_id}
                    </span>
                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Calendar size={10} /> {new Date(guarantee.transaction_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2 font-h">
                    {guarantee.plan}
                  </h3>
                </div>

                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${guarantee.isVoid ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'}`}>
                  {guarantee.isVoid ? 'Void' : 'Active'}
                </span>
              </div>

              {/* Expiration stats / countdown */}
              {!guarantee.isVoid && (
                <div className="mt-4 pl-2">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-muted">Guarantee Time Remaining:</span>
                    <span className="font-bold text-[#10b981]">{guarantee.daysLeft} days left</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#047857] to-[#10b981] rounded-full" 
                      style={{ width: `${Math.min(100, (guarantee.daysLeft / 180) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Login Info Block */}
              <div className="mt-4 p-3 bg-white/[0.02] rounded-lg border border-white/5 grid grid-cols-2 gap-3 text-xs pl-2.5">
                <div>
                  <span className="text-[9px] text-muted block uppercase tracking-wider mb-0.5">Primary Login</span>
                  <span className="font-bold text-white font-mono">{guarantee.primaryLogin || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted block uppercase tracking-wider mb-0.5">Secondary Login</span>
                  <span className="font-bold text-white font-mono">{guarantee.secondaryLogin || 'N/A'}</span>
                </div>
              </div>

              {/* Footer contact */}
              <div className="flex justify-between items-center mt-4 text-[11px] pl-2">
                <button 
                  onClick={() => copyPhoneNumber(guarantee.buyer_phone)}
                  className="text-muted hover:text-gold transition-colors duration-150 flex items-center gap-1 font-mono"
                >
                  <Phone size={10} /> {guarantee.buyer_phone || 'No Phone'}
                </button>
                <span className="text-muted text-[10px]">
                  Expires: {guarantee.primaryVoidDate ? new Date(guarantee.primaryVoidDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
