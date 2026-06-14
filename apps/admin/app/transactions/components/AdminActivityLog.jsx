"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Shield, Download, FileText, Settings, Plus, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminActivityLog() {
  const [filterType, setFilterType] = useState('All');

  const [logs, setLogs] = useState([
    { text: 'Downloaded Confidential Admin PDF for Transaction #TX8403', time: '12 mins ago', type: 'Downloads', user: 'Owner' },
    { text: 'Role config saved: PDF visibility preferences globally updated', time: '1 hour ago', type: 'Settings', user: 'Owner' },
    { text: 'Seller created new UC Order deal #TX8412', time: '2 hours ago', type: 'Transactions', user: 'Seller (Maddy)' },
    { text: 'Cleared temporary local transaction cache to sync sheets', time: '4 hours ago', type: 'Settings', user: 'Owner' },
    { text: 'Owner downloaded Customer Receipt PDF for Transaction #TX8399', time: '5 hours ago', type: 'Downloads', user: 'Owner' },
    { text: 'Admin account login successful from IP: 157.44.103.92', time: '8 hours ago', type: 'Security', user: 'Owner' },
    { text: 'Created new supercar transaction ID #TX8395', time: 'Yesterday', type: 'Transactions', user: 'Seller (Maddy)' },
    { text: 'Unlink status marked verified for transaction #TX8391', time: 'Yesterday', type: 'Transactions', user: 'Loader (Suresh)' },
    { text: 'Owner changed WhatsApp Support details configuration', time: '2 days ago', type: 'Settings', user: 'Owner' },
    { text: 'Successful security PIN verification session initialized', time: '3 days ago', type: 'Security', user: 'Owner' }
  ]);

  const filteredLogs = filterType === 'All' ? logs : logs.filter(l => l.type === filterType);

  const getIcon = (type) => {
    switch (type) {
      case 'Downloads': return <Download size={14} className="text-gold" />;
      case 'Settings': return <Settings size={14} className="text-[#3b82f6]" />;
      case 'Transactions': return <Plus size={14} className="text-[#10b981]" />;
      case 'Security': return <Key size={14} className="text-red-500" />;
      default: return <FileText size={14} className="text-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white font-h">Admin Audit Logs</h2>
          <p className="text-xs text-muted mt-1">Security trace timeline tracking administrative actions, configuration updates and downloads.</p>
        </div>

        <div className="flex gap-1.5 bg-neutral-900/50 p-1.5 rounded-lg border border-white/5 overflow-x-auto w-full md:w-auto">
          {['All', 'Transactions', 'Downloads', 'Settings', 'Security'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${filterType === type ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]' : 'text-muted hover:text-white hover:bg-white/5 border border-transparent'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-white/5 bg-white/[0.01] backdrop-blur-md">
        <h3 className="text-base font-bold text-white mb-8 flex items-center gap-2 font-h uppercase tracking-wider">
          <History size={16} className="text-gold" /> Live Audit Timeline ({filteredLogs.length} events)
        </h3>

        <div className="flex flex-col space-y-6 relative pl-3">
          {/* Timeline background vertical line */}
          <div className="absolute top-2 bottom-4 left-3 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent z-0" />

          {filteredLogs.map((log, i) => (
            <div
              key={i}
              className="relative flex items-start gap-4 z-10 group"
            >
              {/* Timeline indicator node */}
              <div className="absolute -left-[18px] top-1 w-8 h-8 rounded-full bg-[#0a0a0a] border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:border-gold/40 group-hover:bg-gold/5 group-hover:scale-110">
                {getIcon(log.type)}
              </div>

              <div className="flex-1 ml-6 p-4 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-colors duration-200">
                <p className="text-sm text-white font-medium mb-1">{log.text}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted font-mono mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Shield size={10} className="text-muted" /> {log.user}
                  </span>
                  <span className="opacity-50">•</span>
                  <span>{log.time}</span>
                  <span className="opacity-50">•</span>
                  <span className="font-bold text-gold tracking-wider">{log.type}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-muted text-sm border border-dashed border-white/10 rounded-xl">
              No system activity events matched your selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
