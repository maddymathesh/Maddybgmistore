"use client";

import React, { useState } from 'react';
import { Users, Phone, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import SettingsPDFControls from './SettingsPDFControls';

export default function SettingsView() {
  const [whatsappSupport, setWhatsappSupport] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mbs_whatsapp') || '+91 90253 91516';
    }
    return '+91 90253 91516';
  });

  const [rolePermissions, setRolePermissions] = useState({
    super_admin: { create: true, edit: true, delete: true, viewProfit: true },
    store_admin: { create: true, edit: true, delete: false, viewProfit: true },
    transaction_manager: { create: true, edit: false, delete: false, viewProfit: false }
  });

  const handleSaveSupport = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mbs_whatsapp', whatsappSupport);
    }
    toast.success('WhatsApp Support Contact updated successfully');
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cached_transactions');
      localStorage.removeItem('cached_transactions_time');
    }
    toast.success('Local Storage caching cleared successfully!');
  };

  const togglePermission = (role, perm) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role][perm]
      }
    }));
    toast.success(`Permission updated for ${role.replace('_', ' ')}`);
  };

  const ROLES = [
    { id: 'super_admin', label: 'Super Admin', desc: 'Full administrative and destructive access. Can oversee all store operations.' },
    { id: 'store_admin', label: 'Store Admin', desc: 'Can manage transactions and view financials, but cannot delete records.' },
    { id: 'transaction_manager', label: 'Transaction Manager', desc: 'Responsible for entering day-to-day deals without access to profit margins.' }
  ];

  const PERMISSION_LABELS = {
    create: 'Create Transactions',
    edit: 'Edit Transactions',
    delete: 'Delete Transactions',
    viewProfit: 'View Financials & Profits'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Role and Permissions Control */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 font-h uppercase tracking-wider relative z-10">
          <Users size={16} className="text-amber-500" /> Role & Permission Matrix
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {ROLES.map(role => (
            <div key={role.id} className="bg-white/[0.02] p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors duration-300 shadow-inner group">
              <strong className="block text-base text-white font-bold tracking-wide font-h uppercase">{role.label}</strong>
              <span className="block text-[11.5px] text-muted mb-6 mt-1.5 leading-relaxed">{role.desc}</span>
              
              {/* Permissions list toggles */}
              <div className="space-y-4">
                {Object.keys(PERMISSION_LABELS).map((perm) => {
                  const isEnabled = rolePermissions[role.id][perm];
                  return (
                    <div key={perm} className="flex justify-between items-center group/item">
                      <span className="text-xs text-muted font-medium transition-colors group-hover/item:text-white/80">
                        {PERMISSION_LABELS[perm]}
                      </span>
                      <button
                        onClick={() => togglePermission(role.id, perm)}
                        className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080a0f] focus:ring-yellow-500/50 ${
                          isEnabled ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <span 
                          className={`absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full transition-transform duration-300 ${
                            isEnabled ? 'translate-x-[20px] bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'translate-x-0 bg-white/40'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-h uppercase tracking-wider relative z-10">
            <Phone size={16} className="text-yellow-500" /> Default Customer Support
          </h3>
          <p className="text-[11.5px] text-muted mb-5 relative z-10">
            This contact number is utilized as the default support line across generated receipts and the main portal header.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <input
              value={whatsappSupport}
              onChange={e => setWhatsappSupport(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:border-yellow-500/40 focus:ring-0 transition-all duration-200 outline-none font-mono"
              placeholder="+91 90253 91516"
            />
            <button onClick={handleSaveSupport} className="btn btn-gold px-6 py-2.5 text-xs font-bold rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all duration-300 whitespace-nowrap">
              Save Contact
            </button>
          </div>
        </div>

        {/* Caching panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:bg-red-500/10" />
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-h uppercase tracking-wider relative z-10">
            <RefreshCw size={16} className="text-red-400" /> Clear Local Data Cache
          </h3>
          <p className="text-[11.5px] text-muted leading-relaxed mb-5 relative z-10">
            Erase local device storage for the transaction matrix. Utilize this safely to force a completely fresh pull from the backend to resolve desynchronization.
          </p>
          <button onClick={handleClearCache} className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-bold rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-300 relative z-10">
            <RefreshCw size={14} /> Force Clear Local Cache
          </button>
        </div>
      </div>

      {/* PDF Visibility Configuration preferences */}
      <SettingsPDFControls />
    </div>
  );
}
