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

  return (
    <div className="space-y-6">
      {/* Search and Tabs */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Active/Void tabs */}
          <div style={{ display: 'flex', background: 'var(--bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setActiveTab('active')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: activeTab === 'active' ? 'var(--text)' : 'var(--muted)',
                background: activeTab === 'active' ? 'var(--bg2)' : 'transparent',
                border: activeTab === 'active' ? '1px solid var(--border-gold)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={14} style={{ color: activeTab === 'active' ? '#34d399' : 'var(--muted)' }} />
              Active Guarantees ({activeGuarantees.length})
            </button>
            <button
              onClick={() => setActiveTab('void')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: activeTab === 'void' ? 'var(--text)' : 'var(--muted)',
                background: activeTab === 'void' ? 'var(--bg2)' : 'transparent',
                border: activeTab === 'void' ? '1px solid var(--border-gold)' : '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldAlert size={14} style={{ color: activeTab === 'void' ? 'var(--red)' : 'var(--muted)' }} />
              Void / Expired ({voidGuarantees.length})
            </button>
          </div>

          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '36px', height: '38px' }}
              placeholder="Search by Tx ID, Phone, or Plan..."
            />
          </div>
        </div>
      </div>

      {/* Guarantees List Display */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '12px' }} />
          <p>Analyzing active guarantees...</p>
        </div>
      ) : displayedGuarantees.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <Shield size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          No guarantees found under this category.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {displayedGuarantees.map((guarantee, idx) => (
            <motion.div
              key={guarantee.transaction_id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="card"
              style={{
                border: guarantee.isVoid ? '1px solid var(--border)' : '1px solid var(--border-gold)',
                background: 'var(--bg2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Vertical side banner accent */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: guarantee.isVoid ? 'var(--border)' : 'linear-gradient(180deg, #34d399, #10b981)'
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, fontFamily: 'monospace' }}>
                      {guarantee.transaction_id}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} /> {new Date(guarantee.transaction_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '8px', color: 'var(--text)' }}>
                    {guarantee.plan}
                  </h3>
                </div>

                <div className={`status ${guarantee.isVoid ? 'status-sold' : 'status-available'}`} style={{ fontSize: '10px' }}>
                  {guarantee.isVoid ? 'Void / Expired' : 'Active'}
                </div>
              </div>

              {/* Expiration stats / countdown */}
              {!guarantee.isVoid && (
                <div style={{ marginTop: '16px', paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--muted)' }}>Time Remaining:</span>
                    <span style={{ fontWeight: 700, color: '#34d399' }}>{guarantee.daysLeft} days left</span>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, (guarantee.daysLeft / 180) * 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #34d399)',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              )}

              {/* Login Info Block */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'var(--bg)',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '12px',
                border: '1px solid var(--border)',
                marginLeft: '8px'
              }}>
                <div>
                  <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Primary Login</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{guarantee.primaryLogin || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Secondary Login</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{guarantee.secondaryLogin || 'N/A'}</span>
                </div>
              </div>

              {/* Footer contact */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} /> {guarantee.buyer_phone || 'No Phone'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Void Date: {guarantee.primaryVoidDate ? new Date(guarantee.primaryVoidDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
